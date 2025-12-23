import { SetType, SortOrderTypes } from "~community/common/types/CommonTypes";
import {
  GetAllInboxParams,
  SortKey
} from "~community/sign/types/ESignInboxTypes";
import { EnvelopeInboxSliceType } from "~community/sign/types/SliceTypes";

export const DEFAULT_INBOX_PARAMS: GetAllInboxParams = {
  size: 6,
  page: 0,
  searchKeyword: "",
  statusTypes: "",
  sortKey: SortKey.RECEIVED_DATE,
  sortOrder: SortOrderTypes.DESC
};

export const envelopeInboxSlice = (set: SetType<EnvelopeInboxSliceType>) => ({
  inboxDataParams: DEFAULT_INBOX_PARAMS,
  setSize: (size: number) =>
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      inboxDataParams: {
        ...state.inboxDataParams,
        size
      }
    })),
  setPage: (page: number) =>
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      inboxDataParams: {
        ...state.inboxDataParams,
        page
      }
    })),
  setSearchTerm: (searchKeyword: string) =>
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      inboxDataParams: {
        ...state.inboxDataParams,
        searchKeyword
      }
    })),
  setStatusTypes: (statusTypes: string) => {
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      inboxDataParams: {
        ...state.inboxDataParams,
        statusTypes
      }
    }));
  },

  setSortKey: (sortKey: SortKey) =>
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      inboxDataParams: {
        ...state.inboxDataParams,
        sortKey
      }
    })),
  setSortOrder: (sortOrder: SortOrderTypes) =>
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      inboxDataParams: {
        ...state.inboxDataParams,
        sortOrder
      }
    })),
  resetInboxDataParams: () =>
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      inboxDataParams: DEFAULT_INBOX_PARAMS
    })),
  preserveInboxFilters: false,
  setPreserveInboxFilters: (preserveInboxFilters: boolean) =>
    set((state: EnvelopeInboxSliceType) => ({
      ...state,
      preserveInboxFilters
    }))
});
