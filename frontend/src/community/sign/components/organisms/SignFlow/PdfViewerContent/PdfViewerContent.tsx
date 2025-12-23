import { Box, Stack } from "@mui/material";
import React from "react";

import {
  MediaQueries,
  useMediaQuery
} from "~community/common/hooks/useMediaQuery";
import { useTranslator } from "~community/common/hooks/useTranslator";
import PdfThumbnail from "~community/sign/components/molecules/PdfThumbnail/PdfThumbnail";
import SignatureFieldRenderer from "~community/sign/components/molecules/SignatureFieldRenderer/SignatureFieldRenderer";
import PdfPage from "~community/sign/components/organisms/CreateDocumentFlow/DefineFieldsSection/PdfPage";
import { useESignStore } from "~community/sign/store/signStore";
import { SignatureFieldData } from "~community/sign/types/ESignFormTypes";
import { handleScrollKeyboard } from "~community/sign/utils/keyboardEventUtils";

interface PdfViewerContentProps {
  pdfDocument: any;
  numPages: number;
  zoomLevel: number;
  showThumbnails: boolean;
  currentPage: number;
  canvasRefs: React.MutableRefObject<(HTMLCanvasElement | null)[]>;
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  getPageDimensions: (pageNumber: number) => { width: number; height: number };
  onThumbnailClick: (pageNumber: number) => void;
  onFieldClick: (field: SignatureFieldData) => void;
  isModalOpen: boolean;
  highlightedPage?: number | null;
}

const PdfViewerContent: React.FC<PdfViewerContentProps> = ({
  pdfDocument,
  numPages,
  zoomLevel,
  showThumbnails,
  currentPage,
  canvasRefs,
  pageRefs,
  scrollContainerRef,
  getPageDimensions,
  onThumbnailClick,
  onFieldClick,
  isModalOpen,
  highlightedPage
}) => {
  const queryMatches = useMediaQuery();
  const isBelow900 = queryMatches(MediaQueries.BELOW_900);
  const translateAria = useTranslator("eSignatureModuleAria", "components");

  const { documentInfo, signatureFields } = useESignStore();

  const renderPageSignatureFields = (pageNumber: number) => {
    if (isModalOpen && !documentInfo?.recipientResponseDto?.consent) {
      return null;
    }

    return signatureFields
      ?.filter((field) => field.page === pageNumber)
      .map((field) => (
        <SignatureFieldRenderer
          key={field.id}
          field={field}
          zoomLevel={zoomLevel}
          onClick={onFieldClick}
        />
      ));
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        gap: "1.5rem",
        minHeight: 0
      }}
      role="application"
      aria-label={translateAria(["pdfViewer", "documentApplication"])}
    >
      {!isBelow900 && showThumbnails && (
        <PdfThumbnail
          pdfDocument={pdfDocument}
          onThumbnailClick={onThumbnailClick}
          currentPage={currentPage}
          styles={{
            borderBottomLeftRadius: "0rem",
            borderBottomRightRadius: "0rem"
          }}
        />
      )}
      <Box
        ref={scrollContainerRef}
        tabIndex={0}
        role="document"
        aria-label={translateAria(["pdfViewer", "documentViewerArea"])}
        onKeyDown={(e) => {
          const scrollContainer = scrollContainerRef.current;
          if (!scrollContainer) return;
          handleScrollKeyboard(e, scrollContainer);
        }}
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          bgcolor: "grey.50",
          border: "0.063rem solid",
          borderColor: "grey.300",
          borderRadius: "0.75rem",
          p: "1rem",
          minHeight: 0,
          height: "100%",
          "&:focus": {
            outline: "0.125rem solid",
            outlineColor: "primary.main"
          }
        }}
      >
        <Stack
          spacing={4}
          alignItems="center"
          role="region"
          aria-label={translateAria(["pdfViewer", "pagesContainer"])}
        >
          {numPages &&
            Array.from({ length: numPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <PdfPage
                  key={index}
                  index={index}
                  pageRef={(el) => {
                    pageRefs.current[index] = el;
                  }}
                  canvasRef={(el) => {
                    canvasRefs.current[index] = el;
                  }}
                  dimensions={getPageDimensions(pageNumber)}
                  isHighlighted={highlightedPage === pageNumber}
                >
                  {renderPageSignatureFields(pageNumber)}
                </PdfPage>
              );
            })}
        </Stack>
      </Box>
    </Box>
  );
};

export default PdfViewerContent;
