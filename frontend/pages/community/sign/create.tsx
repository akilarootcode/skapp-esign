import { Box, Stack } from "@mui/material";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import StepperComponent from "~community/common/components/molecules/Stepper/Stepper";
import FullPageContainerLayout from "~community/common/components/templates/FullPageContainerLayout/FullPageContainerLayout";
import ROUTES from "~community/common/constants/routes";
import { ToastType } from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useGetESignConfigs } from "~community/sign/api/ConfigApi";
import { useCreateEnvelop } from "~community/sign/api/DocumentApi";
import { useGetEnvelopeLimitation } from "~community/sign/api/EnvelopeLimitationApi";
import EnvelopeCreationUnsavedModal from "~community/sign/components/molecules/EnvelopeCreationUnsavedModal/EnvelopeCreationUnsavedModal";
import UploadDocumentsModalController from "~community/sign/components/molecules/UploadDocumentsModalController/UploadDocumentsModalController";
import PDFViewer from "~community/sign/components/organisms/CreateDocumentFlow/DefineFieldsSection/PDFViewer";
import RecipientDetailsForm from "~community/sign/components/organisms/CreateDocumentFlow/RecipientDetailsSection/RecipientDetailsForm";
import DocumentSummary from "~community/sign/components/organisms/DocumentSummary/DocumentSummary";
import EnvelopeLimitReached from "~community/sign/components/organisms/EnvelopeLimitReached/EnvelopeLimitReached";
import SummaryExternalConfirmationModal from "~community/sign/components/organisms/SummaryExternalConfirmationModal/SummaryExternalConfirmationModal";
import SummaryInternalConfirmationModal from "~community/sign/components/organisms/SummaryInternalConfirmationModal/SummaryInternalConfirmationModal";
import {
  EXPIRATION_DAYS,
  MAX_SUMMARY_EMAIL_SUBJECT_LENGTH
} from "~community/sign/constants";
import {
  AddressBookUserType,
  DocumentUserPrivilege,
  EnvelopeStatus
} from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { EnvelopeCreationResponseDto } from "~community/sign/types/CreateEnvelopTypes";
import {
  EnvelopeSettingsDto,
  SignType
} from "~community/sign/types/ESignFormTypes";
import { transformDocumentObject } from "~community/sign/utils/transformDocumentObject";
import { SKAPP_CONTACT_US_LINK } from "~enterprise/common/constants/stringConstants";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

