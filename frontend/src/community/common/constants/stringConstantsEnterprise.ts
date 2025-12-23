export enum characterLengths {
  ORGANIZATION_NAME_LENGTH = 100,
  ACCOUNT_URL_LENGTH = 50,
  RECIPIENT_NAME_MAX_CHARACTER_LENGTH = 100,
  PHONE_NUMBER_LENGTH_MAX = 15,
  PHONE_NUMBER_LENGTH_MIN = 7
}

export const MAX_FILE_SIZE_OF_FILE_FOR_ESIGN = {
  inBytes: 25 * 1024 * 1024,
  inReadableSize: "25MB"
};

export const ESIGN_SIGNATURE_MAX_FILE_SIZE = {
  inBytes: 500 * 1024,
  inReadableSize: "500KB"
};

export const MAX_ALLOWED_FILE_SIZE_SUPPORT_REQUEST = {
  inBytes: 10 * 1024 * 1024,
  inReadableSize: "10MB"
};

export const SKAPP_CONTACT_US_LINK = "https://skapp.com/contact";

export const SESSION_UPDATE_DELAY = 2000;

export const COMPANY_DOMAIN_MAX_LENGTH = 20;

export const MAX_ALLOWED_UPLOADS = 5;

export const MAX_ALLOWED_CHARACTERS_IN_ISSUE_DETAILS = 1000;
