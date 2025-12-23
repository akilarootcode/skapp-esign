import { IconName } from "~community/common/types/IconTypes";

import { DateFormatEnum } from "../enums/ESignConfigEnums";

export const FONT_STYLES = [
  { label: "Dancing Script", value: '"Dancing Script", cursive' },
  { label: "Great Vibes", value: '"Great Vibes", cursive' },
  { label: "Pacifico", value: '"Pacifico", cursive' },
  { label: "Satisfy", value: '"Satisfy", cursive' },
  { label: "Tangerine", value: '"Tangerine", cursive' }
];

export const FONT_COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#1D4ED8", label: "Blue" },
  { value: "#DC2626", label: "Red" }
];

export const EXPIRATION_DAYS = 120;

export const MS_IN_A_DAY = 1000 * 3600 * 24;

export const EXPIRY_THRESHOLD_DAYS = 6;

export const ESIGN_ADD_RECIPIENTS_LIMIT = 50;

export const NEXT_ENVELOPE_PAGE_SIZE = 5;

export enum ItemsPerPage {
  Six = 6,
  Twelve = 12,
  Eighteen = 18,
  TwentyFour = 24,
  Thirty = 30
}

export const DEFAULT_SIGNATURE = {
  value: "",
  type: "text" as const
};

export interface SignatureData {
  value: string;
  type: "text" | "image";
  style?: {
    font?: string;
    color?: string;
  };
  s3Path?: string | null;
  file?: File;
}

export const STYLE_CONSTANTS = {
  TOP_OFFSET: 12,
  HEIGHT_PADDING: 10,
  CONTENT_HEIGHT_OFFSET: 12,
  DIVIDER_TOP_OFFSET: 8,
  PUBLIC_KEY_TOP_OFFSET: 14
};

export const DATE_FORMAT_MAPPINGS = {
  "YYYY/MM/DD": DateFormatEnum.YYYY_MM_DD,
  "MM/DD/YYYY": DateFormatEnum.MM_DD_YYYY,
  "DD/MM/YYYY": DateFormatEnum.DD_MM_YYYY
};
export const RECIPIENT_STATUS = {
  COMPLETED: "COMPLETED",
  NEED_TO_SIGN: "NEED_TO_SIGN",
  EMPTY: "EMPTY",
  DECLINED: "DECLINED",
  EXPIRED: "EXPIRED"
};

export const IDLE_USER_TIMEOUT = 1000 * 60 * 20; // 20 minutes in milliseconds
export const SESSION_WARNING_TIMEOUT = 1000 * 60 * 18; // 18 minutes in milliseconds (2 minutes before timeout)

export const SKAPP_INFO_FEATURES = [
  { label: "modules.leave", icon: IconName.LEAVE_MODULE_ICON },
  { label: "modules.time", icon: IconName.ATTENDANCE_MODULE_ICON },
  { label: "modules.assets", icon: IconName.ASSET_MODULE_ICON },
  { label: "modules.finance", icon: IconName.FINANCE_MODULE_ICON },
  {
    label: "modules.projectManagement",
    icon: IconName.PROJECT_MANAGEMENT_MODULE_ICON
  },
  { label: "modules.helpDesk", icon: IconName.HELP_DESK_MODULE_ICON },
  { label: "modules.people", icon: IconName.PEOPLE_MODULE_ICON },
  { label: "modules.crm", icon: IconName.CRM_MODULE_ICON }
];

export const MAX_SUMMARY_EMAIL_SUBJECT_LENGTH = 100;
export const MAX_SUMMARY_EMAIL_MESSAGE_LENGTH = 10000;

export const ESIGN_ERROR_EXTERNAL_USER_EXISTS =
  "COMMON_ERROR_USER_ALREADY_EXISTS";

export const ESIGN_ERROR_EXTERNAL_USER_EMAIL_ALREADY_EXITS =
  "ESIGN_ERROR_EXTERNAL_USER_EMAIL_ALREADY_EXITS";

export const COMMON_ERROR_UNAUTHORIZED_ACCESS =
  "COMMON_ERROR_UNAUTHORIZED_ACCESS";

export const COMMON_ERROR_USER_ALREADY_EXISTS =
  "COMMON_ERROR_USER_ALREADY_EXISTS";
export const DISPLAY_FIELD_STYLES = {
  BORDER_WIDTH_REM: 0.094,
  BORDER_RADIUS_REM: 0.375,
  LABEL_FONT_SIZE_REM: 0.625,
  LABEL_TOP_OFFSET_REM: 0.5,
  CONTENT_LEFT_PERCENT: 10,
  CONTENT_WIDTH_PERCENT: 80,
  CONTENT_TOP_REM: 0.375,
  TEXT_SIGNATURE_FONT_SIZE_REM: 1.25,
  SIGNATURE_TEXT_PADDING: 20,
  SIGNATURE_TEXT_WIDTH_RATIO: 0.8,
  SIGNATURE_FONT_SIZE_REM: 1.25,
  FIELD_WIDTH_ADJUSTMENT_FACTOR: 0.8
};

export const ICON_SIZE_MULTIPLIER = 20;
export const CALENDAR_ICON_WIDTH = 14;
export const CALENDAR_ICON_HEIGHT = 16;

export const VOID_MESSAGE_MAX_LENGTH = 255;

export const DECLINE_MESSAGE_MAX_LENGTH = 255;

export const ENVELOPE_DETAILS_HEIGHT_OFFSET = 100;
