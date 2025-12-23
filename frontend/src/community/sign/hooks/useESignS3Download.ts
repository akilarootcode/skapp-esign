import { s3Endpoints } from "~community/common/api/utils/ApiEndpoints";
import { useCommonStore } from "~community/common/stores/commonStore";
import { S3ActionTypes } from "~community/common/types/s3Types";
import { getS3FoldersByUrl } from "~community/common/utils/awsS3ServiceFunctions";
import {
  getProfilePicOriginalUrl,
  getProfilePicThumbnailUrl
} from "~community/common/utils/commonUtilEnterprise";
import {
  BLOB_URL_IDENTIFIER,
  GOOGLE_USER_URL_IDENTIFIER
} from "~community/common/utils/configs";
import { createExternalSigningDocumentAuthAxios } from "~community/sign/api/eSignAxiosInterceptor";
import { useESignStore } from "~community/sign/store/signStore";

const useESignS3Download = () => {
  const { s3FileUrls, setS3FileUrls } = useCommonStore((state) => ({
    s3FileUrls: state.s3FileUrls,
    setS3FileUrls: state.setS3FileUrls
  }));

  const { eSignToken } = useESignStore();

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

  const downloadS3FileWithESign = async ({
    filePath,
    isProfilePic = false,
    isOriginalImage = false,
    token = eSignToken ?? ""
  }: {
    filePath: string;
    isOriginalImage?: boolean;
    isProfilePic?: boolean;
    token?: string;
  }) => {
    if (!filePath || !token) {
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

      // Use eSign token for authentication
      const eSignAxios = createExternalSigningDocumentAuthAxios(token);
      const res = await eSignAxios.post(s3Endpoints.GET_ESIGN_SIGNED_URL, {
        folderPath: folderPath,
        action: S3ActionTypes.DOWNLOAD
      });

      newUrl = res?.data?.results[0]?.signedUrl;
    }

    setS3FileUrls({
      [filePath]: newUrl
    });

    return newUrl;
  };

  const forceRefetchWithESign = async (
    filePath: string,
    isOriginalImage: boolean = false,
    token: string = eSignToken ?? ""
  ) => {
    if (!filePath || !token) return;

    const url = getProfilePicUrl({
      filePath,
      isOriginalImage
    });

    const folderPath = getS3FoldersByUrl(url);

    const eSignAxios = createExternalSigningDocumentAuthAxios(token);
    const res = await eSignAxios.post(s3Endpoints.GET_SIGNED_URL, {
      folderPath: folderPath,
      action: S3ActionTypes.DOWNLOAD
    });

    const newUrl = res?.data?.results[0]?.signedUrl;

    setS3FileUrls({
      [filePath]: newUrl
    });

    return newUrl;
  };

  return {
    s3FileUrls,
    downloadS3FileWithESign,
    forceRefetchWithESign
  };
};

export default useESignS3Download;
