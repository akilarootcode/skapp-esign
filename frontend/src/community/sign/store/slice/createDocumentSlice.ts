import { FileUploadType, SetType } from "~community/common/types/CommonTypes";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { ESignAssigneesType } from "~community/sign/types/ESignFormTypes";
import { CreateDocumentSliceType } from "~community/sign/types/SliceTypes";

export const createDocumentSlice = (set: SetType<CreateDocumentSliceType>) => ({
  attachments: [],
  fileName: "",
  isDocumentControllerModalOpen: false,
  documentControllerModalType: CreateDocumentsModalTypes.NONE,
  customFileError: "",
  externalUser: null,
  currentRecipientInAction: null,
  currentSearchTerm: "",
  documentId: null,
  recipients: [],
  selectedRecipient: null,
  uploadedFileUrl: null,
  isSigningOrderEnabled: false,

  setAttachments: (attachments: FileUploadType[]) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      attachments
    })),
  setFileName: (fileName: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      fileName
    })),
  setIsDocumentControllerModalOpen: (open: boolean) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      isDocumentControllerModalOpen: open
    })),
  setCustomFileError: (value: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      customFileError: value
    })),
  setDocumentControllerModalType: (value: CreateDocumentsModalTypes) => {
    if (value === CreateDocumentsModalTypes.NONE) {
      set((state: CreateDocumentSliceType) => ({
        ...state,
        isDocumentControllerModalOpen: false,
        documentControllerModalType: value
      }));
    } else {
      set((state: CreateDocumentSliceType) => ({
        ...state,
        isDocumentControllerModalOpen: true,
        documentControllerModalType: value
      }));
    }
  },
  setExternalUser: (value: ESignAssigneesType) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      externalUser: value
    })),
  setCurrentRecipientInAction: (id: number | null) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      currentRecipientInAction: id
    })),
  setCurrentSearchTerm: (searchTerm: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      currentSearchTerm: searchTerm
    })),
  setRecipients: (recipients: ESignAssigneesType[]) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      recipients
    })),
  setUploadedFileUrl: (url: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      uploadedFileUrl: url
    })),
  setUploadedPdfS3Url: (url: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      uploadedPdfS3Url: url
    })),
  reset: () =>
    set(() => ({
      attachments: [],
      fileName: "",
      isDocumentControllerModalOpen: false,
      documentControllerModalType: CreateDocumentsModalTypes.NONE,
      customFileError: "",
      externalUser: null,
      currentRecipientInAction: null,
      currentSearchTerm: "",
      recipients: [],
      uploadedFileUrl: null,
      uploadedPdfS3Url: null,
      documentId: null,
      isSigningOrderEnabled: false
    })),
  setDocumentId: (id: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      documentId: id
    })),
  setESignToken: (token: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      eSignToken: token
    })),

  setRecipientId: (id: number) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      recipientId: id
    })),
  setEnvelopeId: (id: number) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      envelopeId: id
    })),
  setUserType: (userType: string) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      userType
    })),
  setIsSigningOrderEnabled: (isEnabled: boolean) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      isSigningOrderEnabled: isEnabled
    })),
  setSelectedRecipient: (recipient: ESignAssigneesType) =>
    set((state: CreateDocumentSliceType) => ({
      ...state,
      selectedRecipient: recipient
    }))
});
