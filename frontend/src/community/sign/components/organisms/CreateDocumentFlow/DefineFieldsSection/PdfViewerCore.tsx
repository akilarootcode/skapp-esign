import { Box, Stack, SxProps, useTheme } from "@mui/material";
import { PDFDocumentProxy } from "pdfjs-dist";
import React, { useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import SignatureFieldComponent from "~community/sign/components/molecules/SignatureField/SignatureField";
import { DocumentSignModalTypes } from "~community/sign/enums/CommonDocumentsEnums";
import { SignatureFieldData } from "~community/sign/types/ESignFormTypes";
import { handleScrollKeyboard } from "~community/sign/utils/keyboardEventUtils";

import PdfPage from "./PdfPage";

const SCROLL_CONFIG = {
  BUFFER_ZONE: 300,
  SCROLL_AMOUNT: 200,
  SCROLL_THRESHOLD: 100
};

interface PdfViewerCoreProps {
  pdfDocument: PDFDocumentProxy | null;
  numPages: number | null;
  zoomLevel: number;
  currentPage: number;
  signatureFields: SignatureFieldData[];
  canvasRefs: React.MutableRefObject<(HTMLCanvasElement | null)[]>;
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  getPageDimensions?: (pageNumber: number) => { width: number; height: number };
  handleDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFieldDragStart?: (
    event: React.DragEvent<HTMLDivElement>,
    field: SignatureFieldData
  ) => void;
  selectedFieldId: number | null;
  hideSignatureFields?: boolean;
  setSelectedFieldId?: React.Dispatch<React.SetStateAction<number | null>>;
  onDeleteField?: (e: React.MouseEvent, fieldId: number) => void;
  deleteEnabled?: boolean;
  onClickField?: (field: DocumentSignModalTypes, id: number) => void;
  styles?: SxProps;
  onUpdatePosition?: (
    fieldId: number,
    x: number,
    y: number,
    page?: number
  ) => void;
  scrollToPage?: (pageNumber: number) => void;
}

const PdfViewerCore: React.FC<PdfViewerCoreProps> = ({
  numPages,
  zoomLevel,
  signatureFields,
  canvasRefs,
  pageRefs,
  scrollContainerRef,
  getPageDimensions,
  handleDragOver,
  handleDrop,
  handleFieldDragStart,
  selectedFieldId,
  scrollToPage,
  setSelectedFieldId,
  onDeleteField,
  hideSignatureFields = false,
  styles,
  onClickField,
  onUpdatePosition
}) => {
  const theme = useTheme();
  const translateAria = useTranslator("eSignatureModuleAria", "components");
  const [isFocused, setIsFocused] = useState(false);

  const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
    let parent = element.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  const handleFieldScroll = (
    scrollContainer: HTMLDivElement,
    fieldElement: Element,
    direction: "ArrowDown" | "ArrowUp" | "ArrowLeft" | "ArrowRight"
  ) => {
    const fieldRect = fieldElement.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();

    const isVerticalScroll =
      direction === "ArrowDown" || direction === "ArrowUp";
    const isPositiveDirection =
      direction === "ArrowDown" || direction === "ArrowRight";

    if (isVerticalScroll) {
      const isVisible =
        fieldRect.top < containerRect.bottom &&
        fieldRect.bottom > containerRect.top;

      const needsScroll = isPositiveDirection
        ? fieldRect.bottom > containerRect.bottom - SCROLL_CONFIG.BUFFER_ZONE ||
          !isVisible
        : fieldRect.top < containerRect.top + SCROLL_CONFIG.BUFFER_ZONE ||
          !isVisible;

      if (!needsScroll) return;

      const canScrollContainer = isPositiveDirection
        ? scrollContainer.scrollTop + scrollContainer.clientHeight <
          scrollContainer.scrollHeight
        : scrollContainer.scrollTop > 0;

      if (canScrollContainer) {
        scrollContainer.scrollBy({
          top: isPositiveDirection
            ? SCROLL_CONFIG.SCROLL_AMOUNT
            : -SCROLL_CONFIG.SCROLL_AMOUNT,
          behavior: "smooth"
        });
      } else {
        const scrollParent = findScrollableParent(scrollContainer);
        if (scrollParent) {
          scrollParent.scrollBy({
            top: isPositiveDirection
              ? SCROLL_CONFIG.SCROLL_AMOUNT
              : -SCROLL_CONFIG.SCROLL_AMOUNT,
            behavior: "smooth"
          });
        }
      }
    } else {
      const isVisible =
        fieldRect.left < containerRect.right &&
        fieldRect.right > containerRect.left;

      const needsScroll = isPositiveDirection
        ? fieldRect.right > containerRect.right - SCROLL_CONFIG.BUFFER_ZONE ||
          !isVisible
        : fieldRect.left < containerRect.left + SCROLL_CONFIG.BUFFER_ZONE ||
          !isVisible;

      if (!needsScroll) return;

      const canScrollContainer = isPositiveDirection
        ? scrollContainer.scrollLeft + scrollContainer.clientWidth <
          scrollContainer.scrollWidth
        : scrollContainer.scrollLeft > 0;

      if (canScrollContainer) {
        scrollContainer.scrollBy({
          left: isPositiveDirection
            ? SCROLL_CONFIG.SCROLL_AMOUNT
            : -SCROLL_CONFIG.SCROLL_AMOUNT,
          behavior: "smooth"
        });
      } else {
        const scrollParent = findScrollableParent(scrollContainer);
        if (scrollParent) {
          scrollParent.scrollBy({
            left: isPositiveDirection
              ? SCROLL_CONFIG.SCROLL_AMOUNT
              : -SCROLL_CONFIG.SCROLL_AMOUNT,
            behavior: "smooth"
          });
        }
      }
    }
  };

  const renderSignatureFields = (pageNumber: number) => {
    if (hideSignatureFields) return null;
    return signatureFields
      .filter((field) => field.page === pageNumber)
      .map((field) => (
        <SignatureFieldComponent
          key={field.id}
          field={field}
          zoomLevel={zoomLevel}
          onDelete={onDeleteField}
          onDragStart={handleFieldDragStart}
          isSelected={selectedFieldId === field.id}
          setSelectedFieldId={setSelectedFieldId}
          onClickField={onClickField}
          onUpdatePosition={onUpdatePosition}
          getPageDimensions={getPageDimensions}
          numPages={numPages || undefined}
          scrollToPage={scrollToPage}
        />
      ));
  };
  return (
    <Box
      ref={scrollContainerRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      tabIndex={0}
      role="document"
      aria-label={translateAria(["pdfViewer", "documentViewerCore"])}
      onKeyDown={(e) => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const isSignatureFieldSelected = selectedFieldId !== null;
        const focusedField = document.activeElement;

        if (isSignatureFieldSelected && focusedField) {
          if (
            ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)
          ) {
            e.preventDefault();
            handleFieldScroll(
              scrollContainer,
              focusedField,
              e.key as "ArrowDown" | "ArrowUp" | "ArrowLeft" | "ArrowRight"
            );
          }
        } else {
          handleScrollKeyboard(e, scrollContainer);
        }
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      sx={{
        height: "130vh",
        overflowY: "scroll",
        overflowX: "auto",
        position: "relative",
        bgcolor: theme.palette.grey[50],
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: "0.75rem",
        p: "1rem",
        margin: "0 auto",
        "&::-webkit-scrollbar": {
          display: isFocused ? "block" : "none"
        },
        "&:focus": {
          outline: `0.125rem solid ${theme.palette.primary.main}`
        },
        ...styles
      }}
    >
      <Stack spacing={4} alignItems="center">
        {numPages &&
          Array.from({ length: numPages }, (_, index) => (
            <PdfPage
              key={index}
              index={index}
              pageRef={(el) => {
                pageRefs.current[index] = el;
              }}
              canvasRef={(el) => {
                canvasRefs.current[index] = el;
              }}
              dimensions={
                getPageDimensions ? getPageDimensions(index + 1) : undefined
              }
            >
              {renderSignatureFields(index + 1)}
            </PdfPage>
          ))}
      </Stack>
    </Box>
  );
};

export default PdfViewerCore;
