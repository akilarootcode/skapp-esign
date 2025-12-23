import { Box, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import React, { useCallback, useEffect, useState } from "react";

import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import PDFViewFieldContainer from "~community/sign/components/molecules/PDFViewFieldContainer/PDFViewFieldContainer";
import PdfThumbnail from "~community/sign/components/molecules/PdfThumbnail/PdfThumbnail";
import PdfTopBar from "~community/sign/components/molecules/PdfTopBar/PdfTopBar";
import { EXPIRATION_DAYS } from "~community/sign/constants";
import {
  DocumentFieldHeights,
  DocumentFieldWidths,
  DocumentFieldsIdentifiers,
  DocumentUserPrivilege
} from "~community/sign/enums/CommonDocumentsEnums";
import { useDragAndDrop } from "~community/sign/hooks/useDragAndDrop";
import { usePdfDocument } from "~community/sign/hooks/usePdfDocument";
import { usePdfViewerControls } from "~community/sign/hooks/usePdfViewerControls";
import { useRenderPages } from "~community/sign/hooks/useRenderPages";
import { useScroll } from "~community/sign/hooks/useScroll";
import { useESignStore } from "~community/sign/store/signStore";
import {
  ESignFieldColorCodesType,
  SignatureFieldData,
  SignatureFieldStatus
} from "~community/sign/types/ESignFormTypes";

import PdfViewerCore from "./PdfViewerCore";

interface Props {
  onNext: () => void;
  handleBack: () => void;
}

const PdfViewer = ({ onNext, handleBack }: Props) => {
  const translateText = useTranslator("eSignatureModule", "create.defineField");
  const translateAria = useTranslator("eSignatureModuleAria", "components");
  const theme = useTheme();
  const {
    uploadedFileUrl,
    recipients,
    signatureFields,
    signatureIdCounter,
    setSignatureFields,
    addSignatureField,
    removeSignatureField,
    incrementSignatureIdCounter,
    expirationDate,
    setExpirationDate,
    selectedRecipient
  } = useESignStore();

  const { setToastMessage } = useToast();

  const filteredSignatureFields = signatureFields.filter(
    (field) => field.colorCodes
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);

  const {
    zoomLevel,
    showThumbnails,
    handleZoomIn,
    handleZoomOut,
    handleToggleThumbnails
  } = usePdfViewerControls();

  const { pdfDocument, numPages } = usePdfDocument(uploadedFileUrl || "");
  const { canvasRefs, renderAllPages, getPageDimensions, cleanup } =
    useRenderPages(pdfDocument, zoomLevel);
  const { scrollContainerRef, pageRefs, scrollToPage } = useScroll(
    currentPage,
    setCurrentPage
  );
  const {
    handleDragOver,
    handleDrop,
    handleFieldDragStart,
    handlePaletteDragStart
  } = useDragAndDrop(
    pdfDocument,
    zoomLevel,
    setSignatureFields,
    signatureIdCounter,
    incrementSignatureIdCounter,
    scrollContainerRef,
    pageRefs,
    setSelectedFieldId
  );

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  useEffect(() => {
    if (pdfDocument) {
      renderAllPages();
      scrollToPage(currentPage);
    }
  }, [currentPage, pdfDocument, zoomLevel, scrollToPage]);

  const handleThumbnailClick = useCallback(
    (pageNumber: number) => {
      setCurrentPage(pageNumber);
      if (pageRefs.current[pageNumber - 1]) {
        const pageElement = pageRefs.current[pageNumber - 1];
        if (!pageElement || !scrollContainerRef.current) return;
        const scrollTop = pageElement.offsetTop;
        scrollContainerRef.current.scrollTo({
          top: scrollTop,
          behavior: "smooth"
        });
      }
    },
    [scrollContainerRef, pageRefs]
  );

  const handlePaletteClick = async (
    fieldType: DocumentFieldsIdentifiers,
    selectedUser: string,
    colorCodes: ESignFieldColorCodesType,
    tempUserID: string
  ) => {
    if (!pdfDocument || !scrollContainerRef.current) return;
    const pdfPage = await pdfDocument.getPage(currentPage);
    const viewport = pdfPage.getViewport({ scale: zoomLevel });
    const pageWidth = viewport.width / zoomLevel;
    const pageHeight = viewport.height / zoomLevel;
    const fieldWidth =
      fieldType === DocumentFieldsIdentifiers.SIGN
        ? DocumentFieldWidths.SIGN
        : fieldType === DocumentFieldsIdentifiers.INITIAL ||
            fieldType === DocumentFieldsIdentifiers.STAMP
          ? DocumentFieldWidths.INITIAL_AND_STAMP
          : DocumentFieldWidths.OTHER;
    const fieldHeight =
      fieldType === DocumentFieldsIdentifiers.SIGN
        ? DocumentFieldHeights.SIGN
        : fieldType === DocumentFieldsIdentifiers.INITIAL ||
            fieldType === DocumentFieldsIdentifiers.STAMP
          ? DocumentFieldHeights.INITIAL_AND_STAMP
          : DocumentFieldHeights.OTHER;
    const centerX = (pageWidth - fieldWidth) / 2;
    const centerY = (pageHeight - fieldHeight) / 2;
    const newSignatureField: SignatureFieldData = {
      id: signatureIdCounter,
      page: currentPage,
      x: centerX,
      y: centerY,
      width: fieldWidth,
      height: fieldHeight,
      fieldType: fieldType,
      fieldStatus: SignatureFieldStatus.EMPTY,
      userId: selectedUser,
      tempUserID: tempUserID,
      colorCodes,
      recipient: selectedRecipient
    };

    addSignatureField(newSignatureField);
    incrementSignatureIdCounter();
    scrollToPage(currentPage);
  };

  const handleDeleteField = (e: React.MouseEvent, fieldId: number) => {
    e.stopPropagation();
    removeSignatureField(fieldId);
  };

  const validateFieldAssignments = () => {
    const userIdsWithSignatureFields = signatureFields.map((field) =>
      Number(field.userId)
    );

    const assignedRecipients = new Set(userIdsWithSignatureFields);

    const unassignedRecipients = recipients.filter((recipient) => {
      if (!recipient.addressBookId) {
        return false;
      }

      return (
        recipient.userPrivileges === DocumentUserPrivilege.SIGNER &&
        !assignedRecipients.has(recipient.addressBookId)
      );
    });

    const unassignedRecipientsNames = unassignedRecipients.map(
      (recipient) => recipient?.firstName + " " + recipient?.lastName
    );

    return unassignedRecipientsNames;
  };

  const handleNext = () => {
    const unassignedRecipients = validateFieldAssignments();

    if (unassignedRecipients.length > 0) {
      const recipientNames = unassignedRecipients.join(", ");
      setToastMessage({
        toastType: ToastType.WARN,
        title: translateText(["unAssignUserFieldError"]),
        description: translateText(["unAssignUserFieldErrorDescription"], {
          recipientNames: recipientNames
        }),
        open: true
      });
    } else {
      if (!expirationDate) {
        setExpirationDate(
          DateTime.now().plus({ days: EXPIRATION_DAYS }).toISODate() || ""
        );
      }
      onNext();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickInsideSignatureField = target.closest(".signature-field");

      if (!isClickInsideSignatureField) {
        setSelectedFieldId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedFieldId]);

  const handleUpdatePosition = useCallback(
    (fieldId: number, x: number, y: number, page?: number) => {
      const updatedFields = signatureFields.map((field) => {
        if (field.id === fieldId) {
          let updatedField = {
            ...field,
            x,
            y
          };

          if (page !== undefined && page !== field.page) {
            updatedField = {
              ...updatedField,
              page
            };
          }

          return updatedField;
        }
        return field;
      });

      setSignatureFields(updatedFields);
    },
    [signatureFields, setSignatureFields]
  );

  const renderPdfViewerContent = () => {
    return (
      <Box
        sx={{
          display: "flex",
          height: "120vh",
          width: "100%",
          paddingRight: "2px",
          gap: "1.5rem"
        }}
        role="application"
        aria-label={translateAria(["pdfViewer", "documentApplication"])}
      >
        {showThumbnails && (
          <PdfThumbnail
            pdfDocument={pdfDocument}
            onThumbnailClick={handleThumbnailClick}
            currentPage={currentPage}
            styles={{
              borderBottomLeftRadius: "0rem",
              borderBottomRightRadius: "0rem"
            }}
          />
        )}
        <PdfViewerCore
          pdfDocument={pdfDocument}
          numPages={numPages}
          zoomLevel={zoomLevel}
          currentPage={currentPage}
          signatureFields={filteredSignatureFields}
          canvasRefs={canvasRefs}
          pageRefs={pageRefs}
          scrollContainerRef={scrollContainerRef}
          getPageDimensions={getPageDimensions}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleFieldDragStart={handleFieldDragStart}
          selectedFieldId={selectedFieldId}
          setSelectedFieldId={setSelectedFieldId}
          onDeleteField={handleDeleteField}
          onUpdatePosition={handleUpdatePosition}
          styles={{
            flex: 1,
            height: "100%",
            borderRadius: "0.75rem",
            border: `0.063rem solid ${theme.palette.grey[300]}`,
            bgcolor: theme.palette.grey[50]
          }}
        />
      </Box>
    );
  };

  return (
    <Box
      component="section"
      display="flex"
      flexDirection="column"
      sx={{
        position: "relative",
        marginBottom: "2rem",
        paddingBottom: "3rem"
      }}
      role="region"
      aria-label={translateAria(["pdfViewer", "documentViewer"])}
    >
      <Box component="div" display="flex" sx={{ gap: "1.5rem" }}>
        {" "}
        <Box
          component="section"
          aria-label={translateAria(["defineFieldsSection", "pdfViewerMain"])}
          sx={{
            width: "80%",
            overflow: "hidden"
          }}
        >
          <PdfTopBar
            onToggleThumbnails={handleToggleThumbnails}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            zoomLevel={zoomLevel}
            showFullscreenToggle={false}
            showMenuIcon={true}
          />
          {renderPdfViewerContent()}
        </Box>
        <PDFViewFieldContainer
          handlePaletteClick={handlePaletteClick}
          handlePaletteDragStart={handlePaletteDragStart}
          onNext={handleNext}
          handleBack={handleBack}
        />
      </Box>
    </Box>
  );
};

export default PdfViewer;
