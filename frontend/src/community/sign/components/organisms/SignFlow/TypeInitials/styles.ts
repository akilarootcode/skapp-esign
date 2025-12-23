import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";

export const styles = (theme: Theme) => ({
  container: {
    width: "100%"
  },

  colorContainer: {
    p: 1.25,
    backgroundColor: theme.palette.grey[100],
    borderRadius: "0.5rem",
    height: "3rem",
    alignItems: "center"
  },

  colorButton: (color: string): SxProps => ({
    width: "1.75rem",
    height: "1.75rem",
    minWidth: "1.75rem",
    minHeight: "1.75rem",
    padding: 0,
    bgcolor: color,
    "&:hover": {
      bgcolor: color,
      opacity: 0.9
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }),

  dropdownContainer: {
    width: "4.6875rem"
  },

  dropdownStyle: {
    height: "3.125rem",
    borderRadius: "4rem"
  },

  dropdownSelectStyles: {
    "& .MuiSelect-select": {
      paddingRight: "2rem !important"
    }
  },

  previewContainer: {
    height: "7.5rem",
    border: `0.0625rem solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.grey[100],
    borderRadius: "0.5rem",
    mb: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 2,
    position: "relative"
  },

  previewText: (
    initials: { font: string; color: string },
    fontsLoaded: boolean
  ): SxProps => ({
    fontFamily: initials.font,
    color: initials.color,
    fontSize: "2.25rem",
    textAlign: "center",
    width: "100%",
    visibility: fontsLoaded ? "visible" : "hidden"
  }),

  dropdownItemContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },

  dropdownItemText: (font: string): SxProps => ({
    fontFamily: font,
    fontSize: "1rem"
  })
});
