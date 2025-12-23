import { useEffect, useMemo } from "react";

import { SignatureData } from "~community/sign/constants";
import { DocumentFieldsIdentifiers } from "~community/sign/enums/CommonDocumentsEnums";
import { SignatureFieldStatus } from "~community/sign/types/ESignFormTypes";

export interface SignatureField {
  type: DocumentFieldsIdentifiers;
  status: SignatureFieldStatus;
  signature?: string;
  signatureType?: string;
  signatureStyle?: { font?: string; color?: string };
}

export const getUpdatedSignatureFields = (
  displayData: SignatureData | null | undefined,
  fieldType: DocumentFieldsIdentifiers,
  signatureFields: SignatureField[]
): SignatureField[] | null => {
  if (
    !displayData?.value ||
    !Array.isArray(signatureFields) ||
    signatureFields.length === 0
  ) {
    return null;
  }

  const completedField = signatureFields.find(
    (field) =>
      field.type === fieldType &&
      field.status === SignatureFieldStatus.COMPLETED
  );
  if (!completedField) {
    return null;
  }

  const fieldsNeedUpdate = signatureFields.some((field) => {
    if (
      field.type === fieldType &&
      field.status === SignatureFieldStatus.COMPLETED
    ) {
      const valueChanged = field.signature !== displayData.value;
      const styleChanged =
        displayData.style &&
        (!field.signatureStyle ||
          field.signatureStyle.font !== displayData.style.font ||
          field.signatureStyle.color !== displayData.style.color);

      return (
        valueChanged ||
        (fieldType !== DocumentFieldsIdentifiers.STAMP && styleChanged)
      );
    }
    return false;
  });

  if (!fieldsNeedUpdate) {
    return null;
  }
  const updatedFields = signatureFields.map((field) => {
    if (
      field.type === fieldType &&
      field.status === SignatureFieldStatus.COMPLETED
    ) {
      return {
        ...field,
        signature: displayData.value,
        signatureType: displayData.type,
        ...(fieldType !== DocumentFieldsIdentifiers.STAMP
          ? { signatureStyle: displayData.style }
          : {}),
        status: SignatureFieldStatus.COMPLETED
      };
    }
    return field;
  });

  return updatedFields;
};

export const useSignatureFieldsUpdater = (
  displaySignature: SignatureData | null | undefined,
  displayInitials: SignatureData | null | undefined,
  displayStamp: SignatureData | null | undefined,
  signatureFields: SignatureField[] | null | undefined,
  setSignatureFields: (fields: SignatureField[]) => void
) => {
  const updatedFields = useMemo(() => {
    if (!signatureFields) return null;

    return (
      getUpdatedSignatureFields(
        displaySignature,
        DocumentFieldsIdentifiers.SIGN,
        signatureFields
      ) ||
      getUpdatedSignatureFields(
        displayInitials,
        DocumentFieldsIdentifiers.INITIAL,
        signatureFields
      ) ||
      getUpdatedSignatureFields(
        displayStamp,
        DocumentFieldsIdentifiers.STAMP,
        signatureFields
      ) ||
      null
    );
  }, [displaySignature, displayInitials, displayStamp, signatureFields]);

  useEffect(() => {
    if (updatedFields) {
      setSignatureFields(updatedFields);
    }
  }, [updatedFields, setSignatureFields]);
};
