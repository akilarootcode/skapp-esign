import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useDebounce from "~community/common/hooks/useDebounce";
import { ErrorResponse } from "~community/common/types/CommonTypes";
import authFetch from "~community/common/utils/axiosInterceptor";

import { EnvelopeDetailDto } from "../types/CreateEnvelopTypes";
import {
  AddExternalUserPayloadType,
  AddExternalUserResponseDto
} from "../types/ESignFormTypes";
import { eSignEndpoints } from "./utils/ApiEndpoints";
import { eSignQueryKeys } from "./utils/QueryKeys";

export const useGetRecipientsForDocuments = (searchTerm: string) => {
  const debouncedTerm = useDebounce(searchTerm, 500);
  return useQuery({
    queryKey: eSignQueryKeys.getRecipientsForDocuments(debouncedTerm),
    queryFn: async () => {
      const result = await authFetch.get(
        eSignEndpoints.SEARCH_RECIPIENTS_FOR_DOCUMENTS,
        {
          params: {
            keyWord: debouncedTerm
          }
        }
      );

      return result?.data?.results;
    },
    refetchOnWindowFocus: false
  });
};

export const useCreateExternalUser = (
  onSuccess: (data: AddExternalUserResponseDto) => void,
  onError?: (error: ErrorResponse) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddExternalUserPayloadType) => {
      const response = await authFetch.post(
        eSignEndpoints.CREATE_EXTERNAL_USER,
        payload
      );
      return response?.data?.results[0] as AddExternalUserResponseDto;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.contactDataTable()
      });
      onSuccess(data);
    },
    onError: (error: ErrorResponse) => {
      onError?.(error);
    }
  });
};

export const useUploadDocumentPath = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: async (payload: { name: string; filePath: string }) => {
      const response = await authFetch.post(
        eSignEndpoints.UPLOAD_DOCUMENT_PATH,
        payload
      );
      return response?.data?.results[0];
    },
    onSuccess
  });
};

export const useEditDocument = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async (payload: { filePath: string; name: string }) => {
      const response = await authFetch.patch(
        eSignEndpoints.EDIT_DOCUMENT(id),
        payload
      );
      return response?.data?.results[0];
    },
    onSuccess
  });
};

export const useDeleteDocument = (id: string, onSuccess: () => void) => {
  return useMutation({
    mutationFn: async () => {
      const response = await authFetch.delete(
        eSignEndpoints.DELETE_DOCUMENT(id)
      );
      return response?.data?.results[0];
    },
    onSuccess
  });
};

export const useCreateEnvelop = (
  onSuccess: (response: any) => void,
  onError: () => void
) => {
  return useMutation({
    mutationFn: async (payload: EnvelopeDetailDto) => {
      const response = await authFetch.post(
        eSignEndpoints.CREATE_ENVELOP,
        payload
      );
      return response?.data?.results[0];
    },
    onSuccess,
    onError
  });
};

export const useUpdateExternalUser = (
  onSuccess: (data: AddExternalUserResponseDto) => void,
  onError?: (error: ErrorResponse) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddExternalUserPayloadType) => {
      const { id, ...updateData } = payload;
      const response = await authFetch.patch(
        `${eSignEndpoints.UPDATE_EXTERNAL_USER}/${id}`,
        updateData
      );
      return response?.data?.results[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.contactDataTable()
      });
      onSuccess(data);
    },
    onError: (error: ErrorResponse) => {
      onError?.(error);
    }
  });
};

export const useDeleteExternalUser = (
  onSuccess: () => void,
  onError: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await authFetch.patch(
        `${eSignEndpoints.DELETE_EXTERNAL_USER}/${id}`
      );
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.contactDataTable()
      });
      onSuccess();
    },
    onError
  });
};

export const useGetNextNeedToSignEnvelopes = (
  page: number,
  size: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: eSignQueryKeys.getNextNeedToSignEnvelopes(page, size),
    queryFn: async () => {
      const result = await authFetch.get(
        eSignEndpoints.GET_NEXT_NEEDTOSIGN_ENVELOPES,
        {
          params: {
            page,
            size
          }
        }
      );

      return result?.data?.results[0];
    },
    refetchOnWindowFocus: false,
    enabled
  });
};
