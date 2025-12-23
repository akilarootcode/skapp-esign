import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DateFormatType } from "~community/common/constants/timeConstants";
import authFetch from "~community/common/utils/axiosInterceptor";
import { DATE_FORMAT_MAPPINGS } from "~community/sign/constants";
import { DateFormatEnum } from "~community/sign/enums/ESignConfigEnums";

import { useESignStore } from "../store/signStore";
import { createExternalSigningDocumentAuthAxios } from "./eSignAxiosInterceptor";
import { eSignEndpoints } from "./utils/ApiEndpoints";
import { eSignQueryKeys } from "./utils/QueryKeys";

export const useGetESignConfigs = (isEnabled: boolean = true) => {
  return useQuery({
    queryKey: eSignQueryKeys.getESignConfigs,
    queryFn: async () => {
      const response = await authFetch.get(eSignEndpoints.GET_ESIGN_CONFIGS);
      const data = response.data.results[0];

      const dateFormat = data.dateFormat as DateFormatType;
      const mappedDateFormat = DATE_FORMAT_MAPPINGS[dateFormat];

      return {
        ...data,
        dateFormat: mappedDateFormat
      };
    },
    enabled: isEnabled
  });
};

export const useGetExternalESignConfigs = (isEnabled: boolean = true) => {
  const { eSignToken } = useESignStore();

  return useQuery({
    queryKey: [...eSignQueryKeys.getESignConfigs, eSignToken],
    queryFn: async () => {
      if (!eSignToken) {
        throw new Error("Authentication token is missing");
      }

      const eSignAxios = createExternalSigningDocumentAuthAxios(eSignToken);
      const response = await eSignAxios.get(
        eSignEndpoints.EXTERNAL_GET_ESIGN_CONFIGS
      );

      const data = response.data.results[0];
      const dateFormat = data.dateFormat as DateFormatType;
      const mappedDateFormat = DATE_FORMAT_MAPPINGS[dateFormat];

      return {
        ...data,
        dateFormat: mappedDateFormat
      };
    },
    enabled: isEnabled
  });
};

const updateESignConfigsFn = async (configData: {
  dateFormat: DateFormatEnum;
  defaultEnvelopeExpireDays: number;
  reminderDaysBeforeExpire: number;
}) => {
  const response = await authFetch.patch(
    eSignEndpoints.UPDATE_ESIGN_CONFIGS,
    configData
  );
  return response.data;
};

export const useUpdateESignConfigs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: eSignQueryKeys.getESignConfigs,
    mutationFn: updateESignConfigsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: eSignQueryKeys.getESignConfigs
      });
    }
  });
};
