import { FileUploadType } from "~community/common/types/CommonTypes";

import {
  AddressBookUserType,
  DocumentFieldsIdentifiers,
  DocumentUserPrivilege
} from "../enums/CommonDocumentsEnums";

export interface CreateDocumentFormTypes {
  fileName: string;
  file: FileUploadType | [];
}

export interface ESignSearchBookSuggestionType {
  addressBookId: number;
  authPic: string | null;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  userType: AddressBookUserType;
}

export interface AddExternalUserPayloadType {
  id?: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
}

export type ExternalUserResponseDto = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type AddExternalUserResponseDto = {
  id: number;
  internalUserResponseDto: null;
  externalUserResponseDto: ExternalUserResponseDto;
  type: AddressBookUserType;
  email?: string;
  firstName?: string;
};

export type ESignAssigneesType = {
  addressBookId?: number | null;
  authPic: string | null;
  email: string;
  firstName: string;
  lastName: string;
  userId?: number | null;
  id: number;
  userType: AddressBookUserType | null;
  userPrivileges: DocumentUserPrivilege;
  signingOrder: number;
  uuid: string;
  error: string | null;
};

export type ESignFieldColorCodesType = {
  background: string;
  border: string;
};

export enum SignatureFieldStatus {
  EMPTY = "EMPTY",
  COMPLETED = "COMPLETED",
  SKIPPED = "SKIP"
}

export enum SignType {
  SEQUENTIAL = "SEQUENTIAL",
  PARALLEL = "PARALLEL"
}

export interface SignatureFieldData {
  id: number;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fieldType: DocumentFieldsIdentifiers;
  fieldStatus: SignatureFieldStatus;
  userId: string;
  colorCodes: ESignFieldColorCodesType;
  signature?: string;
  value?: string | null | boolean;
  tempUserID?: string;
  recipient: ESignAssigneesType;
}

export interface DraggedField {
  fieldId: number | null;
  isExisting: boolean;
  fieldType: DocumentFieldsIdentifiers | null;
  selectedUser?: string;
  colorCodes?: ESignFieldColorCodesType;
  tempUserID?: string;
}

export interface EnvelopeSettingsDto {
  reminderDays: string;
  expirationDate: string;
}
