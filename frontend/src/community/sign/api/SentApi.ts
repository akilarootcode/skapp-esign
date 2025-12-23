import { useMutation, useQuery } from "@tanstack/react-query";

import authFetch from "~community/common/utils/axiosInterceptor";

import { GetAllSentParams } from "../types/ESignInboxTypes";
import { eSignEndpoints } from "./utils/ApiEndpoints";
import { eSignQueryKeys } from "./utils/QueryKeys";

export const useGetAllSentEnvelopes = (params: GetAllSentParams) => {
  return useQuery({
    queryKey: eSignQueryKeys.getAllSentEnvelopes(params),
    queryFn: async () => {
      const results = await authFetch.get(
        eSignEndpoints.GET_ALL_SENT_ENVELOPES,
        {
          params
        }
      );
      return results.data.results[0];
    }
  });
};

export const useGetSentEnvelopeStats = () => {
  return useQuery({
    queryKey: eSignQueryKeys.getSentEnvelopeStats,
    queryFn: async () => {
      const response = await authFetch.get(
        eSignEndpoints.GET_SENT_ENVELOPE_STATS
      );
      return response.data.results[0];
    }
  });
};

export const useGetEnvelopeSenderDetailsById = (envelopeId: number) => {
  return useQuery({
    queryKey: eSignQueryKeys.getEnvelopeSenderDetailsById(envelopeId),
    queryFn: async () => {
      const response = await authFetch.get(
        eSignEndpoints.GET_ENVELOPE_SENDER_DETAILS_BY_ID(envelopeId)
      );
      return response.data.results[0];
    }
  });
};

export const useGetInboxDetailsById = (envelopeId: number) => {
  return useQuery({
    queryKey: eSignQueryKeys.getUseGetInboxDetailsById(envelopeId),
    queryFn: async () => {
      const response = await authFetch.get(
        eSignEndpoints.GET_INBOX_DETAILS_BY_ID(envelopeId)
      );
      return response.data.results[0];
    }
  });
};

export const useNudgeRecipient = (
  onSuccess: () => void,
  onError: () => void
) => {
  return useMutation({
    mutationFn: async (recipientId: number) => {
      const response = await authFetch.post(
        eSignEndpoints.NUDGE_RECIPIENT,
        null,
        {
          params: { recipientId }
        }
      );
      return response.data.results[0];
    },
    onSuccess,
    onError
  });
};

export const useGetSentEnvelopeAuditLogs = (envelopeId: number) => {
  return useQuery({
    queryKey: eSignQueryKeys.getEnvelopeAuditLogs(envelopeId),
    queryFn: async () => {
      const response = await authFetch.get(
        eSignEndpoints.GET_SENT_ENVELOPE_AUDIT_LOGS(envelopeId)
      );
      return response.data.results;
    },
    enabled: !!envelopeId
  });
};
