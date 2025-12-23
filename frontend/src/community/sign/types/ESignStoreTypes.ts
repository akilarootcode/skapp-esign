import {
  FileUploadType,
  SortOrderTypes
} from "~community/common/types/CommonTypes";
import { SignatureData } from "~community/sign/constants";
import { ContactDataParamsTypes } from "~community/sign/types/contactTypes";

import { DocumentSignModalTypes } from "../enums/CommonDocumentsEnums";
import { CreateDocumentsModalTypes } from "../enums/CreateDocumentsModalTypes";
import { PageCorners } from "../hooks/useRenderPages";
import {
  DocumentAccessLinkResponseDto,
  ESignConfigTypes,
  FieldResponseDtoList
} from "./CommonEsignTypes";
import { ESignAssigneesType, SignatureFieldData } from "./ESignFormTypes";
import {
  GetAllInboxParams,
  GetAllSentParams,
  SortKey
} from "./ESignInboxTypes";

interface actionsTypes {
  setSignatureLink: (signatureLink: string | null) => void;
  reset: () => void;
  addSignatureField: (field: SignatureFieldData) => void;
  removeSignatureField: (fieldId: number) => void;
  incrementSignatureIdCounter: () => void;
  resetSignatureFields: () => void;
  updateSignatureField: (
    id: number,
    updates: Partial<SignatureFieldData>
  ) => void;
  resetReminder: () => void;
  resetContactTableParams: () => void;
  handleContactDataSort: (key: string, value: string | boolean) => void;
  setSignatureFields: (fields: FieldResponseDtoList[]) => void;
  setAttachments: (value: FileUploadType[]) => void;
  setFileName: (fileName: string) => void;
  setIsDocumentControllerModalOpen: (open: boolean) => void;
  setDocumentControllerModalType: (value: CreateDocumentsModalTypes) => void;
  setCustomFileError: (value: string) => void;
  setExternalUser: (value: ESignAssigneesType) => void;
  setCurrentRecipientInAction: (id: number | null) => void;
  setCurrentSearchTerm: (searchTerm: string) => void;
  setRecipients: (recipients: ESignAssigneesType[]) => void;
  setUploadedFileUrl: (url: string) => void;
  setContactDataParams: (
    key: string,
    value: (string | number)[] | string | boolean
  ) => void;
  setSearchKeyword: (value: string) => void;
  setContactTableSelectedFilterLabels: (value: string[]) => void;
  setContactTableFilters: (selectedFilters: Record<string, string[]>) => void;
  setReminderDays: (days: string) => void;
  setExpirationDate: (date: string) => void;
  setDocumentId: (id: string) => void;
  setESignConfigs: (configs: ESignConfigTypes) => void;
  setSigningCompleteModalOpen: (type: DocumentSignModalTypes) => void;
  setCompletingFiledId: (id: number) => void;
  setCompleteFlowSignatureFields: (fields: SignatureFieldData[]) => void;
  setDocumentInfo: (info: DocumentAccessLinkResponseDto) => void;
  setESignToken: (token: string) => void;
  setRecipientId: (id: number) => void;
  setEnvelopeId: (id: number) => void;
  setUserType: (userType: string) => void;
  setItemsPerPage: (items: number) => void;
  setCurrentField: (field: SignatureFieldData | null) => void;
  setSize: (items: number) => void;
  setPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setStatusTypes: (statuses: string) => void;
  setSortKey: (option: SortKey) => void;
  setSortOrder: (order: SortOrderTypes) => void;
  setAutoFilledDate: (date: string) => void;
  setLastTemplateS3Path: (path: string | null) => void;
  setIsSigningOrderEnabled: (isEnabled: boolean) => void;
  setPageCorners: (corners: PageCorners[]) => void;
  setSentSize: (items: number) => void;
  setSentPage: (page: number) => void;
  setSentSearchTerm: (term: string) => void;
  setSentStatusTypes: (statuses: string) => void;
  setSentSortKey: (option: SortKey) => void;
  setSentSortOrder: (order: SortOrderTypes) => void;
  setSignatureToUpload: (signature: File | null) => void;
  setInitialsToUpload: (signature: File | null) => void;
  setStampToUpload: (signature: File | null) => void;
  setDisplaySignature: (signature: SignatureData | null) => void;
  setDisplayInitials: (signature: SignatureData | null) => void;
  setDisplayStamp: (signature: SignatureData | null) => void;
  setUploadedPdfS3Url: (url: string) => void;
  setHasValidationErrors: (value: boolean) => void;
  setSelectedRecipient: (recipient: ESignAssigneesType) => void;
  resetInboxDataParams: () => void;
  resetSentDataParams: () => void;
  setPreserveSentFilters: (preserve: boolean) => void;
  setPreserveInboxFilters: (preserve: boolean) => void;
  setShowEnvelopeLimitModal: (show: boolean) => void;
}
export interface SignStore extends actionsTypes {
  signatureLink: string | null;
  attachments: FileUploadType[];
  fileName: string;
  isDocumentControllerModalOpen: boolean;
  documentControllerModalType: CreateDocumentsModalTypes;
  customFileError: string;
  externalUser: ESignAssigneesType | null;
  currentRecipientInAction: number | null;
  currentSearchTerm: string;
  recipients: ESignAssigneesType[];
  uploadedFileUrl: null | string;
  uploadedPdfS3Url: null | string;
  hasValidationErrors: boolean;
  signatureFields: FieldResponseDtoList[];
  signatureIdCounter: number;
  contactDataParams: ContactDataParamsTypes;
  contactTableFilters: {
    userType: string[];
  };
  contactTableSelectedFilterLabels: string[];
  reminderDays: string;
  expirationDate: string;
  documentId: null | string;
  eSignConfigs: ESignConfigTypes;
  isSigningCompleteModalOpen: boolean;
  signingCompleteModalType: DocumentSignModalTypes;
  completingFiledId: number | null;
  completeFlowSignatureFields: SignatureFieldData[];
  documentInfo: DocumentAccessLinkResponseDto;
  eSignToken: string | null;
  recipientId: number;
  envelopeId: number;
  userType: string;
  itemsPerPage: number;
  autoFilledDate: string;
  currentField: SignatureFieldData | null;
  inboxDataParams: GetAllInboxParams;
  pageCorners: PageCorners[];
  sentDataParams: GetAllSentParams;
  signatureToUpload: File | null;
  initialsToUpload: File | null;
  stampToUpload: File | null;
  displaySignature: SignatureData | null;
  displayInitials: SignatureData | null;
  displayStamp: SignatureData | null;
  isSigningOrderEnabled: boolean;
  selectedRecipient: ESignAssigneesType;
  preserveSentFilters: boolean;
  preserveInboxFilters: boolean;
  showEnvelopeLimitModal: boolean;
}
