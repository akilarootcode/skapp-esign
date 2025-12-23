import { Theme } from "@mui/material";

import { StyleProps } from "~community/common/types/CommonTypes";

export const Styles = (theme: Theme): StyleProps => ({
  tableRow: {
    outline: `0.063rem solid ${theme.palette.grey[200]}`,
    borderRadius: "0.25rem",
    padding: "0.5rem",
    background: theme.palette.text.whiteText
  },
  tableWrapper: {
    borderCollapse: "separate",
    backgroundColor: theme.palette.background.paper,
    height: "auto"
  },
  tableActionRowWrapper: {
    backgroundColor: theme.palette.background.paper,
    maxHeight: "48.813rem"
  },
  tableContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "100%"
  },
  actionButtonsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  paginationWithNumOfRows: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper
  },
  truncatedText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
});
