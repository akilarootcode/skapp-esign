import { useQuery } from "@tanstack/react-query";

import authFetch from "~community/common/utils/axiosInterceptor";

import { eSignEndpoints } from "./utils/ApiEndpoints";
import { eSignQueryKeys } from "./utils/QueryKeys";

export interface EnvelopeLimitationResponse {
  remainingCount: number;
  allocatedCount: number;
  limitedReached: boolean;
}

export const useGetEnvelopeLimitation = () => {
  return useQuery({
    queryKey: eSignQueryKeys.getEnvelopeLimitation,
    queryFn: async (): Promise<EnvelopeLimitationResponse> => {
      const response = await authFetch.get(
        eSignEndpoints.GET_ENVELOPE_LIMITATION
      );
      return response.data.results[0];
    }
  });
};
