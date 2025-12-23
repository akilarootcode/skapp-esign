import { FileCategories } from "~community/common/types/s3Types";
import { DATE_FORMAT } from "~community/people/utils/constants/constants";

import {
  DocumentFieldsIdentifiers,
  MetadataKeys
} from "../enums/CommonDocumentsEnums";
import { DateFormatEnum } from "../enums/ESignConfigEnums";
import { FieldResponseDtoList } from "../types/CommonEsignTypes";

export const createFileNamePrefix = (
  documentId: string | number | null,
  recipientId: string | number | null
): string => {
  const docId = documentId;
  const recId = recipientId;

  return `${docId}_${recId}`;
};

export const getFileCategory = (
  fieldType: DocumentFieldsIdentifiers
): FileCategories => {
  switch (fieldType) {
    case DocumentFieldsIdentifiers.INITIAL:
      return FileCategories.ESIGN_INITIALS_ORIGINAL;
    case DocumentFieldsIdentifiers.SIGN:
      return FileCategories.ESIGN_SIGNATURE_ORIGINAL;
    case DocumentFieldsIdentifiers.STAMP:
      return FileCategories.ESIGN_STAMP_ORIGINAL;
    default:
      return FileCategories.ESIGN_SIGNATURE_ORIGINAL;
  }
};

export function getFieldByType(
  type: DocumentFieldsIdentifiers,
  fieldResponseDtoList: FieldResponseDtoList[]
) {
  if (!type || !Array.isArray(fieldResponseDtoList)) return null;
  return fieldResponseDtoList.find((field) => field.type === type) || null;
}

export const convertToLuxonFormat = (
  format: DateFormatEnum | undefined
): string => {
  switch (format) {
    case DateFormatEnum.MM_DD_YYYY:
      return DATE_FORMAT.MM_DD_YYYY_SLASH;
    case DateFormatEnum.DD_MM_YYYY:
      return DATE_FORMAT.DD_MM_YYYY_SLASH;
    case DateFormatEnum.YYYY_MM_DD:
      return DATE_FORMAT.YYYY_MM_DD_SLASH;
    default:
      return DATE_FORMAT.MM_DD_YYYY_SLASH;
  }
};

export const getMetadataValue = (
  metadata: Array<{ name: string; value: string }> | undefined | null,
  key?: MetadataKeys,
  defaultValue: string = ""
): string => {
  if (!metadata || metadata.length === 0) {
    return defaultValue;
  }

  if (key) {
    const item = metadata.find((item) => item.name === key);
    return item?.value || defaultValue;
  }

  return metadata[0]?.value || defaultValue;
};

export const fetchImageFromCloudFront = async (
  cloudFrontUrl: string,
  isInternalUser: boolean,
  setInternalCookies: (
    onSuccess: () => void,
    onError: (error: Error) => void
  ) => void,
  setExternalCookies: (
    onSuccess: () => void,
    onError: (error: Error) => void
  ) => void
): Promise<string | null> => {
  try {
    await new Promise<void>((resolve, reject) => {
      if (isInternalUser) {
        setInternalCookies(resolve, reject);
      } else {
        setExternalCookies(resolve, reject);
      }
    });

    const response = await fetch(cloudFrontUrl, {
      credentials: "include"
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
