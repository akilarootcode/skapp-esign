import { Theme } from "@mui/material";

export const Styles = (theme: Theme) => ({
  filterContainer: {
    display: "flex",
    alignItems: "center",
    marginLeft: "0.5rem"
  },
  filterButton: {
    width: "3.25rem",
    height: "3rem",
    backgroundColor: theme.palette.grey[100],
    border: `0.0625rem solid ${theme.palette.grey[500]}`
  },

  filterChip: {
    width: "4.375rem",
    height: "3rem",
    gap: "0.25rem",
    marginRight: "0.5rem",
    borderRadius: "2.1875rem",
    padding: "0.5rem 1.75rem",
    backgroundColor: theme.palette.grey[100],
    border: `0.0625rem solid ${theme.palette.grey[500]}`
  },

  filterPopover: {
    width: "22rem",
    borderRadius: "0.75rem",
    padding: "0.75rem"
  },

  filterPopoverHeader: {
    marginBottom: "0.25rem"
  },

  filterOptionsList: {
    padding: "0.5rem 0",
    maxHeight: "18.75rem",
    overflowY: "auto",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "0.75rem"
  },

  divider: {
    mx: "0.5rem"
  },

  filterPopoverFooter: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "0.75rem",
    gap: "0.5rem"
  },
  filterButtonOption: {
    width: "auto",
    height: "2.3125rem",
    padding: "0.5rem 0.75rem"
  }
});
