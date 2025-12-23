import { SetType, SortOrderTypes } from "~community/common/types/CommonTypes";
import {
  GetAllSentParams,
  SortKey
} from "~community/sign/types/ESignInboxTypes";
import { EnvelopeSentSliceType } from "~community/sign/types/SliceTypes";

export const DEFAULT_SENT_PARAMS: GetAllSentParams = {
  size: 6,
  page: 0,
  searchKeyword: "",
  statusTypes: "",
  sortKey: SortKey.CREATED_DATE,
  sortOrder: SortOrderTypes.DESC
};

export const envelopeSentSlice = (set: SetType<EnvelopeSentSliceType>) => ({
  sentDataParams: DEFAULT_SENT_PARAMS,
  setSentSize: (size: number) =>
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      sentDataParams: {
        ...state.sentDataParams,
        size
      }
    })),
  setSentPage: (page: number) =>
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      sentDataParams: {
        ...state.sentDataParams,
        page
      }
    })),
  setSentSearchTerm: (searchKeyword: string) =>
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      sentDataParams: {
        ...state.sentDataParams,
        searchKeyword
      }
    })),
  setSentStatusTypes: (statusTypes: string) => {
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      sentDataParams: {
        ...state.sentDataParams,
        statusTypes
      }
    }));
  },
  setSentSortKey: (sortKey: SortKey) =>
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      sentDataParams: {
        ...state.sentDataParams,
        sortKey
      }
    })),
  setSentSortOrder: (sortOrder: SortOrderTypes) =>
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      sentDataParams: {
        ...state.sentDataParams,
        sortOrder
      }
    })),
  resetSentDataParams: () =>
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      sentDataParams: DEFAULT_SENT_PARAMS
    })),
  preserveSentFilters: false,
  setPreserveSentFilters: (preserveSentFilters: boolean) =>
    set((state: EnvelopeSentSliceType) => ({
      ...state,
      preserveSentFilters
    }))
});
