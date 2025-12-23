import { SetType } from "~community/common/types/CommonTypes";
import {
  AddressBookUserType,
  DocumentSignModalTypes
} from "~community/sign/enums/CommonDocumentsEnums";
import { PageCorners } from "~community/sign/hooks/useRenderPages";
import { SignatureFieldData } from "~community/sign/types/ESignFormTypes";
import { ESignCompleteSliceType } from "~community/sign/types/SliceTypes";

import {
  DocumentAccessLinkResponseDto,
  DocumentStatus
} from "../../types/CommonEsignTypes";

export const completeSigningFlow = (set: SetType<ESignCompleteSliceType>) => ({
  isSigningCompleteModalOpen: false,
  signingCompleteModalType: DocumentSignModalTypes.NONE,
  completingFiledId: null,
  completeFlowSignatureFields: [],
  documentInfo: {
    name: "",
    email: "",
    status: DocumentStatus.NEED_TO_SIGN,
    message: "",
    subject: "",
    expireAt: "",
    documentPath: "",
    documentIds: [],
    userType: AddressBookUserType.INTERNAL,
    consent: false,
    documentDetailResponseDto: {
      id: 0,
      name: "",
      filePath: ""
    }
  },
  autoFilledDate: "",
  signatureToUpload: null,
  initialsToUpload: null,
  stampToUpload: null,
  displaySignature: null,
  displayInitials: null,
  displayStamp: null,
  pageCorners: [],
  setSigningCompleteModalOpen: (type: DocumentSignModalTypes) => {
    set({
      isSigningCompleteModalOpen: type !== DocumentSignModalTypes.NONE,
      signingCompleteModalType: type
    });
  },
  setCompletingFiledId: (id: number) => set({ completingFiledId: id }),
  setCompleteFlowSignatureFields: (fields: SignatureFieldData[]) =>
    set({ completeFlowSignatureFields: fields }),
  setDocumentInfo: (info: DocumentAccessLinkResponseDto) => {
    set({
      documentInfo: {
        ...info,
        documentPath: info.documentDetailResponseDto?.filePath || "",
        status:
          info.recipientResponseDto?.status || DocumentStatus.NEED_TO_SIGN,
        message: "",
        subject: info.subject,
        expireAt: info.documentLinkResponseDto?.expireAt || "",
        documentIds: [info.documentDetailResponseDto?.id || 0],
        userType: AddressBookUserType.INTERNAL,
        consent: info.recipientResponseDto?.consent || false
      }
    });
  },
  setSignatureToUpload: (signature: any) => {
    set({ signatureToUpload: signature });
  },
  setInitialsToUpload: (signature: any) => {
    set({ initialsToUpload: signature });
  },
  setStampToUpload: (signature: any) => {
    set({ stampToUpload: signature });
  },
  setDisplaySignature: (signature: any) => {
    set({ displaySignature: signature });
  },
  setAutoFilledDate: (date: string) => set({ autoFilledDate: date }),
  setDisplayInitials: (signature: any) => {
    set({ displayInitials: signature });
  },
  setDisplayStamp: (signature: any) => {
    set({ displayStamp: signature });
  },
  setPageCorners: (corners: PageCorners[]) => set({ pageCorners: corners })
});
