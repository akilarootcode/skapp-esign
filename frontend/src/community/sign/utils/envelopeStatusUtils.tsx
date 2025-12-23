import { JSX } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { IconName } from "~community/common/types/IconTypes";

import { EnvelopeStatus } from "../types/ESignInboxTypes";

export const GetEnvelopeStatusIcon = (status: string): JSX.Element => {
  switch (status) {
    case EnvelopeStatus.NEED_TO_SIGN:
      return <Icon name={IconName.PENDING_STATUS_ICON} />;
    case EnvelopeStatus.WAITING:
      return <Icon name={IconName.WAITING_STATUS_ICON} />;
    case EnvelopeStatus.COMPLETED:
      return <Icon name={IconName.APPROVED_STATUS_ICON} />;
    case EnvelopeStatus.DECLINED:
      return <Icon name={IconName.REVOKED_STATUS_ICON} />;
    case EnvelopeStatus.VOID:
      return <Icon name={IconName.CANCELLED_STATUS_ICON} />;
    case EnvelopeStatus.VOIDED:
      return <Icon name={IconName.CANCELLED_STATUS_ICON} />;
    case EnvelopeStatus.EXPIRED:
      return <Icon name={IconName.DENIED_STATUS_ICON} />;
    default:
      return <></>;
  }
};

export const GetStatusText = (status: string) => {
  switch (status) {
    case EnvelopeStatus.COMPLETED:
      return "documentStatus.completed";
    case EnvelopeStatus.NEED_TO_SIGN:
      return "documentStatus.needToSign";
    case EnvelopeStatus.WAITING:
      return "documentStatus.waitingForOthers";
    case EnvelopeStatus.DECLINED:
      return "documentStatus.declined";
    case EnvelopeStatus.VOID:
      return "documentStatus.voided";
    case EnvelopeStatus.VOIDED:
      return "documentStatus.voided";
    case EnvelopeStatus.EXPIRED:
      return "documentStatus.expired";
    default:
      return "";
  }
};
