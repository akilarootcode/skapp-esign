import { Theme } from "@mui/material";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { StyleProps } from "~community/common/types/CommonTypes";

const styles = (theme: Theme): StyleProps => ({
  modal: {
    position: "relative",
    flexDirection: "column",
    justifyItems: "center",
    alignItems: "center",
    borderRadius: "1.5rem",
    background: theme.palette.background.paper,
    maxWidth: "25rem",
    maxHeight: "31.875rem",
    width: "100%",
    height: "max-content",
    overflow: "hidden",
    paddingBottom: "2.5rem"
  },
  iconWrapper: {
    zIndex: ZIndexEnums.LEVEL_2,
    position: "absolute",
    top: "1rem",
    right: "1rem"
  },
  content: {
    paddingTop: "1rem",
    flexDirection: "column",
    alignItems: "center",
    justifyItems: "center",
    width: "75%",
    gap: "1rem"
  }
});

export default styles;
