import { SxProps, Theme } from "@mui/material";

export const Styles = (theme: Theme): Record<string, SxProps<Theme>> => ({
  card: {
    display: "flex",
    width: "29.938rem",
    height: "5.863rem",
    borderRadius: "0.75rem",
    gap: "1.5rem",
    padding: "0.75rem",
    background: theme.palette.grey[50],
    border: `0.063rem solid ${theme.palette.grey[200]}`,
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  iconContainer: {
    width: "3.563rem",
    height: "3.563rem",
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "0.75rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  createSignatureLabel: {
    color: theme.palette.text.neutral
  }
});
