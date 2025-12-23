import { useEffect } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { StatusOption } from "~community/sign/components/molecules/EnvelopeTableStatusFilter/EnvelopeTableStatusFilter";
import {
  EnvelopeStatus,
  TableType
} from "~community/sign/types/ESignInboxTypes";

import { EXPIRY_THRESHOLD_DAYS, MS_IN_A_DAY } from "../constants";
import { useESignStore } from "../store/signStore";

interface UsePreserveFiltersProps {
  type: TableType;
}

export const IsExpiringSoon = (expiresOn: string): boolean => {
  const today = new Date(new Date().toISOString());
  const expirationDate = new Date(expiresOn);

  if (isNaN(expirationDate.getTime())) {
    return false;
  }

  const timeDiff = expirationDate.getTime() - today.getTime();
  const daysDiff = timeDiff / MS_IN_A_DAY;

  return daysDiff > 0 && daysDiff <= EXPIRY_THRESHOLD_DAYS;
};

export const GetStatusText = (status: string) => {
  const translateText = useTranslator("eSignatureModule", "inbox");

  switch (status) {
    case EnvelopeStatus.COMPLETED:
      return translateText(["documentStatus.completed"]);
    case EnvelopeStatus.NEED_TO_SIGN:
      return translateText(["documentStatus.needToSign"]);
    case EnvelopeStatus.WAITING:
      return translateText(["documentStatus.waitingForOthers"]);
    case EnvelopeStatus.DECLINED:
      return translateText(["documentStatus.declined"]);
    case EnvelopeStatus.VOID:
      return translateText(["documentStatus.voided"]);
    default:
      return "";
  }
};

export const usePreserveFilters = ({ type }: UsePreserveFiltersProps) => {
  const {
    preserveInboxFilters,
    preserveSentFilters,
    setPreserveInboxFilters,
    setPreserveSentFilters,
    resetInboxDataParams,
    resetSentDataParams
  } = useESignStore();

  // Map the filter type to the appropriate state and actions
  const preserveFiltersMap = {
    [TableType.INBOX]: {
      preserve: preserveInboxFilters,
      setPreserve: setPreserveInboxFilters,
      reset: resetInboxDataParams
    },
    [TableType.SENT]: {
      preserve: preserveSentFilters,
      setPreserve: setPreserveSentFilters,
      reset: resetSentDataParams
    }
  };

  const { preserve, setPreserve, reset } = preserveFiltersMap[type];

  useEffect(() => {
    if (!preserve) {
      reset();
    } else {
      setPreserve(false);
    }
  }, []);

  return {
    setPreserveFilters: setPreserve
  };
};

export const getActiveFiltersAnnouncement = (
  appliedStatuses: EnvelopeStatus[],
  statusOptions: StatusOption[],
  translateAria: (keys: string[], params?: Record<string, unknown>) => string
) => {
  if (appliedStatuses.length === 0) {
    return translateAria(["envelopeTableStatusFilter.noActiveFilters"]);
  }

  const activeLabels = appliedStatuses
    .map(
      (statusId) =>
        statusOptions.find((option) => option.id === statusId)?.label
    )
    .filter(Boolean)
    .join(", ");

  return translateAria(["envelopeTableStatusFilter.activeFiltersContext"], {
    filters: activeLabels
  });
};

export const getFilterButtonDescription = (
  appliedStatuses: EnvelopeStatus[],
  statusOptions: StatusOption[],
  translateAria: (keys: string[], params?: Record<string, unknown>) => string
) => {
  if (appliedStatuses.length > 0) {
    const activeLabels = appliedStatuses
      .map(
        (statusId) =>
          statusOptions.find((option) => option.id === statusId)?.label
      )
      .filter(Boolean)
      .join(", ");

    return translateAria(
      ["envelopeTableStatusFilter.filterButtonWithFilters"],
      { filters: activeLabels }
    );
  }

  return translateAria(["envelopeTableStatusFilter.filterButtonNoFilters"]);
};

export const getPopoverDescription = (
  tempSelectedStatuses: EnvelopeStatus[],
  statusOptions: StatusOption[],
  translateAria: (keys: string[], params?: Record<string, unknown>) => string
) => {
  if (tempSelectedStatuses.length === 0) {
    return translateAria([
      "envelopeTableStatusFilter.selectOptionsInstructions"
    ]);
  }

  const selectedLabels = tempSelectedStatuses
    .map(
      (statusId) =>
        statusOptions.find((option) => option.id === statusId)?.label
    )
    .filter(Boolean)
    .join(", ");

  return translateAria(["envelopeTableStatusFilter.selectedFilters"], {
    filters: selectedLabels
  });
};

export const getResetButtonAriaLabel = (
  isButtonDisabled: boolean,
  tempSelectedStatuses: EnvelopeStatus[],
  translateAria: (keys: string[], params?: Record<string, unknown>) => string
) => {
  if (isButtonDisabled) {
    return translateAria(["envelopeTableStatusFilter.resetButtonDisabled"]);
  }

  const count = tempSelectedStatuses.length;
  const key =
    count === 1
      ? "envelopeTableStatusFilter.resetButtonEnabled"
      : "envelopeTableStatusFilter.resetButtonEnabledPlural";

  return translateAria([key], { count });
};

export const getApplyButtonAriaLabel = (
  isButtonDisabled: boolean,
  tempSelectedStatuses: EnvelopeStatus[],
  translateAria: (keys: string[], params?: Record<string, unknown>) => string
) => {
  if (isButtonDisabled) {
    return translateAria(["envelopeTableStatusFilter.applyButtonDisabled"]);
  }

  const count = tempSelectedStatuses.length;
  const key =
    count === 1
      ? "envelopeTableStatusFilter.applyButtonEnabled"
      : "envelopeTableStatusFilter.applyButtonEnabledPlural";

  return translateAria([key], { count });
};
