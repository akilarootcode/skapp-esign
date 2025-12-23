import { Box, Paper, Stack, SxProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PDFDocumentProxy } from "pdfjs-dist";
import React, { useEffect, useRef, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";
import useScrollVisibility from "~community/sign/hooks/useScrollVisibility";
import {
  handleActivationKeyDownWithData,
  handleListNavigation
} from "~community/sign/utils/keyboardEventUtils";

export interface PdfThumbnailProps {
  pdfDocument: PDFDocumentProxy | null;
  onThumbnailClick: (pageNumber: number) => void;
  currentPage: number;
  styles?: SxProps;
}

const ThumbnailContainer = styled(Paper)(({ theme }) => ({
  width: "12.5rem",
  height: "100%",
  padding: "1.6875rem 2rem",
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: "0.75rem",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  backgroundColor: theme.palette.grey[50]
}));

const ThumbnailItem = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "active"
})<{ active?: boolean }>(({ theme, active }) => ({
  cursor: "pointer",
  position: "relative",
  margin: "0.25rem 0.5rem",
  transition: "all 0.2s ease",
  border: active ? `0.125rem solid ${theme.palette.primary.main}` : "none",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    borderColor: theme.palette.primary.light
  },
  "&:focus-visible": {
    outline: `0.125rem solid ${theme.palette.primary.main}`
  }
}));

const PageNumber = styled(Typography)(({ theme }) => ({
  position: "absolute",
  bottom: "-1.5rem",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "0.75rem",
  color: theme.palette.text.primary
}));

const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  pdfDocument,
  onThumbnailClick,
  currentPage,
  styles
}) => {
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "pdfThumbnail"
  );
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollVisibility(thumbnailContainerRef);

  useEffect(() => {
    const generateThumbnails = async () => {
      if (!pdfDocument) return;

      const thumbnails: string[] = [];
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale: 0.15 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport })
            .promise;
        }
        thumbnails.push(canvas.toDataURL());
      }
      setPageThumbnails(thumbnails);
    };

    generateThumbnails();
  }, [pdfDocument]);
  const handleKeyDown = (event: React.KeyboardEvent, pageNumber: number) => {
    handleActivationKeyDownWithData(event, onThumbnailClick, pageNumber);
  };
  const handleContainerKeyDown = (event: React.KeyboardEvent) => {
    handleListNavigation(event, thumbnailContainerRef);
  };
  return (
    <Box
      role="navigation"
      aria-label={translateAria(["navigation"])}
      tabIndex={0}
      onKeyDown={handleContainerKeyDown}
      sx={{
        "&:focus": {
          outline: `0.125rem solid`,
          outlineColor: theme.palette.primary.main
        }
      }}
    >
      <ThumbnailContainer
        elevation={0}
        sx={{
          ...styles,
          "&::-webkit-scrollbar": {
            display: isScrolling ? "block" : "none"
          }
        }}
        ref={thumbnailContainerRef}
      >
        <Stack spacing={4} sx={{ py: 2 }}>
          {pageThumbnails.map((thumbnail, index) => (
            <Box key={index} sx={{ position: "relative", mb: 2 }}>
              <ThumbnailItem
                active={currentPage === index + 1}
                elevation={0}
                onClick={() => onThumbnailClick(index + 1)}
                onKeyDown={(event) => handleKeyDown(event, index + 1)}
                tabIndex={0}
                role="button"
                aria-label={translateAria(["pageButton"], {
                  pageNumber: index + 1
                })}
                aria-pressed={currentPage === index + 1}
              >
                <Box sx={{ p: 1 }}>
                  <img
                    src={thumbnail}
                    alt={`Page ${index + 1}`}
                    style={{
                      width: "100%",
                      display: "block"
                    }}
                  />
                </Box>
              </ThumbnailItem>
              <PageNumber variant="caption">{index + 1}</PageNumber>
            </Box>
          ))}
        </Stack>
      </ThumbnailContainer>
    </Box>
  );
};

export default PdfThumbnail;
