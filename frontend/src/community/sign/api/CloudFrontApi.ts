import { UseMutationResult, useMutation } from "@tanstack/react-query";

import authFetch from "~community/common/utils/axiosInterceptor";
import { createExternalSigningDocumentAuthAxios } from "~community/sign/api/eSignAxiosInterceptor";
import { useESignStore } from "~community/sign/store/signStore";

import { cloudFrontEndpoints } from "./utils/ApiEndpoints";

interface CfSignedCookieResponse {
  expiresAt: number;
}

export const useSetDocumentCookies = (
  onSuccess?: (data: CfSignedCookieResponse) => void,
  onError?: (error: Error) => void
): UseMutationResult<CfSignedCookieResponse, Error, void> => {
  return useMutation<CfSignedCookieResponse, Error, void>({
    mutationFn: async (): Promise<CfSignedCookieResponse> => {
      const response = await authFetch.get(
        cloudFrontEndpoints.INTERNAL_DOCUMENT_COOKIES,
        { withCredentials: true }
      );
      return response.data.results[0];
    },
    onSuccess,
    onError
  });
};

export const useSetSignatureCookies = (
  onSuccess?: (data: CfSignedCookieResponse) => void,
  onError?: (error: Error) => void
): UseMutationResult<CfSignedCookieResponse, Error, void> => {
  return useMutation<CfSignedCookieResponse, Error, void>({
    mutationFn: async (): Promise<CfSignedCookieResponse> => {
      const response = await authFetch.get(
        cloudFrontEndpoints.INTERNAL_SIGNATURE_COOKIES,
        { withCredentials: true }
      );
      return response.data.results[0];
    },
    onSuccess,
    onError
  });
};

export const useSetExternalDocumentCookies = (
  onSuccess?: (data: CfSignedCookieResponse) => void,
  onError?: (error: Error) => void
): UseMutationResult<CfSignedCookieResponse, Error, void> => {
  const { eSignToken } = useESignStore();

  return useMutation<CfSignedCookieResponse, Error, void>({
    mutationFn: async (): Promise<CfSignedCookieResponse> => {
      if (!eSignToken) {
        throw new Error("Authentication token is missing");
      }

      const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

      const response = await eSignAxios.get(
        cloudFrontEndpoints.EXTERNAL_DOCUMENT_COOKIES,
        { withCredentials: true }
      );
      return response.data.results[0];
    },
    onSuccess,
    onError
  });
};

export const useSetExternalSignatureCookies = (
  onSuccess?: (data: CfSignedCookieResponse) => void,
  onError?: (error: Error) => void
): UseMutationResult<CfSignedCookieResponse, Error, void> => {
  const { eSignToken } = useESignStore();

  return useMutation<CfSignedCookieResponse, Error, void>({
    mutationFn: async (): Promise<CfSignedCookieResponse> => {
      if (!eSignToken) {
        throw new Error("Authentication token is missing");
      }

      const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

      const response = await eSignAxios.get(
        cloudFrontEndpoints.EXTERNAL_SIGNATURE_COOKIES,
        { withCredentials: true }
      );
      return response.data.results[0];
    },
    onSuccess,
    onError
  });
};
