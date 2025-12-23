import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { DISPLAY_FIELD_STYLES } from "~community/sign/constants";
import { DisplayField } from "~community/sign/types/CommonEsignTypes";

export const styles = (theme: Theme) => ({
  container: (
    field: DisplayField,
    zoomLevel: number,
    shouldExpand: boolean = false,
    expandedWidth: number | null = null
  ): SxProps => ({
    position: "absolute",
    left: field.x * zoomLevel,
    top: field.y * zoomLevel,
    height: field.height * zoomLevel,
    width:
      field.signatureType === "text" && shouldExpand && expandedWidth
        ? expandedWidth * zoomLevel
        : field.width * zoomLevel,
    display: "flex",
    flexDirection: "column",
    border: `${DISPLAY_FIELD_STYLES.BORDER_WIDTH_REM * zoomLevel}rem solid ${field.colorCodes.border}`,
    borderRadius: `${DISPLAY_FIELD_STYLES.BORDER_RADIUS_REM * zoomLevel}rem`
  }),

  topBorder: {
    position: "absolute",
    top: `-${DISPLAY_FIELD_STYLES.BORDER_WIDTH_REM}rem`,
    left: "0",
    width: "100%",
    height: `${DISPLAY_FIELD_STYLES.BORDER_WIDTH_REM}rem`,
    zIndex: ZIndexEnums.LEVEL_2
  },

  leftBorderPiece: {
    position: "absolute",
    top: "0",
    left: "0",
    height: `${DISPLAY_FIELD_STYLES.BORDER_WIDTH_REM}rem`
  },

  rightBorderPiece: {
    position: "absolute",
    top: "0",
    right: "0",
    height: `${DISPLAY_FIELD_STYLES.BORDER_WIDTH_REM}rem`
  },

  labelContainer: (zoomLevel: number): SxProps => ({
    position: "absolute",
    left: "50%",
    top: `${-DISPLAY_FIELD_STYLES.LABEL_TOP_OFFSET_REM * zoomLevel}rem`,
    transform: "translateX(-50%)",
    bgcolor: theme.palette.common.white,
    padding: `0 ${0.25 * zoomLevel}rem`
  }),

  label: (zoomLevel: number): SxProps => ({
    fontSize: `${DISPLAY_FIELD_STYLES.LABEL_FONT_SIZE_REM * zoomLevel}rem`,
    color: "text.secondary",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "block",
    lineHeight: 1.2
  }),

  contentContainer: (field: DisplayField, zoomLevel: number): SxProps => ({
    position: "absolute",
    left: `${DISPLAY_FIELD_STYLES.CONTENT_LEFT_PERCENT}%`,
    top: `${DISPLAY_FIELD_STYLES.CONTENT_TOP_REM * zoomLevel}rem`,
    width: `${DISPLAY_FIELD_STYLES.CONTENT_WIDTH_PERCENT}%`,
    height: `calc(100% - ${DISPLAY_FIELD_STYLES.CONTENT_TOP_REM * 2 * zoomLevel}rem)`,
    cursor: "pointer",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }),

  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%"
  },

  textSignature: (field: DisplayField, zoomLevel: number): SxProps => ({
    fontFamily: field.signatureStyle?.font,
    color: field.signatureStyle?.color,
    fontSize: `${DISPLAY_FIELD_STYLES.TEXT_SIGNATURE_FONT_SIZE_REM * zoomLevel}rem`,
    whiteSpace: "nowrap",
    textAlign: "center",
    width: "100%",
    lineHeight: 1.2
  })
});
