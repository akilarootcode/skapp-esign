import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import KebabMenu from "~community/common/components/molecules/KebabMenu/KebabMenu";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import PdfTopBar from "~community/sign/components/molecules/PdfTopBar/PdfTopBar";
import SignCompleteModalController from "~community/sign/components/molecules/SignCompleteModalController/SignCompleteModalController";
import {
  DocumentSignModalTypes,
  DocumentUserPrivilege,
  EnvelopeStatus
} from "~community/sign/enums/CommonDocumentsEnums";
import { useConsentModal } from "~community/sign/hooks/useConsentModal";
import { useInitializeFields } from "~community/sign/hooks/useInitializeFields";
import { usePdfSignatureHandlers } from "~community/sign/hooks/usePdfSignatureHandlers";
import { useRenderPages } from "~community/sign/hooks/useRenderPages";
import { useS3PdfDocument } from "~community/sign/hooks/useS3PdfDocument";
import { useESignStore } from "~community/sign/store/signStore";
import { useSignatureFieldsUpdater } from "~community/sign/utils/signatureFieldsUpdater";

import ConsentModalWithOverlay from "../ConsentModalWithOverlay/ConsentModalWithOverlay";
import PdfViewerContent from "../PdfViewerContent/PdfViewerContent";

interface PdfViewerWithSignatureProps {
  isInternalUser?: boolean;
}

const PdfViewerWithSignature = ({
  isInternalUser
}: PdfViewerWithSignatureProps) => {
  const translateText = useTranslator("eSignatureModule", "sign");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "pdfViewer"
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const pageSummaryAnnounced = useRef<boolean>(false);

  const {
    signatureFields,
    documentInfo,
    setSignatureFields,
    displaySignature,
    displayInitials,
    displayStamp,
    userType,
    setSigningCompleteModalOpen
  } = useESignStore();

  const { documentPath } = useInitializeFields();

  const {
    isModalOpen,
    documentInfo: consentDocumentInfo,
    handleCloseModal,
    handleStartSign
  } = useConsentModal(isInternalUser);

  const {
    zoomLevel,
    showThumbnails,
    currentPage,
    scrollContainerRef,
    pageRefs,
    handleFieldClick,
    handleToggleFullscreen,
    handleZoomIn,
    handleZoomOut,
    handleDownload,
    handleToggleThumbnails,
    handleThumbnailClick
  } = usePdfSignatureHandlers(documentPath, isInternalUser);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen]);

  const { pdfDocument, numPages, isLoading } = useS3PdfDocument(
    documentInfo.documentPath || ""
  );

  const { canvasRefs, renderAllPages, getPageDimensions, cleanup } =
    useRenderPages(pdfDocument, zoomLevel);

  useEffect(() => {
    if (pdfDocument) {
      renderAllPages();
    }
    return () => {
      cleanup();
    };
  }, [pdfDocument, renderAllPages, cleanup]);

  useSignatureFieldsUpdater(
    displaySignature,
    displayInitials,
    displayStamp,
    signatureFields,
    setSignatureFields
  );

  const handleContainerFocus = () => {
    if (!pageSummaryAnnounced.current && numPages) {
      const pageCountAnnouncement = document.getElementById(
        "page-count-announcement"
      );
      if (pageCountAnnouncement) {
        pageCountAnnouncement.textContent = translateAria(
          ["documentPageSummary"],
          {
            pageCount: numPages.toString()
          }
        );

        setTimeout(() => {
          if (pageCountAnnouncement) {
            pageCountAnnouncement.textContent = "";
          }
        }, 3000);
      }
      pageSummaryAnnounced.current = true;
    }
  };

  const handleDecline = () => {
    setSigningCompleteModalOpen(DocumentSignModalTypes.DECLINE);
  };

  const kebabMenuOptions = useMemo(
    () => [
      {
        id: 2,
        text: translateText(["kebabOptions.decline"]),
        onClickHandler: handleDecline,
        isDisabled: false
      },
      {
        id: 1,
        text: translateText(["kebabOptions.download"]),
        onClickHandler: () => handleDownload(undefined, documentInfo?.subject),
        isDisabled: false
      }
    ],
    []
  );

  const shouldShowKebabMenu = useCallback(() => {
    const isNotCC =
      documentInfo?.recipientResponseDto?.memberRole !==
      DocumentUserPrivilege.CC;
    const isNotCompleted = documentInfo?.status !== EnvelopeStatus.COMPLETED;
    return isNotCC && isNotCompleted;
  }, [documentInfo]);

  if (isLoading || !pdfDocument) {
    return <FullScreenLoader />;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: isModalOpen ? "hidden" : "auto"
      }}
      role="region"
      aria-label={translateAria(["documentViewer"])}
      tabIndex={0}
      onFocus={handleContainerFocus}
    >
      <div
        id="page-count-announcement"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0
        }}
      />

      <ConsentModalWithOverlay
        isModalOpen={isModalOpen}
        documentInfo={consentDocumentInfo}
        onClose={handleCloseModal}
        onStart={handleStartSign}
        userType={userType}
      />
      <PdfTopBar
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoomLevel={zoomLevel}
        onToggleFullscreen={handleToggleFullscreen}
        showFullscreenToggle={true}
        showMenuIcon
        onToggleThumbnails={handleToggleThumbnails}
        kebabMenuComponent={
          shouldShowKebabMenu() ? (
            <KebabMenu
              id="pdf-viewer-kebab-menu"
              menuItems={kebabMenuOptions}
              icon={<Icon name={IconName.MORE_ICON} />}
              customStyles={{
                menu: { zIndex: ZIndexEnums.MODAL },
                menuIcon: { transform: "rotate(90deg)" }
              }}
            />
          ) : undefined
        }
      />
      <PdfViewerContent
        pdfDocument={pdfDocument}
        numPages={numPages as number}
        zoomLevel={zoomLevel}
        showThumbnails={showThumbnails}
        currentPage={currentPage}
        canvasRefs={canvasRefs}
        pageRefs={pageRefs}
        scrollContainerRef={scrollContainerRef}
        getPageDimensions={getPageDimensions}
        onThumbnailClick={handleThumbnailClick}
        onFieldClick={handleFieldClick}
        isModalOpen={isModalOpen}
      />
      <SignCompleteModalController isInternalUser={isInternalUser} />
    </Box>
  );
};

export default PdfViewerWithSignature;
