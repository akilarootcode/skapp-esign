import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import { EVENTS_TO_IDENTIFY_IDLE_USER } from "~community/common/constants/commonConstants";
import { COMMON_ERROR_TOKEN_EXPIRED } from "~community/common/constants/errorMessageKeys";
import ROUTES from "~community/common/constants/routes";
import { ButtonSizes, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { decodeJWTToken } from "~community/common/utils/authUtils";
import {
  useSetDocumentCookies,
  useSetExternalDocumentCookies
} from "~community/sign/api/CloudFrontApi";
import {
  useGetESignConfigs,
  useGetExternalESignConfigs
} from "~community/sign/api/ConfigApi";
import { useCreateAuditLog } from "~community/sign/api/EnvelopeApi";
import {
  useAccessDocumentLink,
  useTokenExchange
} from "~community/sign/api/SignApi";
import SignAreYouSureModal from "~community/sign/components/molecules/SignAreYouSureModal/SignAreYouSureModal";
import PdfViewerWithSignature from "~community/sign/components/organisms/SignFlow/PdfViewerWithSignature/PdfViewerWithSignature";
import {
  IDLE_USER_TIMEOUT,
  SESSION_WARNING_TIMEOUT
} from "~community/sign/constants";
import {
  AddressBookUserType,
  DocumentFieldsIdentifiers,
  DocumentSignModalTypes,
  DocumentUserPrivilege,
  EnvelopeStatus
} from "~community/sign/enums/CommonDocumentsEnums";
import {
  EnvelopeAction,
  RedirectStatus
} from "~community/sign/enums/CommonEnums";
import { useHandleFinishSigning } from "~community/sign/hooks/useHandleFinishSigning";
import { useESignStore } from "~community/sign/store/signStore";
import { DocumentAccessLinkResponseDto } from "~community/sign/types/CommonEsignTypes";
import { SignatureFieldStatus } from "~community/sign/types/ESignFormTypes";
import { transformSignFields } from "~community/sign/utils/pdfViewUtils";

const Sign = () => {
  const router = useRouter();
  const translateText = useTranslator("eSignatureModule", "sign");
  const { setToastMessage } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldExchangeToken, setShouldExchangeToken] = useState(false);
  const [tokenExchangeParams, setTokenExchangeParams] = useState<{
    uuid: string;
    state: string;
  } | null>(null);
  const [sessionWarningShown, setSessionWarningShown] = useState(false);
  const [cookiesReady, setCookiesReady] = useState(false);
  const [hasAccessedDocument, setHasAccessedDocument] = useState(false);

  const { mutate: setInternalDocumentCookies } = useSetDocumentCookies();
  const { mutate: setExternalDocumentCookies } =
    useSetExternalDocumentCookies();

  const {
    completeFlowSignatureFields,
    setSigningCompleteModalOpen,
    documentInfo,
    eSignToken,
    setESignConfigs,
    setCompleteFlowSignatureFields,
    setDocumentInfo,
    setDocumentId,
    setRecipientId,
    setEnvelopeId,
    setUserType,
    setESignToken,
    setSignatureLink,
    signatureFields
  } = useESignStore();

  const isInternalUser = router.query.isInternalUser === "true";

  const { isSubmitting, handleFinishSigning } =
    useHandleFinishSigning(isInternalUser);

  useEffect(() => {
    if (isInternalUser) {
      setCookiesReady(true);
    } else {
      setCookiesReady(false);
    }
  }, [isInternalUser]);

  const internalConfigsResult = useGetESignConfigs(isInternalUser);
  const externalConfigsResult = useGetExternalESignConfigs(!isInternalUser);

  const { data: configData } = isInternalUser
    ? internalConfigsResult
    : externalConfigsResult;

  const [isAreYouSureModalOpen, setIsAreYouSureModalOpen] =
    useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate: createAuditLog } = useCreateAuditLog();

  useEffect(() => {
    const setupCloudFrontCookies = async () => {
      try {
        if (isInternalUser) {
          await new Promise<void>((resolve, reject) => {
            setInternalDocumentCookies(undefined, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error)
            });
          });
        } else if (eSignToken) {
          await new Promise<void>((resolve, reject) => {
            setExternalDocumentCookies(undefined, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error)
            });
          });
          setCookiesReady(true);
        }
      } catch (error) {
        if (error?.response?.data?.results) {
          const errorResults = error.response.data.results;
          if (
            errorResults[0].code === 401 &&
            errorResults[0].messageKey === COMMON_ERROR_TOKEN_EXPIRED
          ) {
            router.push({
              pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
              query: {
                status: RedirectStatus.EXPIRED_LINK,
                ...(isInternalUser && { isInternalUser: isInternalUser })
              }
            });
            return;
          }
        }
        router.push({
          pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
          query: {
            status: RedirectStatus.DOCUMENT_NOT_FOUND,
            ...(isInternalUser && { isInternalUser: isInternalUser })
          }
        });
      }
    };

    if (isInternalUser || eSignToken) {
      setupCloudFrontCookies();
    }
  }, [
    isInternalUser,
    eSignToken,
    setInternalDocumentCookies,
    setExternalDocumentCookies,
    router
  ]);

  const { mutate: exchangeToken } = useTokenExchange(
    async (tokenData) => {
      if (tokenData && tokenData.token) {
        setESignToken(tokenData.token);

        if (!isInternalUser) {
          try {
            await new Promise<void>((resolve, reject) => {
              setExternalDocumentCookies(undefined, {
                onSuccess: () => resolve(),
                onError: (error) => reject(error)
              });
            });
            setCookiesReady(true);
          } catch {
            router.push({
              pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
              query: {
                status: RedirectStatus.DOCUMENT_NOT_FOUND,
                isInternalUser: isInternalUser
              }
            });
            return;
          }
        }

        setShouldExchangeToken(false);
      } else {
        router.push({
          pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
          query: {
            status: RedirectStatus.DOCUMENT_NOT_FOUND,
            ...(isInternalUser && { isInternalUser: isInternalUser })
          }
        });
      }
    },
    () => {
      router.push({
        pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
        query: {
          status: RedirectStatus.DOCUMENT_NOT_FOUND,
          ...(isInternalUser && { isInternalUser: isInternalUser })
        }
      });
    }
  );

  const { mutate: accessDocumentLink } = useAccessDocumentLink(
    (documentData) => {
      if (documentData) {
        const formattedDocumentInfo: DocumentAccessLinkResponseDto = {
          name: documentData.name,
          email: documentData.email,
          envelopeId: documentData.envelopeId,
          subject: documentData.subject,
          recipientResponseDto: {
            id: documentData.recipientResponseDto?.id,
            memberRole: documentData.recipientResponseDto?.memberRole,
            status: documentData.recipientResponseDto?.status,
            signingOrder: documentData.recipientResponseDto?.signingOrder,
            color: documentData.recipientResponseDto?.color,
            addressBook: documentData.recipientResponseDto?.addressBook,
            consent: documentData.recipientResponseDto?.consent
          },
          senderEmail: documentData.senderEmail,
          fieldResponseDtoList: documentData.fieldResponseDtoList || [],
          documentDetailResponseDto: documentData.documentDetailResponseDto,
          documentLinkResponseDto: documentData.documentLinkResponseDto
        };

        setDocumentInfo(formattedDocumentInfo);
        setSignatureLink(
          documentData.recipientResponseDto?.addressBook?.mySignatureLink ?? ""
        );

        if (
          documentData.fieldResponseDtoList &&
          documentData.fieldResponseDtoList.length > 0
        ) {
          setCompleteFlowSignatureFields(
            transformSignFields(documentData.fieldResponseDtoList)
          );
        }

        createAuditLog({
          auditTrailDto: {
            envelopeId: documentData.envelopeId,
            action: EnvelopeAction.ENVELOPE_VIEWED,
            recipientId: Number(documentData.recipientResponseDto?.id)
          },
          isInternalUser: isInternalUser
        });

        setIsLoading(false);
      }
    },
    (error) => {
      if (error?.response?.data?.results) {
        const errorResults = error.response.data.results;

        if (
          errorResults[0].code === 401 &&
          errorResults[0].messageKey === COMMON_ERROR_TOKEN_EXPIRED
        ) {
          router.push({
            pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
            query: {
              status: RedirectStatus.EXPIRED_LINK,
              ...(isInternalUser && { isInternalUser: isInternalUser })
            }
          });
          return;
        }
      }

      router.push({
        pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
        query: {
          status: RedirectStatus.DOCUMENT_NOT_FOUND,
          ...(isInternalUser && { isInternalUser: isInternalUser })
        }
      });
    }
  );

  useEffect(() => {
    if (hasAccessedDocument) {
      return;
    }

    if (!eSignToken && !isInternalUser) {
      const { uuid, state } = router.query;

      if (uuid && state) {
        setTokenExchangeParams({
          uuid: encodeURIComponent(uuid.toString()),
          state: encodeURIComponent(state.toString())
        });
        setShouldExchangeToken(true);
      } else {
        router.push({
          pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
          query: {
            status: RedirectStatus.DOCUMENT_NOT_FOUND,
            ...{ isInternalUser: isInternalUser }
          }
        });
      }
      return;
    }

    if (!isInternalUser && !cookiesReady) {
      return;
    }

    const { envelopeId, documentId, recipientId } = router.query;

    if (envelopeId && documentId && recipientId) {
      // Set internal since this is in internal flow
      setUserType(AddressBookUserType.INTERNAL);
      setEnvelopeId(Number(envelopeId));
      setDocumentId(documentId.toString());
      setRecipientId(Number(recipientId));
      setHasAccessedDocument(true);
      accessDocumentLink({
        isInternalUser: isInternalUser,
        documentId: documentId.toString(),
        recipientId: recipientId.toString()
      });
      return;
    }

    try {
      if (eSignToken) {
        const decoded = decodeJWTToken(eSignToken);
        if (
          decoded?.documentId &&
          decoded?.recipientId &&
          decoded?.envelopeId
        ) {
          setEnvelopeId(decoded.envelopeId);
          setDocumentId(decoded.documentId);
          setRecipientId(decoded.recipientId);
          setUserType(decoded.userType);
          setHasAccessedDocument(true);

          accessDocumentLink({
            isInternalUser: isInternalUser,
            documentId: decoded.documentId,
            recipientId: decoded.recipientId
          });
        } else {
          router.push({
            pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
            query: {
              status: RedirectStatus.DOCUMENT_NOT_FOUND,
              ...(isInternalUser && { isInternalUser: isInternalUser })
            }
          });
        }
      }
    } catch {
      router.push({
        pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
        query: {
          status: RedirectStatus.DOCUMENT_NOT_FOUND,
          ...(isInternalUser && { isInternalUser: isInternalUser })
        }
      });
    }
  }, [eSignToken, cookiesReady, isInternalUser, hasAccessedDocument]);

  useEffect(() => {
    if (shouldExchangeToken && tokenExchangeParams) {
      exchangeToken(tokenExchangeParams);
      setShouldExchangeToken(false);
    }
  }, [shouldExchangeToken, tokenExchangeParams]);

  useEffect(() => {
    const resetIdleTimer = () => {
      // Clear existing timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }

      // Reset warning state
      setSessionWarningShown(false); // Set warning timer (18 minutes after activity)
      warningTimeoutRef.current = setTimeout(() => {
        if (!sessionWarningShown) {
          setToastMessage({
            open: true,
            title: translateText(["toast.sessionWarning.title"]),
            description: translateText(["toast.sessionWarning.description"]),
            toastType: ToastType.WARN
          });
          setSessionWarningShown(true);
        }
      }, SESSION_WARNING_TIMEOUT);

      // Set session timeout (20 minutes after activity)
      timeoutRef.current = setTimeout(() => {
        router.push({
          pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
          query: {
            status: RedirectStatus.SESSION_EXPIRED,
            ...(isInternalUser && { isInternalUser: isInternalUser })
          }
        });
      }, IDLE_USER_TIMEOUT);
    };

    resetIdleTimer();

    EVENTS_TO_IDENTIFY_IDLE_USER.forEach((event) => {
      window.addEventListener(event, resetIdleTimer);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }

      EVENTS_TO_IDENTIFY_IDLE_USER.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [router, isInternalUser, setToastMessage, sessionWarningShown]);

  useEffect(() => {
    configData && setESignConfigs(configData);
  }, [configData]);

  const handleBackClick = () => {
    if (documentInfo?.status === EnvelopeStatus.COMPLETED) {
      if (isInternalUser) {
        router.back();
      } else {
        router.push(ROUTES.SIGN.INFO);
      }
      return;
    }

    const hasCompletedSignature = completeFlowSignatureFields.some(
      (field) => field.fieldStatus === SignatureFieldStatus.COMPLETED
    );

    if (hasCompletedSignature) {
      setSigningCompleteModalOpen(DocumentSignModalTypes.CANCEL_FLOW);
    } else {
      setIsAreYouSureModalOpen(true);
    }
  };

  const hasIncompleteRequiredFields = useMemo(() => {
    const result = Boolean(
      signatureFields?.some((field) => {
        const isSignatureField =
          field.type === DocumentFieldsIdentifiers.SIGN ||
          field.type === DocumentFieldsIdentifiers.INITIAL ||
          field.type === DocumentFieldsIdentifiers.STAMP ||
          field.type === DocumentFieldsIdentifiers.APPROVE;

        const isIncomplete =
          isSignatureField && field.status !== SignatureFieldStatus.COMPLETED;

        return isIncomplete;
      })
    );
    return result;
  }, [signatureFields]);

  const shouldShowFinishButton = useMemo(() => {
    const isNotCC =
      documentInfo?.recipientResponseDto?.memberRole !==
      DocumentUserPrivilege.CC;
    const isNotCompleted = documentInfo?.status === EnvelopeStatus.NEED_TO_SIGN;
    return isNotCC && isNotCompleted;
  }, [documentInfo]);

  const getTitle = () => {
    return documentInfo?.status === EnvelopeStatus.COMPLETED
      ? translateText(["titleWithView"])
      : translateText(["title"]);
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <Box
      component="main"
      id="content-without-drawer-main-content"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <ContentLayout
        pageHead={translateText(["head"])}
        title={getTitle()}
        onBackClick={handleBackClick}
        isBackButtonVisible
        isCloseButton={true}
        isDividerVisible={false}
        backIcon={
          isInternalUser ? IconName.LEFT_ARROW_ICON : IconName.CLOSE_ICON
        }
        showBackButtonTooltip={isInternalUser}
        containerStyles={{
          padding: {
            xs: "1.125rem 3rem 0 3rem"
          },
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
        customStyles={{
          header: {
            flexDirection: { xs: "row" },
            alignItems: { xs: "center" },
            justifyContent: { xs: "space-between" },
            flexShrink: 0
          }
        }}
        customRightContent={
          shouldShowFinishButton ? (
            <Button
              label={translateText(["finish"])}
              isFullWidth={false}
              endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
              size={ButtonSizes.MEDIUM}
              styles={{
                gap: "0.5rem",
                width: "10.5rem"
              }}
              onClick={handleFinishSigning}
              isLoading={isSubmitting}
              disabled={isSubmitting || hasIncompleteRequiredFields}
            />
          ) : undefined
        }
      >
        <Box
          sx={{
            mt: 4,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            pb: 2
          }}
        >
          <PdfViewerWithSignature isInternalUser={isInternalUser} />
        </Box>
      </ContentLayout>
      <SignAreYouSureModal
        isOpen={isAreYouSureModalOpen}
        setIsOpen={setIsAreYouSureModalOpen}
        onConfirm={() =>
          isInternalUser ? router.back() : router.push(ROUTES.SIGN.INFO)
        }
      />
    </Box>
  );
};

export default Sign;
