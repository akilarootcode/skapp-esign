import {
  DocumentFieldHeights,
  DocumentFieldWidths,
  DocumentFieldsIdentifiers
} from "../enums/CommonDocumentsEnums";

export const screenToPageTranslation = (
  x: number,
  y: number,
  scale: number
): [number, number] => {
  const tx = x / scale;
  const ty = y / scale;
  return [tx, ty];
};

export const getFieldDimensions = (fieldType: DocumentFieldsIdentifiers) => {
  let fieldWidth;
  let fieldHeight;

  switch (fieldType) {
    case DocumentFieldsIdentifiers.SIGN:
      fieldWidth = DocumentFieldWidths.SIGN;
      fieldHeight = DocumentFieldHeights.SIGN;
      break;
    case DocumentFieldsIdentifiers.INITIAL:
    case DocumentFieldsIdentifiers.STAMP:
      fieldWidth = DocumentFieldWidths.INITIAL_AND_STAMP;
      fieldHeight = DocumentFieldHeights.INITIAL_AND_STAMP;
      break;
    case DocumentFieldsIdentifiers.NAME:
      fieldWidth = DocumentFieldWidths.NAME;
      fieldHeight = DocumentFieldHeights.NAME;
      break;
    case DocumentFieldsIdentifiers.EMAIL:
      fieldWidth = DocumentFieldWidths.EMAIL;
      fieldHeight = DocumentFieldHeights.EMAIL;
      break;
    case DocumentFieldsIdentifiers.DATE:
      fieldWidth = DocumentFieldWidths.DATE;
      fieldHeight = DocumentFieldHeights.DATE;
      break;
    default:
      fieldWidth = DocumentFieldWidths.OTHER;
      fieldHeight = DocumentFieldHeights.OTHER;
  }

  return { fieldWidth, fieldHeight };
};

export const getLocalizedFieldLabel = (
  fieldType: DocumentFieldsIdentifiers,
  translateFunc: (keys: string[]) => string
): string => {
  switch (fieldType) {
    case DocumentFieldsIdentifiers.SIGN:
      return translateFunc(["signature"]);
    case DocumentFieldsIdentifiers.INITIAL:
      return translateFunc(["initial"]);
    case DocumentFieldsIdentifiers.DATE:
      return translateFunc(["date"]);
    case DocumentFieldsIdentifiers.APPROVE:
      return translateFunc(["approve"]);
    case DocumentFieldsIdentifiers.DECLINE:
      return translateFunc(["decline"]);
    case DocumentFieldsIdentifiers.STAMP:
      return translateFunc(["stamp"]);
    case DocumentFieldsIdentifiers.NAME:
      return translateFunc(["name"]);
    case DocumentFieldsIdentifiers.EMAIL:
      return translateFunc(["email"]);
    default:
      return "";
  }
};
