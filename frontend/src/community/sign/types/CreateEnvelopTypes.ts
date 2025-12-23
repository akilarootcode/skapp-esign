import {
  DocumentFieldsIdentifiers,
  DocumentUserPrivilege,
  EnvelopeStatus,
  RecipientStatus
} from "../enums/CommonDocumentsEnums";

export interface RecipientDto {
  addressBookId: number;
  memberRole: DocumentUserPrivilege;
  status: RecipientStatus;
  signingOrder: number;
  fields: FieldDto[];
}

export interface EnvelopeSettingDto {
  reminderDays: string | null;
  expirationDate: string;
}

export interface EnvelopeDetailDto {
  name: string;
  status: EnvelopeStatus;
  message?: string;
  subject: string;
  expireAt?: string;
  documentIds: string[];
  recipients: RecipientDto[];
  envelopeSettingDto: EnvelopeSettingDto;
  signType: string;
}

export interface FieldDto {
  type: DocumentFieldsIdentifiers;
  status: RecipientStatus;
  pageNumber: number;
  xposition: number;
  yposition: number;
  documentId: number;
}

export interface EnvelopeCreationResponseDto {
  id: number;
  name: string;
  status: string;
  message: string;
  subject: string;
  sentAt: string;
  completedAt: string | null;
  declinedAt: string | null;
  expireAt: string | null;
  documents: Document[];
  recipients: RecipientDto[];
  emailResponse: string | null;
  setting: EnvelopeSettingDto;
}
