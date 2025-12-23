import Icon from "~community/common/components/atoms/Icon/Icon";
import { IconName } from "~community/common/types/IconTypes";

import {
  CALENDAR_ICON_HEIGHT,
  CALENDAR_ICON_WIDTH,
  ICON_SIZE_MULTIPLIER
} from "../constants";
import { DocumentFieldsIdentifiers } from "../enums/CommonDocumentsEnums";

export const getFieldIcon = (
  fieldType: DocumentFieldsIdentifiers,
  colorCode: string,
  zoomLevel: number
) => {
  switch (fieldType) {
    case DocumentFieldsIdentifiers.SIGN:
      return (
        <Icon
          name={IconName.SIGNATURE_ICON}
          fill={colorCode}
          width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
          height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        />
      );
    case DocumentFieldsIdentifiers.INITIAL:
      return (
        <Icon
          name={IconName.INITIALS_ICON}
          fill={colorCode}
          width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
          height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        />
      );
    case DocumentFieldsIdentifiers.DATE:
      return (
        <Icon
          name={IconName.CALENDAR_ICON}
          fill={colorCode}
          width={`${CALENDAR_ICON_WIDTH * zoomLevel}px`}
          height={`${CALENDAR_ICON_HEIGHT * zoomLevel}px`}
        />
      );
    case DocumentFieldsIdentifiers.APPROVE:
      return (
        <Icon
          name={IconName.APPROVED_ICON}
          fill={colorCode}
          width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
          height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        />
      );
    case DocumentFieldsIdentifiers.DECLINE:
      return (
        <Icon
          name={IconName.DECLINED_ICON}
          fill={colorCode}
          width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
          height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        />
      );
    case DocumentFieldsIdentifiers.STAMP:
      return (
        <Icon
          name={IconName.STAMP_ICON}
          fill={colorCode}
          width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
          height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        />
      );
    case DocumentFieldsIdentifiers.NAME:
      return (
        <Icon
          name={IconName.USER_ICON}
          fill={colorCode}
          width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
          height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        />
      );
    case DocumentFieldsIdentifiers.EMAIL:
      return (
        <Icon
          name={IconName.EMAIL_ICON}
          fill={colorCode}
          width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
          height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        />
      );
    default:
      return null;
  }
};
