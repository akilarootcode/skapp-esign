import axios from "axios";

import { useCommonStore } from "~community/common/stores/commonStore";
import authFetch from "~community/common/utils/axiosInterceptor";

import { s3Endpoints } from "../api/utils/ApiEndpoints";
import { S3ActionTypes } from "../types/s3Types";
import { getS3FoldersByUrl } from "../utils/awsS3ServiceFunctions";
import {
  getProfilePicOriginalUrl,
  getProfilePicThumbnailUrl
} from "../utils/commonUtilEnterprise";
import {
  BLOB_URL_IDENTIFIER,
  GOOGLE_USER_URL_IDENTIFIER
} from "../utils/configs";

const useS3Download = () => {
  const { s3FileUrls, setS3FileUrls } = useCommonStore((state) => ({
    s3FileUrls: state.s3FileUrls,
    setS3FileUrls: state.setS3FileUrls
  }));

  const getProfilePicUrl = ({
    filePath,
    isOriginalImage
  }: {
    filePath: string;
    isOriginalImage: boolean;
  }): string => {
    if (!filePath) {
      return "";
    }

    return isOriginalImage
      ? getProfilePicOriginalUrl(filePath)
      : getProfilePicThumbnailUrl(filePath);
  };

  const downloadS3File = async ({
    filePath,
    isProfilePic = false,
    isOriginalImage = false
  }: {
    filePath: string;
    isOriginalImage?: boolean;
    isProfilePic?: boolean;
  }) => {
    if (!filePath) {
      return;
    }

    if (
      isProfilePic &&
      s3FileUrls[filePath] &&
      !s3FileUrls[filePath].includes(BLOB_URL_IDENTIFIER)
    ) {
      return;
    }

    let newUrl = "";

    if (
      isProfilePic &&
      (filePath?.includes(BLOB_URL_IDENTIFIER) ||
        filePath?.includes(GOOGLE_USER_URL_IDENTIFIER))
    ) {
      newUrl = filePath;
    } else {
      const url = isProfilePic
        ? getProfilePicUrl({
            filePath,
            isOriginalImage: isOriginalImage ?? false
          })
        : filePath;

      const folderPath = getS3FoldersByUrl(url);

      const res = await authFetch.post(s3Endpoints.GET_SIGNED_URL, {
        folderPath: folderPath,
        action: S3ActionTypes.DOWNLOAD
      });

      newUrl = res?.data?.results[0]?.signedUrl;
    }

    setS3FileUrls({
      [filePath]: newUrl
    });
  };

  //This a temporary fix for the release. have to refactor this later
  const downloadESignatureFiles = async ({
    filePath
  }: {
    filePath: string;
  }) => {
    if (!filePath) {
      return;
    }

    const folderPath = getS3FoldersByUrl(filePath);

    const res = await authFetch.post(s3Endpoints.GET_SIGNED_URL, {
      folderPath: folderPath,
      action: S3ActionTypes.DOWNLOAD
    });

    const newUrl = res?.data?.results[0]?.signedUrl;
    return newUrl;
  };

  const forceRefetch = async (
    filePath: string,
    isOriginalImage: boolean = false
  ) => {
    if (!filePath) return;

    const url = getProfilePicUrl({
      filePath,
      isOriginalImage
    });

    const folderPath = getS3FoldersByUrl(url);

    const res = await axios.post(s3Endpoints.GET_SIGNED_URL, {
      folderPath: folderPath,
      action: S3ActionTypes.DOWNLOAD
    });

    const newUrl = res?.data?.results[0]?.signedUrl;

    setS3FileUrls({
      [filePath]: newUrl
    });
  };

  return {
    s3FileUrls,
    downloadS3File,
    forceRefetch,
    downloadESignatureFiles
  };
};

export default useS3Download;
