import { SignStore } from "./ESignStoreTypes";

export interface CreateDocumentSliceType
  extends Pick<
    SignStore,
    | "setAttachments"
    | "attachments"
    | "fileName"
    | "setFileName"
    | "isDocumentControllerModalOpen"
    | "setIsDocumentControllerModalOpen"
    | "documentControllerModalType"
    | "setDocumentControllerModalType"
    | "customFileError"
    | "setCustomFileError"
    | "externalUser"
    | "setExternalUser"
    | "currentRecipientInAction"
    | "setCurrentRecipientInAction"
    | "recipients"
    | "setRecipients"
    | "uploadedFileUrl"
    | "setUploadedFileUrl"
    | "uploadedPdfS3Url"
    | "setUploadedPdfS3Url"
    | "reset"
    | "setDocumentId"
    | "documentId"
    | "eSignToken"
    | "setESignToken"
    | "recipientId"
    | "setRecipientId"
    | "envelopeId"
    | "setEnvelopeId"
    | "setIsSigningOrderEnabled"
    | "isSigningOrderEnabled"
    | "userType"
    | "setUserType"
    | "selectedRecipient"
    | "setSelectedRecipient"
  > {}

export interface SignatureFieldSliceType
  extends Pick<
    SignStore,
    | "signatureLink"
    | "setSignatureLink"
    | "setSignatureFields"
    | "addSignatureField"
    | "removeSignatureField"
    | "incrementSignatureIdCounter"
    | "resetSignatureFields"
    | "signatureFields"
    | "signatureIdCounter"
    | "updateSignatureField"
    | "currentField"
    | "setCurrentField"
  > {}

export interface ReminderSliceType
  extends Pick<
    SignStore,
    | "reminderDays"
    | "expirationDate"
    | "setReminderDays"
    | "setExpirationDate"
    | "resetReminder"
  > {}
export interface ContactSliceType
  extends Pick<
    SignStore,
    | "setContactDataParams"
    | "setSearchKeyword"
    | "contactDataParams"
    | "handleContactDataSort"
    | "contactTableFilters"
    | "setContactTableFilters"
    | "setContactTableSelectedFilterLabels"
    | "contactTableSelectedFilterLabels"
    | "resetContactTableParams"
  > {}

export interface ESignConfigSliceType
  extends Pick<SignStore, "setESignConfigs" | "eSignConfigs"> {}

export interface EnvelopeInboxSliceType
  extends Pick<
    SignStore,
    | "inboxDataParams"
    | "setSize"
    | "setPage"
    | "setSearchTerm"
    | "setStatusTypes"
    | "setSortKey"
    | "setSortOrder"
    | "resetInboxDataParams"
    | "preserveInboxFilters"
    | "setPreserveInboxFilters"
  > {}

export interface EnvelopeSentSliceType
  extends Pick<
    SignStore,
    | "sentDataParams"
    | "setSentSize"
    | "setSentPage"
    | "setSentSearchTerm"
    | "setSentStatusTypes"
    | "setSentSortKey"
    | "setSentSortOrder"
    | "resetSentDataParams"
    | "preserveSentFilters"
    | "setPreserveSentFilters"
  > {}
export interface ESignCompleteSliceType
  extends Pick<
    SignStore,
    | "setSigningCompleteModalOpen"
    | "isSigningCompleteModalOpen"
    | "signingCompleteModalType"
    | "completingFiledId"
    | "setCompletingFiledId"
    | "completeFlowSignatureFields"
    | "setCompleteFlowSignatureFields"
    | "setDocumentInfo"
    | "documentInfo"
    | "autoFilledDate"
    | "setAutoFilledDate"
    | "signatureToUpload"
    | "setSignatureToUpload"
    | "setInitialsToUpload"
    | "initialsToUpload"
    | "setStampToUpload"
    | "stampToUpload"
    | "setDisplaySignature"
    | "displaySignature"
    | "setDisplayInitials"
    | "displayInitials"
    | "setDisplayStamp"
    | "displayStamp"
    | "setPageCorners"
    | "pageCorners"
  > {}

export interface EnvelopeLimitSliceType
  extends Pick<
    SignStore,
    "showEnvelopeLimitModal" | "setShowEnvelopeLimitModal"
  > {}
