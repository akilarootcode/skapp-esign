import { SetType } from "~community/common/types/CommonTypes";
import { ReminderSliceType } from "~community/sign/types/SliceTypes";

export const reminderSlice = (set: SetType<ReminderSliceType>) => ({
  reminderDays: "",
  expirationDate: "",
  setReminderDays: (days: string) =>
    set((state: ReminderSliceType) => ({
      ...state,
      reminderDays: days
    })),
  setExpirationDate: (date: string) =>
    set((state: ReminderSliceType) => ({
      ...state,
      expirationDate: date
    })),
  resetReminder: () =>
    set(() => ({
      reminderDays: "",
      expirationDate: ""
    }))
});
