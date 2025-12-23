import { SortOrderTypes } from "~community/common/types/CommonTypes";

export enum TableHeaderId {
  NAME = "name",
  RECIPIENTS = "recipients",
  RECEIVED_ON = "receivedOn",
  EXPIRES_ON = "expiresOn",
  STATUS = "status",
  SENDER = "sender"
}

export interface TableHeader {
  id: TableHeaderId;
  label: string;
}

export enum SortOptionId {
  RECEIVED_CLOSE = "receivedClose",
  RECEIVED_FAR = "receivedFar",
  CREATED_CLOSE = "createdClose",
  CREATED_FAR = "createdFar"
}

export enum SortKey {
  RECEIVED_DATE = "RECEIVED_DATE",
  CREATED_DATE = "CREATED_DATE"
}

export enum EnvelopeStatus {
  NEED_TO_SIGN = "NEED_TO_SIGN",
  COMPLETED = "COMPLETED",
  DECLINED = "DECLINED",
  WAITING = "WAITING",
  VOID = "VOID",
  EXPIRED = "EXPIRED",
  VOIDED = "VOIDED"
}
export interface SortOption {
  value: SortOptionId;
  label: string;
}

export interface StatusOption {
  id: EnvelopeStatus;
  label: string;
}

export type GetAllInboxParams = {
  size: number;
  page: number;
  searchKeyword?: string;
  statusTypes?: string;
  sortOrder?: SortOrderTypes;
  sortKey?: SortKey;
};

export type GetAllSentParams = {
  size: number;
  page: number;
  searchKeyword?: string;
  statusTypes?: string;
  sortOrder?: SortOrderTypes;
  sortKey?: SortKey;
};

export enum TableType {
  INBOX = "inbox",
  SENT = "sent"
}

