export enum AddressBookUserType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL"
}

export enum DocumentUserPrivilege {
  SIGNER = "SIGNER",
  CC = "CC"
}

export enum DocumentFieldsIdentifiers {
  SIGN = "SIGNATURE",
  INITIAL = "INITIAL",
  DATE = "DATE",
  APPROVE = "APPROVE",
  DECLINE = "DECLINE",
  STAMP = "STAMP",
  NAME = "NAME",
  EMAIL = "EMAIL"
}

export enum DocumentFieldWidths {
  SIGN = 138,
  INITIAL_AND_STAMP = 66,
  NAME = 111,
  EMAIL = 111,
  DATE = 111,
  OTHER = 122
}

export enum DocumentFieldHeights {
  SIGN = 43,
  INITIAL_AND_STAMP = 66,
  NAME = 27,
  EMAIL = 27,
  DATE = 27,
  OTHER = 38
}

export enum EnvelopeStatus {
  COMPLETED = "COMPLETED",
  NEED_TO_SIGN = "NEED_TO_SIGN",
  WAITING = "WAITING",
  DECLINED = "DECLINED",
  EXPIRED = "EXPIRED",
  VOIDED = "VOIDED"
}

export enum RecipientStatus {
  EMPTY = "EMPTY",
  FILLED = "FILLED"
}

export enum DocumentSignModalTypes {
  SIGN = "SIGNATURE",
  INITIAL = "INITIAL",
  DATE = "DATE",
  APPROVE = "APPROVE",
  DECLINE = "DECLINE",
  STAMP = "STAMP",
  NONE = "NONE",
  CANCEL_FLOW = "CANCEL_FLOW"
}

export enum MetadataKeys {
  CURRENT_OWNER = "currentOwner"
}
