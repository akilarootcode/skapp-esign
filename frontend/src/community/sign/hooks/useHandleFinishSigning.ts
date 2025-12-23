import { useRouter } from "next/router";
import { useState } from "react";

import ROUTES from "~community/common/constants/routes";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { FileCategories } from "~community/common/types/s3Types";
import {
  uploadFileToS3ByUrl,
  uploadFileToS3ByUrlWithESignToken
} from "~community/common/utils/awsS3ServiceFunctions";
import { useSignDocument } from "~community/sign/api/SignApi";
import {
  DocumentFieldHeights,
  DocumentFieldWidths,
  DocumentFieldsIdentifiers,
  EnvelopeStatus
} from "~community/sign/enums/CommonDocumentsEnums";
import { RedirectStatus } from "~community/sign/enums/CommonEnums";
import { useESignStore } from "~community/sign/store/signStore";
import {
  DocumentStatus,
  SignDocumentResponse
} from "~community/sign/types/CommonEsignTypes";
import { SignatureFieldStatus } from "~community/sign/types/ESignFormTypes";
import { uploadFilledFieldToS3 } from "~community/sign/utils/signatureUtils";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

import {
  SIGN_ERROR_DOCUMENT_ALREADY_SIGNED,
  SIGN_ERROR_MESSAGE_RECIPIENT_DECLINED
} from "../constants/errorMessageKeys";

