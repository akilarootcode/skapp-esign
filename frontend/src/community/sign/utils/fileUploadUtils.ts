import {
  uploadFileToS3ByUrl,
  uploadFileToS3ByUrlWithESignToken
} from "~community/common/utils/awsS3ServiceFunctions";

import { DocumentFieldsIdentifiers } from "../enums/CommonDocumentsEnums";
import { getFileCategory } from "./commonUtils";
import { getFileExtensionFromBlob } from "./fileHandlingUtils";

export interface S3UploadOptions {
  file: File;
  fieldType: DocumentFieldsIdentifiers;
  isInternalUser?: boolean;
  eSignToken?: string;
}

export const uploadFileToS3 = async ({
  file,
  fieldType,
  isInternalUser = false,
  eSignToken
}: S3UploadOptions): Promise<string> => {
  const fileCategory = getFileCategory(fieldType);

  if (!isInternalUser && eSignToken) {
    return await uploadFileToS3ByUrlWithESignToken(
      file,
      fileCategory,
      eSignToken
    );
  } else {
    return await uploadFileToS3ByUrl(file, fileCategory);
  }
};

export const createUniqueFileName = (
  prefix: string,
  type: string,
  extension: string
): string => {
  return `${prefix}_${type}.${extension}`;
};

export const createUniquePdfNameWithTimestamp = (
  originalName: string
): string => {
  const timestamp = Date.now();
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const fileExtension = originalName.split(".").pop();
  return `${baseName}_${timestamp}.${fileExtension}`;
};

export const createFileFromBlob = (
  blob: Blob,
  baseFileName: string,
  fallbackMimeType: string = "image/png"
): File => {
  const fileExtension = getFileExtensionFromBlob(blob);
  const fileName = `${baseFileName}.${fileExtension}`;

  return new File([blob], fileName, {
    type: blob.type || fallbackMimeType
  });
};

export const fetchUrlAsFile = async (
  url: string,
  baseFileName: string,
  fallbackMimeType: string = "image/png"
): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return createFileFromBlob(blob, baseFileName, fallbackMimeType);
};

export const createTextCanvas = (
  text: string,
  font: string,
  color: string,
  width: number,
  height: number,
  padding: number = 0
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  const devicePixelRatio = window.devicePixelRatio || 1;

  const scaleFactor = Math.max(devicePixelRatio, 2);

  ctx.font = font;
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;

  const requiredWidth = Math.max(textWidth + padding * 2, width);

  canvas.style.width = `${requiredWidth}px`;
  canvas.style.height = `${height}px`;

  canvas.width = requiredWidth * scaleFactor;
  canvas.height = height * scaleFactor;

  ctx.scale(scaleFactor, scaleFactor);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(text, requiredWidth / 2, height / 2);

  return canvas;
};

export const canvasToFile = async (
  canvas: HTMLCanvasElement,
  fileName: string,
  mimeType: string = "image/png"
): Promise<File> => {
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
      },
      mimeType,
      1
    );
  });

  return new File([blob], fileName, { type: mimeType });
};
