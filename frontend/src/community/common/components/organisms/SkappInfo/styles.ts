import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    maxWidth: "83.125rem",
    margin: "0 auto",
    padding: "5.125rem",
    gap: "2.5rem"
  },
  leftSection: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "50%",
    gap: "2.25rem"
  },
  rightSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    gap: "2.25rem"
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "max-content",
    padding: "0.25rem 1.5rem",
    backgroundColor: theme.palette.grey[50],
    gap: "0.75rem",
    borderRadius: "5.5313rem"
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flexWrap: "wrap",
    gap: "2.5rem"
  },
  featureItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "6.25rem",
    gap: "1.25rem"
  }
});

export default styles;
