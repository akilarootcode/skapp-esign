import { SetType } from "~community/common/types/CommonTypes";
import { DATE_FORMAT } from "~community/people/utils/constants/constants";
import { ESignConfigTypes } from "~community/sign/types/CommonEsignTypes";
import { ESignConfigSliceType } from "~community/sign/types/SliceTypes";

export const eSignConfigSlice = (set: SetType<ESignConfigSliceType>) => ({
  eSignConfigs: {
    dateFormat: DATE_FORMAT.MM_DD_YYYY_SLASH,
    defaultEnvelopeExpireDays: 0,
    reminderDaysBeforeExpire: 0
  },
  setESignConfigs: (configs: ESignConfigTypes) => set({ eSignConfigs: configs })
});
