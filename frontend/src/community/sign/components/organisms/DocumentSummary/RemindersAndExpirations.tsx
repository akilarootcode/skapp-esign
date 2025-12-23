import { Box, Stack } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";

import InputField from "~community/common/components/molecules/InputField/InputField";
import { useESignStore } from "~community/sign/store/signStore";

interface RemindersAndExpirationsProps {
  translateText: (
    suffixes: string[],
    interpolationValues?: Record<string, any>
  ) => string;
  styles: any;
}

const RemindersAndExpirations: React.FC<RemindersAndExpirationsProps> = ({
  translateText,
  styles
}) => {
  const { reminderDays, expirationDate } = useESignStore();

  const formattedExpirationDate = expirationDate
    ? DateTime.fromISO(expirationDate).toLocaleString(DateTime.DATE_MED)
    : "";

  return (
    <Box sx={styles.reminderSection}>
      <Stack sx={styles.reminderStack}>
        {reminderDays && (
          <InputField
            label={translateText(["reminderDays"])}
            inputName="reminderDays"
            value={reminderDays}
            isDisabled={true}
          />
        )}
        <InputField
          label={translateText(["expirationDate"])}
          inputName="expirationDate"
          value={formattedExpirationDate}
          isDisabled={true}
        />
      </Stack>
    </Box>
  );
};

export default RemindersAndExpirations;
