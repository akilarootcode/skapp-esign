import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

export const Styles = (theme: Theme): StyleProps => ({
  envelopeCardWrapper: {
    border: "1px solid",
    borderColor: theme.palette.grey[200],
    borderRadius: "0.5rem",
    padding: "1rem",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    maxWidth: "32.125rem"
  },
  contentSection: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    flex: 1
  },
  buttonSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