const CreateDocument = () => {
  const router = useRouter();
  const translateText = useTranslator("eSignatureModule", "create");
  const translateInfoText = useTranslator("eSignatureModule", "info");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "createDocument"
  );
  const { setToastMessage } = useToast();
  const { isSuperAdmin, isProTier } = useSessionData();
  const {
    reset,
    resetSignatureFields,
    resetReminder,
    recipients,
    signatureFields,
    expirationDate,
    reminderDays,
    isSigningOrderEnabled
  } = useESignStore();

  const DEFAULT_EMAIL_SUBJECT = translateText(["emailPreFillInitialText"]);

  const { sendEvent } = useGoogleAnalyticsEvent();
  const steps = [
    translateText(["stepper.recipientDetails"]),
    translateText(["stepper.defineFields"]),
    translateText(["stepper.summary"])
  ];

  const {
    attachments,
    documentId,
    fileName,
    setReminderDays,
    setExpirationDate
  } = useESignStore();

  const [activeStep, setActiveStep] = useState(0);
  const [emailSubject, setEmailSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [hasSubjectBeenModified, setHasSubjectBeenModified] = useState(false);
  const [emailSubjectError, setEmailSubjectError] = useState("");

  const [emailMessage, setEmailMessage] = useState("");
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] =
    useState(false);
  // Add boolean to control envelope limit display
  const [isEnvelopeLimitReached, setIsEnvelopeLimitReached] = useState(false);

  const { data: configData, isPending } = useGetESignConfigs();
  const { data: envelopeLimitationData, isPending: isLimitationPending } =
    useGetEnvelopeLimitation();

  useEffect(() => {
    if (isPending) return;

    if (configData?.defaultEnvelopeExpireDays && !expirationDate) {
      const defaultExpirationDate = DateTime.now()
        .plus({ days: configData.defaultEnvelopeExpireDays })
        .toISODate();

      if (defaultExpirationDate) {
        setExpirationDate(defaultExpirationDate);
      }
    } else if (!expirationDate) {
      setExpirationDate(
        DateTime.now().plus({ days: EXPIRATION_DAYS }).toISODate() || ""
      );
    }
  }, [configData, setExpirationDate, expirationDate, isPending]);

  useEffect(() => {
    if (
      attachments?.length > 0 &&
      attachments[0]?.name &&
      !hasSubjectBeenModified
    ) {
      setEmailSubject(DEFAULT_EMAIL_SUBJECT + attachments[0]?.name);
    } else if (!hasSubjectBeenModified) {
      setEmailSubject(DEFAULT_EMAIL_SUBJECT);
    }
  }, [attachments, translateText, hasSubjectBeenModified]);
  useEffect(() => {
    if (!isLimitationPending && envelopeLimitationData) {
      setIsEnvelopeLimitReached(envelopeLimitationData.limitedReached);
    }
  }, [envelopeLimitationData, isLimitationPending]);

  const handleEmailSubjectChange = (newSubject: string) => {
    setEmailSubject(newSubject);
    setHasSubjectBeenModified(true);
    if (newSubject.length >= MAX_SUMMARY_EMAIL_SUBJECT_LENGTH) {
      setEmailSubjectError(
        translateText(["emailSubjectLimitError"], {
          limit: MAX_SUMMARY_EMAIL_SUBJECT_LENGTH.toLocaleString()
        })
      );
    } else if (newSubject.trim()) {
      setEmailSubjectError("");
    } else {
      setEmailSubjectError(translateText(["emailSubjectRequired"]));
    }
  };

  const getSignerRecipientsCount = () => {
    return recipients.filter(
      (recipient) => recipient.userPrivileges === DocumentUserPrivilege.SIGNER
    ).length;
  };

  const handleNext = () => {
    if (activeStep === 0 && getSignerRecipientsCount() === 0) {
      setActiveStep(2);
    } else {
      setActiveStep((prevActiveStep) =>
        prevActiveStep < steps.length - 1 ? prevActiveStep + 1 : prevActiveStep
      );
    }
  };

  const handleBack = () => {
    if (activeStep === 2 && getSignerRecipientsCount() === 0) {
      setActiveStep(0);
    } else {
      setActiveStep((prevActiveStep) =>
        prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep
      );
    }
  };

  const hasUnsavedChanges = (): boolean => {
    const hasValidRecipients = recipients.some(
      (recipient) => recipient.email && recipient.email.trim() !== ""
    );

    return (
      attachments?.length > 0 ||
      hasValidRecipients ||
      Object.keys(signatureFields).length > 0 ||
      emailMessage.trim() !== "" ||
      emailSubject !== DEFAULT_EMAIL_SUBJECT
    );
  };

  const handleGoBack = async () => {
    if (hasUnsavedChanges()) {
      setIsUnsavedChangesModalOpen(true);
    } else {
      performGoBack();
    }
  };

  const performGoBack = () => {
    reset();
    resetSignatureFields();
    resetReminder();
    router.back();
  };

  const handleLeave = () => {
    setIsUnsavedChangesModalOpen(false);
    performGoBack();
  };

  const handleResume = () => {
    setIsUnsavedChangesModalOpen(false);
  };

  const onSuccess = (response: EnvelopeCreationResponseDto) => {
    setReminderDays("");
    setExpirationDate("");
    reset();
    resetSignatureFields();
    setIsLoading(false);
    setIsExternalModalOpen(false);
    setIsInternalModalOpen(false);

    setToastMessage({
      toastType: ToastType.SUCCESS,
      title: translateText(["createSuccessToastTitle"]),
      description: translateText(["createSuccessToastDesc"]),
      open: true
    });

    router.push(ROUTES.SIGN.SENT_INFO.ID(response.id));
  };

  const onError = () => {
    setIsLoading(false);
    setToastMessage({
      toastType: ToastType.ERROR,
      title: translateText(["createFailToastTitle"]),
      description: translateText(["createFailToastDesc"]),
      open: true
    });
  };

  const { mutate } = useCreateEnvelop(onSuccess, onError);

  const handleSend = () => {
    if (!emailSubject.trim()) {
      setEmailSubjectError(translateText(["emailSubjectRequired"]));
      return;
    }
    const hasExternalRecipient = recipients.some(
      (recipient) => recipient.userType === AddressBookUserType.EXTERNAL
    );

    if (hasExternalRecipient) {
      setIsExternalModalOpen(true);
    } else {
      setIsInternalModalOpen(true);
    }
    sendEvent(GoogleAnalyticsTypes.GA4_ESIGN_ENVELOPE_CREATED);
  };

  const handleCloseExternalModal = () => {
    setIsExternalModalOpen(false);
    setIsLoading(false);
  };

  const handleCloseInternalModal = () => {
    setIsInternalModalOpen(false);
    setIsLoading(false);
  };

  const handleConfirmSend = () => {
    setIsLoading(true);

    const envelopeSettings: EnvelopeSettingsDto = {
      reminderDays: Number(reminderDays),
      expirationDate: expirationDate
    };

    const payload = {
      documentId: [documentId as string],
      signType: isSigningOrderEnabled ? SignType.SEQUENTIAL : SignType.PARALLEL,
      message: emailMessage,
      subject: emailSubject,
      status: EnvelopeStatus.WAITING,
      name: fileName,
      recipients: recipients,
      signatureFields: signatureFields,
      expireAt: expirationDate,
      envelopeSettingDto: envelopeSettings
    };

    mutate(transformDocumentObject(payload));
  };

  useEffect(() => {
    return () => {
      reset();
      resetSignatureFields();
      resetReminder();
    };
  }, []);

  const getDescription = () => {
    if (isProTier && isSuperAdmin) {
      return translateInfoText(["envelopeLimitReached", "descriptionProTier"]);
    } else if (isProTier && !isSuperAdmin) {
      return translateInfoText([
        "envelopeLimitReached",
        "descriptionNonAdminProTier"
      ]);
    } else if (!isProTier && isSuperAdmin) {
      return translateInfoText([
        "envelopeLimitReached",
        "descriptionAdminFreeTier"
      ]);
    } else {
      return translateInfoText([
        "envelopeLimitReached",
        "descriptionNonAdminFreeTier"
      ]);
    }
  };
  return (
    <>
      {isLimitationPending ? (
        <FullScreenLoader />
      ) : isEnvelopeLimitReached ? (
        <EnvelopeLimitReached
          pageHead={translateText(["pageHead"])}
          title={translateInfoText(["envelopeLimitReached", "title"])}
          description={getDescription()}
          buttonLabel={
            isProTier && isSuperAdmin
              ? translateInfoText(["envelopeLimitReached", "contactButton"])
              : translateInfoText(["envelopeLimitReached", "upgradeButton"])
          }
          buttonIcon={isProTier ? IconName.RIGHT_ARROW_ICON : IconName.GEM_ICON}
          onButtonClick={() => {
            isProTier
              ? router.push(SKAPP_CONTACT_US_LINK)
              : router.push(ROUTES.SUBSCRIPTION);
          }}
        />
      ) : (
        <FullPageContainerLayout
          pageHead={translateText(["pageHead"])}
          title={translateText(["title"])}
          stepText={`${activeStep + 1} ${translateText(["of"])} ${steps.length}`}
          icon={{
            dataTestId: "close-icon",
            onClick: handleGoBack,
            ariaLabel: translateAria(["closeCreateDocument"]),
            title: translateAria(["closeCreateDocument"])
          }}
          tabIndex={0}
        >
          <Box id="content-without-drawer-main-content" role="document">
            <Stack component="section" sx={{ padding: "1.75rem 0rem" }}>
              <StepperComponent
                activeStep={activeStep}
                steps={steps}
                stepperStyles={{
                  width: "40%"
                }}
              />
            </Stack>
            <>
              {activeStep === 0 && <RecipientDetailsForm onNext={handleNext} />}
            </>
            <>
              {activeStep === 1 && (
                <PDFViewer onNext={handleNext} handleBack={handleBack} />
              )}
            </>
            <>
              {activeStep === 2 && (
                <DocumentSummary
                  onSend={handleSend}
                  onBack={handleBack}
                  emailSubject={emailSubject}
                  setEmailSubject={handleEmailSubjectChange}
                  emailMessage={emailMessage}
                  setEmailMessage={setEmailMessage}
                  isLoading={isLoading || isPending}
                  emailSubjectError={emailSubjectError}
                />
              )}
            </>
            <UploadDocumentsModalController />
            <SummaryExternalConfirmationModal
              isOpen={isExternalModalOpen}
              onClose={handleCloseExternalModal}
              onConfirm={handleConfirmSend}
              isLoading={isLoading}
            />
            <SummaryInternalConfirmationModal
              isOpen={isInternalModalOpen}
              onClose={handleCloseInternalModal}
              onConfirm={handleConfirmSend}
              isLoading={isLoading}
            />
            <EnvelopeCreationUnsavedModal
              modalOpen={isUnsavedChangesModalOpen}
              setModalOpen={setIsUnsavedChangesModalOpen}
              handleModalResume={handleResume}
              handleModalLeave={handleLeave}
            />
          </Box>
        </FullPageContainerLayout>
      )}
    </>
  );
};

export default CreateDocument;
