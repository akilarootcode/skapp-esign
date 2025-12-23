import { ContactUserTypes } from "~community/sign/enums/ContactEnums";

export interface ContactDataType {
  addressBookId: number;
  userId: number;
  email: string;
  userType: ContactUserTypes;
  firstName: string;
  lastName: string;
  authPic: string;
  phone: string;
}

export interface ContactDataParamsTypes {
  sortKey?: string;
  sortOrder?: string;
  searchKeyword?: string;
  userType?: string;
  size: number;
}

export interface ContactDataResponse {
  pages: any;
  items: ContactDataType[];
  totalPages?: number;
  currentPage?: number;
}

export interface ContactFormValues {
  name?: string;
  email?: string;
  contactNo?: string;
  countryCode?: string;
}
