import { Theme } from "@mui/material";

export const useStyles = (theme: Theme) => ({
  container: {
    backgroundColor: theme.palette.grey[50],
    border: `0.0625rem solid ${theme.palette.grey[200]}`,
    width: "35rem",
    borderRadius: "0.75rem",
    padding: "1rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%"
  },
  signingOrderItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.grey[50],
    borderRadius: "0.5rem"
  },
  indexBox: {
    width: "3.063rem",
    height: "3.625rem",
    border: `0.063rem solid ${theme.palette.grey[200]}`,
    borderRadius: "0.25rem",
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  emailBox: {
    width: "28.813rem",
    height: "3.625rem",
    border: `0.063rem solid ${theme.palette.grey[200]}`,
    borderRadius: "0.25rem",
    backgroundColor: theme.palette.common.white,
    display: "flex",
    alignItems: "center",
    padding: "0.5rem"
  },
  colorCircle: (color: string) => ({
    width: "1rem",
    height: "1rem",
    borderRadius: "50%",
    bgcolor: color,
    marginRight: "0.5rem"
  }),
  reminderSection: {
    marginTop: "1.5rem"
  },
  reminderStack: {
    direction: "row",
    gap: "1.5rem",
    marginTop: "1.5rem"
  }
});
