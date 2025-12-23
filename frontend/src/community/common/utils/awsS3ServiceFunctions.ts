import axios, { type AxiosProgressEvent } from "axios";

import authFetch from "~community/common/utils/axiosInterceptor";
import { createExternalSigningDocumentAuthAxios } from "~community/sign/api/eSignAxiosInterceptor";

import { s3Endpoints } from "../api/utils/ApiEndpoints";
import { FileCategories, S3ActionTypes } from "../types/s3Types";
import { containsEncodedComponents } from "./commonUtilEnterprise";
import {
  ESIGN_FILLED_FIELDS_IDENTIFIER,
  ESIGN_INITIALS_ORIGINAL_IDENTIFIER,
  ESIGN_SIGNATURE_ORIGINAL_IDENTIFIER,
  ESIGN_STAMP_ORIGINAL_IDENTIFIER,
  ESIGN_URL_IDENTIFIER,
  S3_ICON_FOLDER_IDENTIFIER,
  S3_INVOICE_LOGO_FOLDER_IDENTIFIER,
  S3_LEAVE_FOLDER_IDENTIFIER,
  S3_LOGO_FOLDER_IDENTIFIER,
  S3_PROFILE_ORIGINAL_FOLDER_IDENTIFIER,
  S3_PROFILE_THUMBNAIL_FOLDER_IDENTIFIER
} from "./configs";

const getSubDomain = (url: string, multipleValues: boolean = false) => {
  const subdomain = multipleValues ? url.split(".") : url.split(".")[0];
  return subdomain;
};

export const tenantID =
  typeof window !== "undefined"
    ? getSubDomain(window.location.hostname)
    : "skapp-common";

export const uploadFileToS3ByUrl = async (
  file: File,
  fileCategory: FileCategories,
  setFileUploadProgress?: (value: number) => void
) => {
  const res = await authFetch.post(s3Endpoints.GET_SIGNED_URL, {
    folderPath: `${fileCategory}/${tenantID}/${file?.name}`,
    fileType: file?.type,
    action: S3ActionTypes.UPLOAD
  });

  await axios.put(res?.data?.results[0]?.signedUrl, file, {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent?.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setFileUploadProgress?.(percentCompleted);
      }
    },
    headers: {
      "Content-type": file?.type,
      "Access-Control-Allow-Origin": "*"
    }
  });

  const filePath = `${fileCategory}/${tenantID}/${file?.name}`;

  return filePath;
};

export const uploadOtherDocumentsToS3ByUrl = async (
  file: File,
  fileCategory: FileCategories
) => {
  const res = await authFetch.post(s3Endpoints.GET_INVOICE_SIGNED_URL, {
    folderPath: `${fileCategory}/${tenantID}/${file?.name}`,
    fileType: file?.type,
    action: S3ActionTypes.UPLOAD,
    fileSize: file?.size
  });

  await axios.put(res?.data?.results[0]?.signedUrl, file, {
    headers: {
      "Content-Type": file?.type,
      "Access-Control-Allow-Origin": "*"
    }
  });

  const filePath = `${fileCategory}/${tenantID}/${file?.name}`;

  return filePath;
};

export const uploadFileToS3ByUrlForOrganizationSetup = async (
  file: File,
  fileCategory: FileCategories,
  setFileUploadProgress?: (value: number) => void
) => {
  const res = await authFetch.post(
    s3Endpoints.GET_ORGANIZATION_SETUP_SIGNED_URL,
    {
      folderPath: `${fileCategory}/${tenantID}/${file?.name}`,
      fileType: file?.type,
      action: S3ActionTypes.UPLOAD
    }
  );

  await axios.put(res?.data?.results[0]?.signedUrl, file, {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent?.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setFileUploadProgress?.(percentCompleted);
      }
    },
    headers: {
      "Content-type": file?.type,
      "Access-Control-Allow-Origin": "*"
    }
  });

  const filePath = `${fileCategory}/${tenantID}/${file?.name}`;

  return filePath;
};

