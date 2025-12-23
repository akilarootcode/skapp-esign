import { EnvelopeAction } from "../enums/CommonEnums";

export interface MetadataRequestDto {
  name?: string;
  value?: string;
}

export interface AuditTrailDto {
  envelopeId: number;
  recipientId?: number;
  ipAddress?: string;
  action: EnvelopeAction;
  metadata?: MetadataRequestDto[];
}
