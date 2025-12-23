import {
  SortKeyTypes,
  SortOrderTypes
} from "~community/common/types/CommonTypes";
import { SetType } from "~community/common/types/storeTypes";
import { ContactSliceType } from "~community/sign/types/SliceTypes";

export const createContactSlice = (
  set: SetType<ContactSliceType>
): ContactSliceType => ({
  contactDataParams: {
    sortKey: SortKeyTypes.NAME,
    sortOrder: SortOrderTypes.ASC,
    searchKeyword: "",
    size: 5,
    userType: ""
  },

  contactTableFilters: {
    userType: []
  },

  contactTableSelectedFilterLabels: [],

  setContactDataParams: (
    key: string,
    value: (string | number)[] | string | boolean
  ) => {
    let types: string = "";

    if (typeof value === "string") {
      types = value;
    } else if (typeof value === "boolean") {
      types = value.toString();
    } else if (Array.isArray(value)) {
      for (const element of value) {
        const item = element?.toString();
        const type: string = item + ",";
        types = types + type;
      }
      types = types.slice(0, -1);
    }
    set((state: ContactSliceType) => ({
      ...state,
      contactDataParams: {
        ...state.contactDataParams,
        [key]: types
      }
    }));
  },

  setSearchKeyword: (value: string) => {
    set((state: ContactSliceType) => ({
      ...state,
      contactDataParams: {
        ...state.contactDataParams,
        searchKeyword: value
      }
    }));
  },

  handleContactDataSort: (key: string, value: string | boolean) => {
    set((state: ContactSliceType) => ({
      ...state,
      contactDataParams: {
        ...state.contactDataParams,
        [key]: value
      }
    }));
  },

  setContactTableFilters: (selectedFilters: Record<string, string[]>) => {
    set((state) => ({
      ...state,
      contactTableFilters: {
        ...state.contactTableFilters,
        userType: selectedFilters?.userType
      },
      contactDataParams: {
        ...state.contactDataParams,
        userType: selectedFilters?.userType
          ? selectedFilters?.userType?.toString()
          : ""
      }
    }));
  },

  setContactTableSelectedFilterLabels: (value: string[]) => {
    set((state) => ({
      ...state,
      contactTableSelectedFilterLabels: value
    }));
  },

  resetContactTableParams: () => {
    set((state) => ({
      contactTableFilters: {
        userType: [] as string[]
      },
      contactTableSelectedFilterLabels: [] as string[],
      contactDataParams: {
        ...state.contactDataParams,
        userType: ""
      }
    }));
  }
});
