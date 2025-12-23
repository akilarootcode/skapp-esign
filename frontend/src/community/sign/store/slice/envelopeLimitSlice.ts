import { SetType } from "~community/common/types/CommonTypes";
import { EnvelopeLimitSliceType } from "~community/sign/types/SliceTypes";

export const envelopeLimitSlice = (set: SetType<EnvelopeLimitSliceType>) => ({
  showEnvelopeLimitModal: false,
  setShowEnvelopeLimitModal: (show: boolean) =>
    set({ showEnvelopeLimitModal: show })
});
