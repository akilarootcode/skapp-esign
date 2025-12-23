import {
  DocumentFieldsIdentifiers,
  DocumentUserPrivilege,
  EnvelopeStatus,
  RecipientStatus
} from "../enums/CommonDocumentsEnums";
import {
  EnvelopeDetailDto,
  EnvelopeSettingDto
} from "../types/CreateEnvelopTypes";
import {
  ESignAssigneesType,
  SignatureFieldData
} from "../types/ESignFormTypes";

export const transformDocumentObject = (object: {
  documentId: string[];
  message: string;
  signType: string;
  subject: string;
  status: EnvelopeStatus;
  name: string;
  recipients: ESignAssigneesType[];
  signatureFields: SignatureFieldData[];
  expireAt: string;
  envelopeSettingDto: EnvelopeSettingDto;
}): EnvelopeDetailDto => {
  const recipientsWithFields = object.recipients.map((recipient) => {
    const userFields = object.signatureFields.filter(
      (field) => field.recipient?.uuid === recipient.uuid
    );

    const firstFieldWithColor = userFields.find((field) => field.colorCodes);
    let recipientColorCodes = "";

    recipientColorCodes = JSON.stringify(firstFieldWithColor?.colorCodes);

    return {
      addressBookId: recipient.addressBookId as number,
      memberRole: recipient.userPrivileges as DocumentUserPrivilege,
      status: RecipientStatus.EMPTY,
      signingOrder: recipient.signingOrder,
      color: recipientColorCodes,
      fields: userFields.map((field) => ({
        type: field.fieldType as DocumentFieldsIdentifiers,
        status: field.fieldStatus,
        pageNumber: field.page,
        xposition: field.x,
        yposition: field.y,
        width: field.width,
        height: field.height,
        documentId: Number(object.documentId[0]),
        fontFamily: null,
        fontColor: null
      }))
    };
  });

  const envelopeSettings = {
    reminderDays: object.envelopeSettingDto.reminderDays || null,
    expirationDate: object.expireAt
  };

  return {
    name: object.name,
    status: object.status as EnvelopeStatus,
    message: object.message,
    subject: object.subject,
    documentIds: object.documentId,
    recipients: recipientsWithFields,
    envelopeSettingDto: envelopeSettings,
    signType: object.signType
  };
};