export const useHandleFinishSigning = (isInternalUser?: boolean) => {
  const router = useRouter();
  const translateText = useTranslator("eSignatureModule", "sign");
  const { setToastMessage } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendEvent } = useGoogleAnalyticsEvent();

  const {
    documentId,
    recipientId,
    envelopeId,
    signatureFields,
    documentInfo,
    setDocumentInfo,
    setSignatureFields,
    signatureToUpload,
    initialsToUpload,
    stampToUpload,
    autoFilledDate,
    signatureLink,
    eSignToken
  } = useESignStore();

  const handleSignDocumentSuccess = (response: SignDocumentResponse) => {
    setSignatureFields([]);
    if (response && typeof response === "object" && response.accessLink) {
      if (documentInfo) {
        setDocumentInfo({
          ...documentInfo,
          documentLinkResponseDto: {
            ...documentInfo.documentLinkResponseDto,
            url: response.accessLink
          }
        });
      }
    }

    const redirectStatus =
      response &&
      typeof response === "object" &&
      response.status === EnvelopeStatus.COMPLETED
        ? RedirectStatus.COMPLETED_DOCUMENT
        : RedirectStatus.ALL_DONE;

    router.push({
      pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
      query: {
        status: redirectStatus,
        ...(isInternalUser !== undefined && { isInternalUser })
      }
    });

    setIsSubmitting(false);
  };

  const { mutate: signDocument } = useSignDocument(
    (response) => {
      handleSignDocumentSuccess(response);
    },
    (error) => {
      setIsSubmitting(false);

      if (
        error?.response?.status === 400 &&
        error?.response?.data?.results?.[0]?.messageKey ===
          SIGN_ERROR_MESSAGE_RECIPIENT_DECLINED
      ) {
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["toast.generalErrorTitle"]),
          description: translateText(["toast.alreadyDeclinedDesc"]),
          isIcon: true
        });
        return;
      }

      if (
        error?.response?.status === 400 &&
        error?.response?.data?.results?.[0]?.messageKey ===
          SIGN_ERROR_DOCUMENT_ALREADY_SIGNED
      ) {
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["toast.generalErrorTitle"]),
          description: translateText(["toast.alreadySignedDesc"]),
          isIcon: true
        });
        return;
      }

      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["toast.generalErrorTitle"]),
        description: translateText(["toast.failedToSignDocumentDesc"]),
        isIcon: true
      });
    }
  );

  const handleFinishSigning = async () => {
    if (!documentId || !recipientId || !envelopeId) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["toast.generalErrorTitle"]),
        description: translateText(["missingRequiredDataDescription"]),
        isIcon: true
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedFields = [...(signatureFields || [])];
      const uploadPromises: Promise<void>[] = [];

      if (signatureToUpload) {
        const signatureUploadPromise = (async () => {
          let signatureS3Path: string;

          if (!isInternalUser && eSignToken) {
            signatureS3Path = await uploadFileToS3ByUrlWithESignToken(
              signatureToUpload,
              FileCategories.ESIGN_SIGNATURE_ORIGINAL,
              eSignToken
            );
          } else {
            signatureS3Path = await uploadFileToS3ByUrl(
              signatureToUpload,
              FileCategories.ESIGN_SIGNATURE_ORIGINAL
            );
          }

          updatedFields.forEach((field) => {
            if (field.type === DocumentFieldsIdentifiers.SIGN) {
              field.fieldValueResponseDto = signatureS3Path;
              field.status = SignatureFieldStatus.COMPLETED;
            }
          });
        })();
        uploadPromises.push(signatureUploadPromise);
      }

      if (initialsToUpload) {
        let initialsS3Path: string;

        if (initialsToUpload instanceof File) {
          if (!isInternalUser && eSignToken) {
            initialsS3Path = await uploadFileToS3ByUrlWithESignToken(
              initialsToUpload,
              FileCategories.ESIGN_INITIALS_ORIGINAL,
              eSignToken
            );
          } else {
            initialsS3Path = await uploadFileToS3ByUrl(
              initialsToUpload,
              FileCategories.ESIGN_INITIALS_ORIGINAL
            );
          }
        } else if (typeof initialsToUpload === "string") {
          initialsS3Path = initialsToUpload;
        }

        updatedFields.forEach((field) => {
          if (field.type === DocumentFieldsIdentifiers.INITIAL) {
            field.fieldValueResponseDto = initialsS3Path;
            field.status = SignatureFieldStatus.COMPLETED;
          }
        });
      }

      if (stampToUpload) {
        const stampToUploadPromise = uploadFilledFieldToS3({
          fieldData: stampToUpload,
          documentId,
          recipientId,
          fieldType: DocumentFieldsIdentifiers.STAMP,
          fieldWidth: DocumentFieldWidths.INITIAL_AND_STAMP,
          fieldHeight: DocumentFieldHeights.INITIAL_AND_STAMP,
          isInternalUser,
          eSignToken
        }).then((stampS3Path) => {
          updatedFields.forEach((field) => {
            if (field.type === DocumentFieldsIdentifiers.STAMP) {
              field.fieldValueResponseDto = stampS3Path;
              field.status = SignatureFieldStatus.COMPLETED;
            }
          });
        });
        uploadPromises.push(stampToUploadPromise);
      }

      await Promise.all(uploadPromises);

      setSignatureFields(updatedFields);

      const fieldData = updatedFields.map((field) => {
        let fieldValue = field.fieldValueResponseDto ?? "";
        let status = SignatureFieldStatus.COMPLETED;

        if (field.type === DocumentFieldsIdentifiers.SIGN && signatureLink) {
          if (fieldValue === "") {
            // Transform the signature link URL
            let transformedUrl = signatureLink;
            if (signatureLink.includes("/envelop")) {
              const envelopePart = signatureLink.substring(
                signatureLink.indexOf("/envelop")
              );
              transformedUrl = `eSign${envelopePart}`;
            }
            fieldValue = transformedUrl;
          }
        } else if (field.type === DocumentFieldsIdentifiers.DATE) {
          fieldValue = autoFilledDate;
        } else if (field.type === DocumentFieldsIdentifiers.EMAIL) {
          fieldValue = documentInfo?.email || fieldValue;
        } else if (field.type === DocumentFieldsIdentifiers.NAME) {
          fieldValue = documentInfo?.name || fieldValue;
        } else if (field.type === DocumentFieldsIdentifiers.APPROVE) {
          fieldValue = DocumentStatus.APPROVED;
        } else if (field.type === DocumentFieldsIdentifiers.DECLINE) {
          status = SignatureFieldStatus.SKIPPED;
          fieldValue = DocumentStatus.DECLINED;
        }

        sendEvent(GoogleAnalyticsTypes.GA4_ESIGN_ENVELOPE_SIGNED);

        return {
          fieldId: field.id,
          type: field.type,
          status: status,
          pageNumber: field.pageNumber,
          xposition: field.xposition,
          yposition: field.yposition,
          width: Number(field.width),
          height: Number(field.height),
          fieldValue: fieldValue
        };
      });

      signDocument({
        payload: {
          documentId: Number(documentId),
          recipientId: Number(recipientId),
          envelopeId: Number(envelopeId),
          fieldSignDtoList: fieldData || []
        },
        isInternalUser
      });
    } catch (error) {
      setIsSubmitting(false);
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["toast.generalErrorTitle"]),
        description: translateText(["toast.failedToSignDocumentDesc"]),
        isIcon: true
      });
    }
  };

  return {
    isSubmitting,
    handleFinishSigning
  };
};

export default useHandleFinishSigning;
