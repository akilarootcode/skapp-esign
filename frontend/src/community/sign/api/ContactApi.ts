import {
  UseInfiniteQueryResult,
  useInfiniteQuery
} from "@tanstack/react-query";

import authFetch from "~community/common/utils/axiosInterceptor";
import { eSignEndpoints } from "~community/sign/api/utils/ApiEndpoints";
import { eSignQueryKeys } from "~community/sign/api/utils/QueryKeys";
import { useESignStore } from "~community/sign/store/signStore";
import {
  ContactDataParamsTypes,
  ContactDataResponse
} from "~community/sign/types/contactTypes";

export const useGetContactData =
  (): UseInfiniteQueryResult<ContactDataResponse> => {
    const params: ContactDataParamsTypes = useESignStore(
      (state) => state.contactDataParams
    );

    return useInfiniteQuery({
      initialPageParam: 0,
      queryKey: eSignQueryKeys.contactDataTable(params),
      queryFn: async ({ pageParam = 0 }) => {
        const url = eSignEndpoints.GET_CONTACTS;

        const contactData = await authFetch.get(url, {
          params: {
            page: pageParam,
            ...params
          }
        });

        return contactData?.data?.results[0];
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
      }
    });
  };
