import { Stack, Typography, alpha, useTheme } from "@mui/material";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { ICON_SIZE_MULTIPLIER } from "~community/sign/constants";

interface ApproveFieldProps {
  zoomLevel: number;
}

const ApproveField = ({ zoomLevel = 1 }: ApproveFieldProps) => {
  const theme = useTheme();
  const translateText = useTranslator("eSignatureModule", "sign");
  return (
    <Stack
      direction={"row"}
      spacing={1 * zoomLevel}
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        height: "100%",
        px: `${1 * zoomLevel}rem`,
        backgroundColor: alpha(theme.palette.greens.lighter, 0.8),
        border: `${1 * zoomLevel}px solid ${theme.palette.greens.darker}`,
        borderRadius: `${0.3125 * zoomLevel}rem`
      }}
    >
      <Icon
        name={IconName.APPROVED_ICON}
        fill={theme.palette.greens.darker}
        width={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
        height={`${ICON_SIZE_MULTIPLIER * zoomLevel}px`}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: "medium",
          color: theme.palette.greens.darker,
          fontSize: `${0.75 * zoomLevel}rem`,
          textAlign: "center"
        }}
      >
        {translateText(["approved"])}
      </Typography>
    </Stack>
  );
};

export default ApproveField;
