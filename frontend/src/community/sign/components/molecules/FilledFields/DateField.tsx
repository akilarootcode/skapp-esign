import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

import { formatDateByTemplate } from "~community/common/utils/dateTimeUtils";
import { DATE_FORMAT } from "~community/people/utils/constants/constants";
import { useESignStore } from "~community/sign/store/signStore";

interface DateFieldProps {
  zoomLevel?: number;
}

const DateField = ({ zoomLevel = 1 }: DateFieldProps) => {
  const { eSignConfigs, setAutoFilledDate, autoFilledDate } = useESignStore();

  const dateFormat = eSignConfigs?.dateFormat || DATE_FORMAT.MM_DD_YYYY_SLASH;

  useEffect(() => {
    const currentDate = new Date();
    const formatted = formatDateByTemplate(currentDate, dateFormat);
    setAutoFilledDate(formatted);
  }, [dateFormat, setAutoFilledDate]);

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 107 * zoomLevel,
        height: 27 * zoomLevel,
        borderRadius: `${4 * zoomLevel}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Typography
        sx={{
          fontSize: `${0.75 * zoomLevel}rem`
        }}
      >
        {autoFilledDate}
      </Typography>
    </Box>
  );
};

export default DateField;
