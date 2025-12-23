import {
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import authFetch from "~community/common/utils/axiosInterceptor";

import { MySignatureLinkDto, InboxEnvelopeResponse } from "../types/CommonEsignTypes";
import { GetAllInboxParams } from "../types/ESignInboxTypes";
import { eSignEndpoints } from "./utils/ApiEndpoints";
import { eSignQueryKeys } from "./utils/QueryKeys";

export const useGetAllInbox = (params: GetAllInboxParams) => {
  return useQuery({
    queryKey: eSignQueryKeys.getAllInboxEnvelopes(params),
    queryFn: async () => {
      const results = await authFetch.get(eSignEndpoints.GET_ENVELOPE_DETAILS, {
        params
      });
      return results.data.results[0];
    }
  });
};

export const useGetNeedToSignEnvelopeCount = (userId: number) => {
  return useQuery({
    queryKey: eSignQueryKeys.getNeedToSignCount(userId),
    queryFn: async () => {
      const results = await authFetch.get(
        eSignEndpoints.GET_NEED_TO_SIGN_ENVELOPES_COUNT(userId)
      );
      return results.data.results[0];
    }
  });
};

export const useGetMySignatureLink = () => {
  return useQuery({
    queryKey: eSignQueryKeys.getMySignatureLink,
    queryFn: async () => {
      const results = await authFetch.get(eSignEndpoints.GET_MY_SIGNATURE_LINK);
      return results.data.results[0];
    }
  });
};

export const useAddUpdateMySignatureLink = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MySignatureLinkDto) => {
      const response = await authFetch.patch(
        eSignEndpoints.ADD_UPDATE_MY_SIGNATURE_LINK,
        data
      );
      return response.data.results[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.getMySignatureLink
      });
      if (onSuccess) onSuccess();
    },
    onError
  });
};

export const useGetInboxEnvelopeAuditLogs = (envelopeId: number) => {
  return useQuery({
    queryKey: eSignQueryKeys.getInboxEnvelopeAuditLogs(envelopeId),
    queryFn: async () => {
      const response = await authFetch.get(
        eSignEndpoints.GET_INBOX_ENVELOPE_AUDIT_LOGS(envelopeId)
      );
      return response.data.results;
    }
  });
};

export const useGetAllInboxByUserId = (
  params: GetAllInboxParams,
  userId: number
): UseInfiniteQueryResult<InboxEnvelopeResponse> => {
  return useInfiniteQuery({
    initialPageParam: 0,
    queryKey: eSignQueryKeys.getAllInboxEnvelopesByUserId(params, userId),
    queryFn: async ({ pageParam = 0 }) => {
      const { page, ...restParams } = params;
      const results = await authFetch.get(
        eSignEndpoints.GET_ENVELOPE_DETAILS_BY_USER_ID(userId),
        {
          params: {
            page: pageParam,
            ...restParams
          }
        }
      );
      return results.data.results[0];
    },
    getPreviousPageParam: (firstPage) => {
      if (firstPage?.currentPage && firstPage?.currentPage > 0) {
        return firstPage?.currentPage - 1;
      }
      return undefined;
    },
    getNextPageParam: (lastPage) => {
      if (
        lastPage?.currentPage !== undefined &&
        lastPage?.totalPages !== undefined &&
        lastPage?.currentPage < lastPage?.totalPages - 1
      ) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    refetchOnWindowFocus: false
  });
};
