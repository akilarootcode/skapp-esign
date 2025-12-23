export enum FileUrlTypes {
  PROFILE_PICTURE_ATTACHMENTS = "PROFILE_PICTURE",
  LEAVE_REQUEST_ATTACHMENTS = "LEAVE_REQUEST",
  ORGANIZATION_LOGO_ATTACHMENTS = "ORGANIZATION_LOGO"
}

export interface RequestBody {
  name: string;
  type?: string;
  fileCategory: FileCategories;
  action?: S3ActionTypes;
  tenantId: string;
  folderPath?: string;
}

export enum S3ActionTypes {
  UPLOAD = "UPLOAD",
  DOWNLOAD = "DOWNLOAD"
}

export enum S3SignedUrlActions {
  PUT_OBJECT = "putObject",
  GET_OBJECT = "getObject"
}

export enum FileCategories {
  LEAVE_REQUEST = "leaveRequest/attachments",
  ORGANIZATION_LOGO = "organizationLogos",
  PROFILE_PICTURES_ORIGINAL = "profilePictures/original",
  PROFILE_PICTURES_THUMBNAIL = "profilePictures/thumbnail",
  ESIGN_DOCUMENTS = "eSign/envelop/original",
  ESIGN_SIGNATURE_ORIGINAL = "eSign/envelop/document/signature/original",
  ESIGN_INITIALS_ORIGINAL = "eSign/envelop/document/initials/original",
  ESIGN_STAMP_ORIGINAL = "eSign/envelop/document/stamp/original",
  ESIGN_FILLED_FIELDS = "eSign/envelop/document/signedFields",
  SUPPORT_REQUEST = "supportRequest/attachments",
  INVOICE_LOGO = "invoice/invoiceLogo",
  INVOICE_OTHER_DOCUMENTS = "invoice/customer-details/otherDocuments"
}
