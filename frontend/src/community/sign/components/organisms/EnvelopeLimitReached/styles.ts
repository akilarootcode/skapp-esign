import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  root: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    padding: "2rem"
  },
  contentSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "40rem",
    textAlign: "center"
  },
  title: {
    color: theme.palette.text.blackText,
    marginBottom: "1rem"
  },
  description: {
    color: theme.palette.customGrey.darkGrey,
    lineHeight: 1.5,
    marginBottom: "1rem"
  }
});

export default styles;
