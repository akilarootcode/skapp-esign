import {
  DISPLAY_FIELD_STYLES,
  FONT_COLORS,
  FONT_STYLES,
  SignatureData
} from "../constants";
import {
  DocumentFieldHeights,
  DocumentFieldWidths
} from "../enums/CommonDocumentsEnums";
import { SignatureTabType } from "../enums/CommonEnums";
import { FieldUploadOptions } from "../types/CommonEsignTypes";
import { SignatureFieldStatus } from "../types/ESignFormTypes";
import { createFileNamePrefix } from "./commonUtils";
import { base64ToBlob } from "./fileHandlingUtils";
import {
  canvasToFile,
  createTextCanvas,
  createUniqueFileName,
  fetchUrlAsFile,
  uploadFileToS3
} from "./fileUploadUtils";

export const uploadFilledFieldToS3 = async (
  options: FieldUploadOptions
): Promise<string | null> => {
  const {
    fieldData,
    documentId,
    recipientId,
    fieldType,
    isInternalUser,
    eSignToken
  } = options;

  try {
    const fieldValue = fieldData.value;

    if (!fieldValue) {
      return null;
    }

    const uniquePrefix = createFileNamePrefix(documentId, recipientId);

    if (fieldData.type === "image") {
      let fileToUpload: File;

      if (fieldData.file instanceof File) {
        // Create a unique filename instead of using the original file name
        const fileExtension = fieldData.file.name.split(".").pop() || "png";
        const uniqueFileName = createUniqueFileName(
          uniquePrefix,
          fieldType,
          fileExtension
        );

        fileToUpload = new File([fieldData.file], uniqueFileName, {
          type: fieldData.file.type
        });
      } else {
        // For base64 data, default to PNG since most signatures/drawings are PNG
        const blob = base64ToBlob(fieldValue, "image/png");
        const uniqueFileName = createUniqueFileName(
          uniquePrefix,
          fieldType,
          "png"
        );

        fileToUpload = new File([blob], uniqueFileName, {
          type: "image/png"
        });
      }

      return await uploadFileToS3({
        file: fileToUpload,
        fieldType,
        isInternalUser,
        eSignToken
      });
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const convertSignatureToFile = async (
  signatureString: string
): Promise<File | null> => {
  try {
    const baseFileName = `signature_${Date.now()}`;
    return await fetchUrlAsFile(signatureString, baseFileName);
  } catch {
    return null;
  }
};

export const prepareSignatureForUpload = async (
  activeTab: SignatureTabType,
  currentSignature: SignatureData,
  uploadedSignature: string | null,
  documentId?: string | number,
  recipientId?: string | number
): Promise<File | string | undefined> => {
  const uniquePrefix =
    documentId && recipientId
      ? createFileNamePrefix(documentId, recipientId)
      : `signature_${Date.now()}`;

  if (activeTab === SignatureTabType.TYPE) {
    const canvas = createTextCanvas(
      currentSignature.value,
      `24px ${currentSignature.style?.font || FONT_STYLES[0].value}`,
      currentSignature.style?.color || FONT_COLORS[0].value,
      DocumentFieldWidths.SIGN,
      DocumentFieldHeights.SIGN,
      DISPLAY_FIELD_STYLES.SIGNATURE_TEXT_PADDING
    );

    const fileName = `${uniquePrefix}_signature.png`;
    return await canvasToFile(canvas, fileName, "image/png");
  } else if (activeTab === SignatureTabType.DRAW) {
    const baseFileName = `${uniquePrefix}_signature`;
    return await fetchUrlAsFile(currentSignature.value, baseFileName);
  } else if (activeTab === SignatureTabType.UPLOAD && uploadedSignature) {
    const baseFileName = `${uniquePrefix}_signature`;
    return await fetchUrlAsFile(uploadedSignature, baseFileName);
  }

  return undefined;
};

export const prepareInitialsForUpload = async (
  currentSignature: SignatureData,
  documentId?: string | number,
  recipientId?: string | number
): Promise<File | string | undefined> => {
  const uniquePrefix =
    documentId && recipientId
      ? createFileNamePrefix(documentId, recipientId)
      : `initial_${Date.now()}`;

  const canvas = createTextCanvas(
    currentSignature.value,
    `24px ${currentSignature.style?.font || FONT_STYLES[0].value}`,
    currentSignature.style?.color || FONT_COLORS[0].value,
    DocumentFieldWidths.INITIAL_AND_STAMP,
    DocumentFieldHeights.INITIAL_AND_STAMP,
    DISPLAY_FIELD_STYLES.SIGNATURE_TEXT_PADDING
  );

  const fileName = `${uniquePrefix}_initials.png`;
  return await canvasToFile(canvas, fileName, "image/png");
};

export const createFieldSignPayload = (
  documentId: string | number,
  recipientId: string | number,
  envelopeId: string | number,
  currentField: any,
  fieldWidth: number,
  fieldHeight: number,
  fieldValue: string | null,
  fieldType: string
) => {
  return {
    documentId: Number(documentId),
    recipientId: Number(recipientId),
    envelopeId: Number(envelopeId),
    fieldSignDto: {
      fieldId: currentField?.id ?? 0,
      type: fieldType,
      status: SignatureFieldStatus.COMPLETED,
      pageNumber: currentField?.page ?? 0,
      xposition: currentField?.x ?? 0,
      yposition: currentField?.y ?? 0,
      width: fieldWidth,
      height: fieldHeight,
      fieldValue: fieldValue
    }
  };
};

export interface SignatureState {
  activeTab: SignatureTabType;
  typedSignature: {
    name: string;
    font: string;
    color: string;
  };
}

export interface InitialSignatureState extends SignatureState {
  currentSignatureUrl?: string;
  currentSignatureMethod?: string;
}

export interface CurrentSignatureState extends SignatureState {
  drawnSignature: string | null;
  uploadedSignature: string | null;
}

export const detectSignatureChanges = (
  currentState: CurrentSignatureState,
  initialState: InitialSignatureState
): boolean => {
  if (
    (!initialState.currentSignatureUrl ||
      !initialState.currentSignatureMethod) &&
    currentState.activeTab === SignatureTabType.TYPE &&
    currentState.typedSignature.name.trim() !== ""
  ) {
    return true;
  }
  const tabChanged = currentState.activeTab !== initialState.activeTab;

  let contentChanged = false;

  if (currentState.activeTab === SignatureTabType.TYPE) {
    contentChanged =
      currentState.typedSignature.name !== initialState.typedSignature.name ||
      currentState.typedSignature.font !== initialState.typedSignature.font ||
      currentState.typedSignature.color !== initialState.typedSignature.color;
  } else if (currentState.activeTab === SignatureTabType.DRAW) {
    contentChanged = !!currentState.drawnSignature;
  } else if (currentState.activeTab === SignatureTabType.UPLOAD) {
    contentChanged = !!currentState.uploadedSignature;
  }
  return tabChanged || contentChanged;
};
