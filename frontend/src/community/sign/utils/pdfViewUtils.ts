import { DocumentFieldsIdentifiers } from "../enums/CommonDocumentsEnums";
import { SignatureFieldData } from "../types/ESignFormTypes";

export const getAdjustedPageAndPosition = (
  y: number,
  page: number,
  pageHeight: number,
  fieldHeight: number,
  numPages: number
): { page: number; y: number } => {
  let adjustedPage = page;
  let adjustedY = y;

  if (y < 0 && page > 1) {
    adjustedPage = page - 1;
    adjustedY = pageHeight - fieldHeight / 2;
  } else if (y + fieldHeight > pageHeight && page < numPages) {
    adjustedPage = page + 1;
    adjustedY = fieldHeight / 2;
  }

  return { page: adjustedPage, y: adjustedY };
};

export const transformSignFields = (fields: any[]): SignatureFieldData[] => {
  return fields.map((field, index) => ({
    id: index + 1,
    page: field.pageNumber,
    x: field.xposition,
    y: field.yposition,
    width: field.width,
    height: field.height,
    fieldType: field.type as DocumentFieldsIdentifiers,
    fieldStatus: field.status,
    userId: "USER_ID_PLACEHOLDER",
    colorCodes: field.colorCodes,
    value: field.value
  }));
};
