import { SxProps } from "@mui/material";

import { theme } from "~community/common/theme/theme";

export const containerStyles: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  bgcolor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: "0.75rem",
  p: "1rem",
  marginBottom: "1rem"
};

export const menuButtonStyles: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "3rem",
  height: "3rem",
  borderRadius: "1.5rem",
  cursor: "pointer"
};

export const zoomControlWrapperStyles: SxProps = {
  flex: 1,
  display: "flex",
  justifyContent: "center"
};

export const zoomButtonStyles: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: theme.palette.grey[100],
  width: "3rem",
  height: "3rem",
  borderRadius: "1.5rem",
  border: `0.063rem solid ${theme.palette.grey[200]}`,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    bgcolor: theme.palette.grey[200],
    transform: "scale(1.05)"
  }
};

export const zoomDisplayStyles: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: theme.palette.grey[100],
  width: "4.938rem",
  height: "3rem",
  borderRadius: "0.5rem",
  border: `0.063rem solid ${theme.palette.grey[200]}`
};

export const fullscreenButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: "0.5rem",
  borderRadius: "50%",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)"
  }
};
