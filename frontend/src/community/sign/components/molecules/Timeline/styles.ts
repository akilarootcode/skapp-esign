import { Box, Paper, Typography, styled } from "@mui/material";

import { theme } from "~community/common/theme/theme";

export const TimelineContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  flex: 1,
  backgroundColor: theme.palette.grey[50],
  padding: "1.5rem 1rem",
  borderRadius: "0.75rem",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    display: "none"
  }
}));

export const TimelineHeader = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: "1.25rem",
  marginBottom: "1.5rem"
}));

export const TimelineItemContent = styled(Box)({
  display: "flex",
  flexDirection: "column"
});

export const TimelineItemTitle = styled(Typography)({
  fontWeight: "normal",
  fontSize: "0.875rem"
});

export const TimelineItemTimestamp = styled(Typography)(() => ({
  fontSize: "0.75rem",
  display: "flex",
  alignItems: "center",
  marginTop: "0.25rem",
  gap: "0.5rem"
}));

export const TimelineLine = styled(Box)(() => ({
  position: "absolute",
  width: 0,
  height: "2.25rem",
  borderLeft: `0.125rem dashed ${theme.palette.primary.dark}`,
  margin: "0.625rem auto 0",
  marginTop: "3.5rem",
  "&::before, &::after": {
    content: '""',
    position: "absolute",
    width: "0.25rem",
    height: "0.25rem",
    backgroundColor: theme.palette.primary.dark,
    transform: "rotate(45deg)",
    left: "-0.1875rem"
  },
  "&::before": {
    top: "-0.3125rem"
  },
  "&::after": {
    bottom: "-0.3125rem"
  }
}));

export const IconWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  justifyItems: "center",
  width: "1.5rem",
  height: "1.5rem",
  paddingTop: "2rem"
}));

export const TimelineRow = styled(Box)({
  display: "flex",
  marginBottom: "0.25rem",
  width: "100%"
});

export const IconColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "1.5rem",
  flexShrink: 0,
  marginRight: "0.75rem",
  position: "relative"
});

export const TimelineItemWrapper = styled(Paper)(() => ({
  padding: "0.75rem 1rem",
  marginBottom: "0.5rem",
  display: "flex",
  flexDirection: "column",
  border: `0.0625rem solid ${theme.palette.grey.A200}`,
  borderRadius: "0.5rem",
  flex: 1,
  width: "100%",
  boxShadow: "none",
  backgroundColor: theme.palette.text.whiteText
}));
