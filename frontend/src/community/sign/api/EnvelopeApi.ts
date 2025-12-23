import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import authFetch from "~community/common/utils/axiosInterceptor";

import { useESignStore } from "../store/signStore";
import { AuditTrailDto } from "../types/AuditTrialTypes";
import { createExternalSigningDocumentAuthAxios } from "./eSignAxiosInterceptor";
import { eSignEndpoints } from "./utils/ApiEndpoints";
import { eSignQueryKeys } from "./utils/QueryKeys";

export const useVoidSpecificEnvelope = (
  envelopeId: number,
  onSuccess: () => void,
  onError: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: eSignQueryKeys.voidEnvelope(envelopeId),
    mutationFn: async (payload: { voidReason: string }) => {
      const response = await authFetch.patch(
        eSignEndpoints.VOID_ENVELOPE(envelopeId),
        payload
      );
      return response?.data?.results[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.getEnvelopeSenderDetailsById(envelopeId)
      });
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.getEnvelopeAuditLogs(envelopeId)
      });
      onSuccess();
    },
    onError
  });
};

export const useGetSpecificEnvelope = (envelopeId: number) => {
  return useQuery({
    queryKey: eSignQueryKeys.getEnvelopeByID(envelopeId),
    queryFn: async () => {
      const response = await authFetch.get(
        eSignEndpoints.GET_ENVELOPE_BY_ID(envelopeId)
      );
      return response?.data?.results[0];
    }
  });
};

export const useSearchInternalEsignSenders = (searchTerm: string) => {
  return useQuery({
    queryKey: eSignQueryKeys.searchInternalEsignSenders(searchTerm),
    queryFn: async () => {
      const response = await authFetch.get(
        eSignEndpoints.SEARCH_INTERNAL_ESIGN__SENDERS,
        {
          params: {
            keyWord: searchTerm
          }
        }
      );
      return response?.data?.results;
    },
    enabled: !!searchTerm
  });
};

export const useCustodyTransfer = (
  envelopeId: number,
  onSuccess?: () => void,
  onError?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (addressBookId: number) => {
      const response = await authFetch.patch(
        eSignEndpoints.TRANSFER_ENVELOPE_CUSTODY,
        null,
        {
          params: {
            envelopeId: envelopeId,
            addressbookId: addressBookId
          }
        }
      );
      return response?.data?.results[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.getEnvelopeSenderDetailsById(envelopeId)
      });
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.getEnvelopeAuditLogs(envelopeId)
      });
      if (onSuccess) onSuccess();
    },
    onError
  });
};

export const useCreateAuditLog = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  const { eSignToken } = useESignStore();

  return useMutation({
    mutationFn: async ({
      auditTrailDto,
      isInternalUser
    }: {
      auditTrailDto: AuditTrailDto;
      isInternalUser: boolean;
    }) => {
      let response: AxiosResponse;
      if (!isInternalUser) {
        if (!eSignToken) {
          throw new Error("Authentication token is missing");
        }

        const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);

        response = await eSignAxios.post(
          eSignEndpoints.EXTERNAL_CREATE_ENVELOPE_AUDIT_LOGS,
          auditTrailDto
        );
      } else {
        response = await authFetch.post(
          eSignEndpoints.INTERNAL_CREATE_ENVELOPE_AUDIT_LOGS,
          auditTrailDto
        );
      }
      return response.data.results[0];
    },
    onSuccess,
    onError
  });
};

export const useDownloadEnvelopeSignatureCertificate = (
  onError?: () => void
) => {
  return useMutation({
    mutationFn: async (envelopeId: number) => {
      const response = await authFetch.get(
        eSignEndpoints.DOWNLOAD_ENVELOPE_SIGNATURE_CERTIFICATE,
        {
          params: { envelopeId },
          responseType: "blob"
        }
      );
      return response;
    },
    onError
  });
};
