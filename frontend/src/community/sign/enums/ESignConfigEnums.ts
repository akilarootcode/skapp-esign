export enum DateFormatEnum {
  YYYY_MM_DD = "YYYY_MM_DD",
  MM_DD_YYYY = "MM_DD_YYYY",
  DD_MM_YYYY = "DD_MM_YYYY"
}

export const dateFormatOptions = [
  { label: "YYYY/MM/DD", value: DateFormatEnum.YYYY_MM_DD },
  { label: "MM/DD/YYYY", value: DateFormatEnum.MM_DD_YYYY },
  { label: "DD/MM/YYYY", value: DateFormatEnum.DD_MM_YYYY }
];
