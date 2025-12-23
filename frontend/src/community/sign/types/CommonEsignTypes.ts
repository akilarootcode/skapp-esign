import { SignatureData } from "../constants";
import {
  AddressBookUserType,
  DocumentFieldsIdentifiers,
  DocumentUserPrivilege
} from "../enums/CommonDocumentsEnums";
import { MySignatureMethods } from "../enums/CommonEnums";
import { ESignAssigneesType, SignatureFieldStatus } from "./ESignFormTypes";

export type ESignConfigTypes = {
  dateFormat: string;
  defaultEnvelopeExpireDays: Number;
  reminderDaysBeforeExpire: Number;
};

export enum DocumentStatus {
  NEED_TO_SIGN = "NEED_TO_SIGN",
  SIGNED = "SIGNED",
  EXPIRED = "EXPIRED",
  DECLINED = "DECLINED",
  APPROVED = "APPROVED",
  VOID = "VOID"
}

export type DocumentAccessLinkResponseDto = {
  name: string;
  email: string;
  envelopeId: number;
  subject: string;
  recipientResponseDto: RecipientResponseDto;
  senderEmail: string;
  fieldResponseDtoList: FieldResponseDtoList[];
  documentDetailResponseDto: DocumentDetailResponseDto;
  documentLinkResponseDto: DocumentLinkResponseDto;
};

export type RecipientResponseDto = {
  id: string;
  memberRole: DocumentUserPrivilege;
  status: DocumentStatus;
  signingOrder: number;
  color: string;
  addressBook: Sender;
  consent: boolean;
};
export type FieldResponseDtoList = {
  id: number;
  type: DocumentFieldsIdentifiers;
  status: SignatureFieldStatus;
  pageNumber: number;
  documentId: number;
  receipientMail: string;
  fontFamily: string;
  fontColor: string;
  width: number;
  height: number;
  fieldValueResponseDto: any;
  xposition: number;
  yposition: number;
  userId?: number;
  recipient?: ESignAssigneesType;
};

export type DocumentDetailResponseDto = {
  id: number;
  name: string;
  filePath: string;
};

export type DocumentLinkResponseDto = {
  token: string;
  url: string;
  expireAt: string;
  maxClicks: number;
  clickCount: number;
};

export interface SignDocumentResponse {
  accessLink?: string;
  status?: string;
}

export type DocumentInfo = {
  name: string;
  email: string;
  status: DocumentStatus;
  message: string;
  subject: string;
  expireAt: string;
  documentPath: string;
  documentIds: number[];
  userType: AddressBookUserType;
  consentGiven: boolean;
};

export interface FieldUploadOptions {
  fieldData: SignatureData;
  documentId: string | number | null;
  recipientId: string | number | null;
  fieldWidth?: number;
  fieldHeight?: number;
  fieldType: DocumentFieldsIdentifiers;
  isInternalUser?: boolean;
  eSignToken?: string;
}

export interface AccessDocumentLinkParams {
  isInternalUser: boolean;
  documentId: string;
  recipientId: string;
}
export interface AddressBook {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profilePic: string | null;
}

export interface Recipient {
  id: number;
  memberRole: string;
  status: string;
  signingOrder: number;
  color: string;
  addressBook: AddressBook;
}

export interface Sender {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profilePic: string | null;
  mySignatureLink: string | null; // NOTE: Link to the sender's signature image or template that can be used for signing documents, if available.
}

export interface Envelope {
  envelopeId: number;
  subject: string;
  sender: Sender;
  status: string;
  expiresAt: string;
  receivedDate: string;
  sentAt: string;
  recipients: Recipient[];
}

export interface SignDocumentPayload {
  envelopeId: number;
  documentId: number;
  fieldSignDtoList: {
    fieldId: number;
    type: string;
    status: string;
    pageNumber: number;
    xposition: number;
    yposition: number;
    width: number;
    height: number;
    fieldValue: string | null;
  };
  recipientId: number;
}

export interface SignFieldPayload {
  envelopeId: number;
  documentId: number;
  fieldSignDto: {
    fieldId: number;
    type: string;
    status: string;
    pageNumber: number;
    xposition: number;
    yposition: number;
    width: number;
    height: number;
    fieldValue: string | null;
  };
  recipientId: number;
}

export interface ResendDocumentLinkParams {
  token: string;
}

export interface consentGivePayload {
  isConsent: boolean;
}

export interface MySignatureLinkDto {
  mySignatureLink: string;
  mySignatureMethod: MySignatureMethods;
  fontFamily?: string;
  fontColor?: string;
}

export interface DeclineDocumentPayload {
  declineReason: string;
  recipientId: number;
}
export interface DisplayField {
  x: number;
  y: number;
  width: number;
  height: number;
  signatureType?: string;
  signatureStyle?: {
    font?: string;
    color?: string;
  };
  colorCodes: {
    border: string;
  };
}

export interface TokenExchangeResponse {
  token: string;
}

export interface TokenExchangeParams {
  uuid: string;
  state: string;
}

export interface EnvelopeDocumentDetails {
  id: number;
  name: string;
  pageCount: number;
  filePath: string;
  envelopeStatus: DocumentStatus;
}
export interface InboxEnvelopeResponse {
  items: Envelope[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  size: number;
}