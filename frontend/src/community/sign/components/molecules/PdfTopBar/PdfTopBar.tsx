import {
  Fullscreen as FullscreenIcon,
  Menu as MenuIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { shouldActivateButton } from "~community/common/utils/keyboardUtils";

import {
  containerStyles,
  fullscreenButtonStyles,
  menuButtonStyles,
  zoomButtonStyles,
  zoomControlWrapperStyles,
  zoomDisplayStyles
} from "./styles";

interface PdfTopBarProps {
  onToggleThumbnails?: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomLevel: number;
  onToggleFullscreen?: () => void;
  showFullscreenToggle?: boolean;
  showMenuIcon?: boolean;
  kebabMenuComponent?: React.ReactNode;
}

const PdfTopBar: React.FC<PdfTopBarProps> = ({
  onToggleThumbnails,
  onZoomIn,
  onZoomOut,
  zoomLevel,
  onToggleFullscreen,
  showFullscreenToggle = false,
  showMenuIcon = true,
  kebabMenuComponent
}) => {
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "pdfTopBar"
  );

  const handleKeyDown = (event: React.KeyboardEvent, handler: () => void) => {
    if (handler && shouldActivateButton(event.key)) {
      event.preventDefault();
      handler();
    }
  };

  return (
    <Box
      sx={containerStyles}
      role="toolbar"
      aria-label={translateAria(["toolbar"])}
      tabIndex={0}
    >
      {showMenuIcon && (
        <Box
          onClick={onToggleThumbnails}
          sx={menuButtonStyles}
          tabIndex={0}
          role="button"
          aria-label={translateAria(["toggleThumbnails"])}
          onKeyDown={(e) => handleKeyDown(e, onToggleThumbnails)}
        >
          <MenuIcon />
        </Box>
      )}

      <Box
        sx={zoomControlWrapperStyles}
        role="group"
        aria-label={translateAria(["zoomControls"])}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Box
            onClick={onZoomOut}
            sx={zoomButtonStyles}
            tabIndex={0}
            role="button"
            aria-label={translateAria(["zoomOut"])}
            onKeyDown={(e) => handleKeyDown(e, onZoomOut)}
          >
            <ZoomOutIcon />
          </Box>
          <Box sx={zoomDisplayStyles} role="status" aria-live="polite">
            <Typography variant="body2">
              {Math.round(zoomLevel * 100)}%
            </Typography>
          </Box>
          <Box
            onClick={onZoomIn}
            sx={zoomButtonStyles}
            tabIndex={0}
            role="button"
            aria-label={translateAria(["zoomIn"])}
            onKeyDown={(e) => handleKeyDown(e, onZoomIn)}
          >
            <ZoomInIcon />
          </Box>
          {showFullscreenToggle && (
            <Box
              onClick={onToggleFullscreen}
              sx={fullscreenButtonStyles}
              tabIndex={0}
              role="button"
              aria-label={translateAria(["toggleFullscreen"])}
              onKeyDown={(e) => handleKeyDown(e, onToggleFullscreen)}
            >
              <FullscreenIcon />
            </Box>
          )}
        </Stack>
      </Box>

      {kebabMenuComponent && <Box>{kebabMenuComponent}</Box>}
    </Box>
  );
};

export default PdfTopBar;
