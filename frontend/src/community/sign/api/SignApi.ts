import axios, { AxiosResponse } from "axios";

import { ApiVersions } from "~community/common/constants/configs";
import { ErrorResponse } from "~community/common/types/CommonTypes";
import authFetch from "~community/common/utils/axiosInterceptor";
import epAuthFetch from "~community/common/utils/axiosInterceptor";
import { getTenantID } from "~community/common/utils/commonUtilEnterprise";

import { useESignStore } from "../store/signStore";
import {
  AccessDocumentLinkParams,
  DeclineDocumentPayload,
  ResendDocumentLinkParams,
  SignDocumentPayload,
  SignDocumentResponse,
  TokenExchangeParams,
  TokenExchangeResponse
} from "../types/CommonEsignTypes";
import { createExternalSigningDocumentAuthAxios } from "./eSignAxiosInterceptor";
import { eSignEndpoints } from "./utils/ApiEndpoints";

export const useAccessDocumentLink = (
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) => {
  const { eSignToken } = useESignStore();

  const accessDocumentLink = async (params: AccessDocumentLinkParams) => {
    try {
      const { isInternalUser, documentId, recipientId } = params;
      let response: AxiosResponse;

      if (!documentId || !recipientId) {
        throw new Error("Document ID or Recipient ID is missing");
      }

      if (!isInternalUser) {
        if (!eSignToken) {
          throw new Error("Authentication token is missing");
        }

        const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

        response = await eSignAxios.post(
          `${eSignEndpoints.EXTERNAL_DOCUMENT_LINK_ACCESS}?documentId=${documentId}&recipientId=${recipientId}`
        );
      } else {
        response = await authFetch.post(
          `${eSignEndpoints.INTERNAL_DOCUMENT_LINK_ACCESS}?documentId=${documentId}&recipientId=${recipientId}`
        );
      }

      const data = response.data.results[0];
      onSuccess(data);
      return data;
    } catch (error) {
      onError(error);
    }
  };

  return { mutate: accessDocumentLink };
};

export const useSignDocument = (
  onSuccess: (response: SignDocumentResponse) => void,
  onError: (error: ErrorResponse) => void
) => {
  const { eSignToken } = useESignStore();

  const signDocument = async ({
    payload,
    isInternalUser
  }: {
    payload: SignDocumentPayload;
    isInternalUser?: boolean;
  }) => {
    try {
      let response: AxiosResponse;

      if (!isInternalUser) {
        if (!eSignToken) {
          throw new Error("Authentication token is missing");
        }

        const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

        response = await eSignAxios.post(
          eSignEndpoints.EXTERNAL_SIGN_DOCUMENT,
          payload
        );
      } else {
        response = await authFetch.post(
          eSignEndpoints.INTERNAL_SIGN_DOCUMENT,
          payload
        );
      }

      const data = response.data.results[0];
      onSuccess(data);
      return data;
    } catch (error) {
      onError(error as ErrorResponse);
    }
  };

  return { mutate: signDocument };
};

export const useResendDocumentLink = (
  onSuccess: () => void,
  onError: () => void
) => {
  const resendDocumentLink = async (payload: ResendDocumentLinkParams) => {
    try {
      const tenantId = getTenantID();

      const customAxios = axios.create({
        baseURL: epAuthFetch.defaults.baseURL + ApiVersions.V1
      });

      const headers = {
        "X-Tenant-ID": tenantId
      };

      const response: AxiosResponse = await customAxios.post(
        eSignEndpoints.RESEND_LINK,
        payload,
        { headers }
      );

      const data = response.data.results[0];
      onSuccess();
      return data;
    } catch {
      onError();
    }
  };

  return { mutate: resendDocumentLink };
};

export const useRecipientConsent = (
  onSuccess: () => void,
  onError: () => void
) => {
  const { eSignToken, recipientId } = useESignStore();

  const recipientConsent = async ({
    isConsent,
    isInternalUser
  }: {
    isConsent: boolean;
    isInternalUser: boolean;
  }) => {
    try {
      let response: AxiosResponse;

      if (!isInternalUser) {
        if (!eSignToken) {
          throw new Error("Authentication token is missing");
        }

        const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

        response = await eSignAxios.post(
          `${eSignEndpoints.EXTERNAL_RECIPIENT_CONSENT}?isConsent=${isConsent}`
        );
      } else {
        response = await authFetch.post(
          `${eSignEndpoints.INTERNAL_RECIPIENT_CONSENT}?isConsent=${isConsent}&recipientId=${recipientId}`
        );
      }

      const data = response.data.results[0];
      onSuccess();
      return data;
    } catch (error) {
      onError();
    }
  };

  return { mutate: recipientConsent };
};

export const useDeclineDocument = (
  onSuccess: () => void,
  onError: () => void
) => {
  const { eSignToken } = useESignStore();

  const declineDocument = async ({
    data,
    isInternalUser
  }: {
    data: DeclineDocumentPayload;
    isInternalUser?: boolean;
  }) => {
    try {
      let response: AxiosResponse;
      if (!isInternalUser) {
        if (!eSignToken) {
          throw new Error("Authentication token is missing");
        }
        const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

        response = await eSignAxios.patch(
          eSignEndpoints.EXTERNAL_DECLINE_DOCUMENT,
          { declineReason: data.declineReason },
          {
            params: { recipientId: data.recipientId }
          }
        );
      } else {
        response = await authFetch.patch(
          eSignEndpoints.INTERNAL_DECLINE_DOCUMENT,
          { declineReason: data.declineReason },
          {
            params: { recipientId: data.recipientId }
          }
        );
      }

      const result = response.data.results[0];
      onSuccess();
      return result;
    } catch {
      onError();
    }
  };

  return { mutate: declineDocument };
};

export const useTokenExchange = (
  onSuccess: (data: TokenExchangeResponse) => void,
  onError?: () => void
) => {
  const tokenExchange = async (params: TokenExchangeParams) => {
    try {
      const { uuid, state } = params;

      const customAxios = axios.create({
        baseURL: epAuthFetch.defaults.baseURL + ApiVersions.V1
      });

      const response: AxiosResponse = await customAxios.get(
        `${eSignEndpoints.TOKEN_EXCHANGE}?uuid=${encodeURIComponent(uuid)}&state=${encodeURIComponent(state)}`
      );

      const data = response.data.results[0];
      onSuccess(data);
      return data;
    } catch {
      if (onError) onError();
    }
  };

  return { mutate: tokenExchange };
};
