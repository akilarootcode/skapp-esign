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
    "&:focus": {
      outline: `0.063rem solid ${theme.palette.primary.dark}`,
      border: `0.125rem solid ${theme.palette.text.whiteText}`
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }),

  dropdownItemContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%"
  },

  dropdownItemText: (font: string): SxProps => ({
    fontFamily: font,
    fontSize: "1rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }),

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
    signature: { font: string; color: string },
    fontsLoaded: boolean
  ): SxProps => ({
    fontFamily: signature.font,
    color: signature.color,
    fontSize: "1.5rem",
    textAlign: "center",
    width: "100%",
    visibility: fontsLoaded ? "visible" : "hidden",
    // Allow wrapping for long text:
    wordWrap: "break-word",
    overflowWrap: "break-word",
    lineHeight: 1.2,
    maxHeight: "100%",
    overflow: "hidden"
  }),

  rowStack: {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
    mb: "1rem",
    justifyContent: "start",
    alignItems: "end"
  },

  dropdownBox: {
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
});
