import { Box, Stack } from "@mui/material";
import { DateTime } from "luxon";
import { ChangeEvent, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputDate from "~community/common/components/molecules/InputDate/InputDate";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { DateFormatEnum } from "~community/sign/enums/ESignConfigEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { convertToLuxonFormat } from "~community/sign/utils/commonUtils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminderDays: string, expirationDate: string) => void;
  defaultExpirationDays?: number;
  dateFormat?: DateFormatEnum;
}

const ReminderModal = ({
  isOpen,
  onClose,
  onSave,
  defaultExpirationDays,
  dateFormat
}: Props) => {
  const translateText = useTranslator("eSignatureModule", "create.reminders");
  const [selectedReminderDays, setSelectedReminderDays] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateTime | undefined>(() => {
    return DateTime.now().plus({ days: defaultExpirationDays });
  });
  const [initialReminderDays, setInitialReminderDays] = useState<string>("");
  const [initialDate, setInitialDate] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { setReminderDays, setExpirationDate, expirationDate, reminderDays } =
    useESignStore();

  const reminderFrequencyOptions = [
    { value: "1", label: translateText(["reminderFrequency.oneDay"]) },
    { value: "2", label: translateText(["reminderFrequency.twoDays"]) },
    { value: "3", label: translateText(["reminderFrequency.threeDays"]) },
    { value: "4", label: translateText(["reminderFrequency.fourDays"]) },
    { value: "5", label: translateText(["reminderFrequency.fiveDays"]) }
  ];

  const handleSave = () => {
    if (selectedDate) {
      setReminderDays(selectedReminderDays);
      setExpirationDate(selectedDate.toISODate() || "");
      onSave(selectedReminderDays, selectedDate.toISODate() || "");
      onClose();
    }
  };

  const handleDateChange = (date: string) => {
    const newDate = date ? DateTime.fromISO(date) : undefined;
    setSelectedDate(newDate);
    checkForChanges(selectedReminderDays, newDate?.toISODate() || "");
  };

  const handleReminderChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newReminderDays = e.target.value;
    setSelectedReminderDays(newReminderDays);
    checkForChanges(newReminderDays, selectedDate?.toISODate() || "");
  };

  const checkForChanges = (
    currentReminderDays: string,
    currentDate: string
  ) => {
    const reminderChanged = currentReminderDays !== initialReminderDays;
    const dateChanged = currentDate !== initialDate;
    setHasChanges(reminderChanged || dateChanged);
  };

  const handleClose = () => {
    setSelectedDate(undefined);
    setSelectedReminderDays("");
    setHasChanges(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const currentReminderDays = reminderDays || "";
      setSelectedReminderDays(currentReminderDays);
      setInitialReminderDays(currentReminderDays);

      let currentDate;
      if (expirationDate) {
        currentDate = expirationDate;
        setSelectedDate(DateTime.fromISO(expirationDate));
      } else {
        const defaultDate = DateTime.now().plus({
          days: defaultExpirationDays
        });
        currentDate = defaultDate.toISODate() || "";
        setSelectedDate(defaultDate);
      }
      setInitialDate(currentDate);
      setHasChanges(false);
    }
  }, [isOpen, defaultExpirationDays, expirationDate, reminderDays]);

  return (
    <Modal
      isModalOpen={isOpen}
      isClosable={false}
      onCloseModal={() => {}}
      title={translateText(["title"])}
      modalContentStyles={{
        width: "34.563rem"
      }}
    >
      <Box>
        <Stack spacing={2}>
          <DropdownList
            label={translateText(["reminderFrequency.label"])}
            inputName="reminderFrequency"
            tooltip={translateText(["reminderFrequency.tooltip"])}
            value={selectedReminderDays}
            onChange={handleReminderChange}
            itemList={reminderFrequencyOptions}
            placeholder={translateText(["reminderFrequency.placeholder"])}
          />

          <InputDate
            label={translateText(["expirationDate.label"])}
            tooltip={translateText(["expirationDate.tooltip"])}
            onchange={handleDateChange}
            placeholder={translateText(["expirationDate.placeholder"])}
            minDate={DateTime.now().plus({ days: 1 })}
            selectedDate={selectedDate}
            setSelectedDate={(date) => {
              setSelectedDate(date);
              checkForChanges(selectedReminderDays, date?.toISODate() || "");
            }}
            inputFormat={convertToLuxonFormat(dateFormat)}
          />

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button
              label={translateText(["buttons.save"])}
              buttonStyle={ButtonStyle.PRIMARY}
              endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
              onClick={handleSave}
              disabled={!hasChanges || !selectedDate}
            />
            <Button
              label={translateText(["buttons.cancel"])}
              buttonStyle={ButtonStyle.TERTIARY}
              endIcon={<Icon name={IconName.CLOSE_ICON} />}
              onClick={handleClose}
            />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ReminderModal;