export const uploadFileToS3ByUrlWithESignToken = async (
  file: File,
  fileCategory: FileCategories,
  eSignToken: string,
  setFileUploadProgress?: (value: number) => void
) => {
  const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

  const res = await eSignAxios.post(s3Endpoints.GET_ESIGN_SIGNED_URL, {
    folderPath: `${fileCategory}/${tenantID}/${file?.name}`,
    fileType: file?.type,
    action: S3ActionTypes.UPLOAD
  });

  await axios.put(res?.data?.results[0]?.signedUrl, file, {
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (progressEvent?.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setFileUploadProgress?.(percentCompleted);
      }
    },
    headers: {
      "Content-type": file?.type,
      "Access-Control-Allow-Origin": "*"
    }
  });

  const filePath = `${fileCategory}/${tenantID}/${file?.name}`;

  return filePath;
};

export const deleteFileFromS3 = async (filePath: string) => {
  const folderPath = getS3FoldersByUrl(filePath);
  if (folderPath) {
    await authFetch.delete(s3Endpoints.DELETE_FILE, {
      data: { folderPath: folderPath }
    });
  }
};

export const getS3FoldersByUrl = (filePath: string) => {
  const formattedFilePath = containsEncodedComponents(filePath)
    ? decodeURIComponent(filePath)
    : decodeURI(filePath);
  if (formattedFilePath?.includes(S3_LEAVE_FOLDER_IDENTIFIER)) {
    return (
      S3_LEAVE_FOLDER_IDENTIFIER +
      formattedFilePath?.split(S3_LEAVE_FOLDER_IDENTIFIER)[1]
    );
  } else if (formattedFilePath?.includes(S3_LOGO_FOLDER_IDENTIFIER)) {
    return (
      S3_LOGO_FOLDER_IDENTIFIER +
      formattedFilePath?.split(S3_LOGO_FOLDER_IDENTIFIER)[1]
    );
  } else if (
    formattedFilePath?.includes(S3_PROFILE_ORIGINAL_FOLDER_IDENTIFIER)
  ) {
    return (
      S3_PROFILE_ORIGINAL_FOLDER_IDENTIFIER +
      formattedFilePath?.split(S3_PROFILE_ORIGINAL_FOLDER_IDENTIFIER)[1]
    );
  } else if (
    formattedFilePath?.includes(S3_PROFILE_THUMBNAIL_FOLDER_IDENTIFIER)
  ) {
    return (
      S3_PROFILE_THUMBNAIL_FOLDER_IDENTIFIER +
      formattedFilePath?.split(S3_PROFILE_THUMBNAIL_FOLDER_IDENTIFIER)[1]
    );
  } else if (formattedFilePath?.includes(S3_ICON_FOLDER_IDENTIFIER)) {
    return (
      S3_ICON_FOLDER_IDENTIFIER +
      formattedFilePath?.split(S3_ICON_FOLDER_IDENTIFIER)[1]
    );
  } else if (formattedFilePath?.includes(ESIGN_URL_IDENTIFIER)) {
    return (
      ESIGN_URL_IDENTIFIER + formattedFilePath?.split(ESIGN_URL_IDENTIFIER)[1]
    );
  } else if (formattedFilePath?.includes(ESIGN_FILLED_FIELDS_IDENTIFIER)) {
    return (
      ESIGN_FILLED_FIELDS_IDENTIFIER +
      formattedFilePath?.split(ESIGN_FILLED_FIELDS_IDENTIFIER)[1]
    );
  } else if (formattedFilePath?.includes(ESIGN_SIGNATURE_ORIGINAL_IDENTIFIER)) {
    return (
      ESIGN_SIGNATURE_ORIGINAL_IDENTIFIER +
      formattedFilePath?.split(ESIGN_SIGNATURE_ORIGINAL_IDENTIFIER)[1]
    );
  } else if (formattedFilePath?.includes(ESIGN_INITIALS_ORIGINAL_IDENTIFIER)) {
    return (
      ESIGN_INITIALS_ORIGINAL_IDENTIFIER +
      formattedFilePath?.split(ESIGN_INITIALS_ORIGINAL_IDENTIFIER)[1]
    );
  } else if (formattedFilePath?.includes(ESIGN_STAMP_ORIGINAL_IDENTIFIER)) {
    return (
      ESIGN_STAMP_ORIGINAL_IDENTIFIER +
      formattedFilePath?.split(ESIGN_STAMP_ORIGINAL_IDENTIFIER)[1]
    );
  } else {
    return formattedFilePath;
  }
};
