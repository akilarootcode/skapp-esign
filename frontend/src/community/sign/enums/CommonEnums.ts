export enum SignatureTabType {
  TYPE = "type",
  DRAW = "draw",
  UPLOAD = "upload"
}

export enum MySignatureMethods {
  TYPE = "TYPE",
  DRAW = "DRAW",
  UPLOAD = "UPLOAD"
}

export enum RedirectStatus {
  SIGN = "sign",
  ALL_DONE = "all-done",
  COMPLETED_DOCUMENT = "completed-document",
  DECLINED_DOCUMENT = "declined-document",
  DOCUMENT_NOT_FOUND = "document-not-found",
  EXPIRED_LINK = "expired-link",
  SESSION_EXPIRED = "session-expired",
  UPDATED_LINK = "updated-link"
}

export enum FieldStatus {
  EMPTY = "EMPTY",
  FILLED = "FILLED"
}

export enum EnvelopeAction {
  ENVELOPE_CREATED = "ENVELOPE_CREATED",
  ENVELOPE_SENT = "ENVELOPE_SENT",
  ENVELOPE_VIEWED = "ENVELOPE_VIEWED",
  ENVELOPE_SIGNED = "ENVELOPE_SIGNED",
  ENVELOPE_COMPLETED = "ENVELOPE_COMPLETED",
  ENVELOPE_VOIDED = "ENVELOPE_VOIDED",
  ENVELOPE_DECLINED = "ENVELOPE_DECLINED",
  ENVELOPE_EXPIRED = "ENVELOPE_EXPIRED",
  DOCUMENT_DOWNLOADED = "ENVELOPE_DOWNLOADED",
  ENVELOPE_CUSTODY_TRANSFERRED = "ENVELOPE_CUSTODY_TRANSFERRED"
}

export enum CornerType {
  TOP_LEFT = "topLeft",
  TOP_RIGHT = "topRight",
  BOTTOM_LEFT = "bottomLeft",
  BOTTOM_RIGHT = "bottomRight",
  NONE = "none"
}

export enum AuditLogsMetadata {
  DECLINE_NAME = "Decline reason"
}
