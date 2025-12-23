import { useRef, useState } from "react";

import {
  useSetDocumentCookies,
  useSetExternalDocumentCookies
} from "~community/sign/api/CloudFrontApi";
import {
  DocumentFieldsIdentifiers,
  DocumentSignModalTypes,
  DocumentUserPrivilege
} from "~community/sign/enums/CommonDocumentsEnums";
import { usePdfViewerControls } from "~community/sign/hooks/usePdfViewerControls";
import { useESignStore } from "~community/sign/store/signStore";
import {
  SignatureFieldData,
  SignatureFieldStatus
} from "~community/sign/types/ESignFormTypes";
import { downloadFileFromCloudFront } from "~community/sign/utils/fileHandlingUtils";

export const usePdfSignatureHandlers = (
  documentPath: string,
  isInternalUser?: boolean
) => {
  const {
    setCurrentField,
    setSigningCompleteModalOpen,
    signatureFields,
    setSignatureFields,
    displaySignature,
    displayInitials,
    displayStamp,
    documentInfo,
    signatureLink
  } = useESignStore();
  const [currentPage, setCurrentPage] = useState(1);

  const { mutateAsync: setCookiesAsync } = useSetDocumentCookies();
  const { mutateAsync: setExternalCookiesAsync } =
    useSetExternalDocumentCookies();

  const {
    zoomLevel,
    isFullscreen,
    showThumbnails,
    scrollContainerRef,
    handleZoomIn,
    handleZoomOut,
    handleToggleFullscreen,
    handleToggleThumbnails
  } = usePdfViewerControls();
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFieldClick = async (field: SignatureFieldData) => {
    if (isFullscreen) {
      return;
    }
    setCurrentField(field);
    const fieldType = field.fieldType;

    if (
      documentInfo?.recipientResponseDto.memberRole === DocumentUserPrivilege.CC
    ) {
      return;
    }

    const existingField = signatureFields.find((f) => f.id === field.id);
    const isAlreadySigned =
      existingField?.status === SignatureFieldStatus.COMPLETED;

    if (isAlreadySigned) {
      switch (fieldType) {
        case DocumentFieldsIdentifiers.INITIAL:
          setSigningCompleteModalOpen(DocumentSignModalTypes.INITIAL);
          break;
        case DocumentFieldsIdentifiers.SIGN:
          setSigningCompleteModalOpen(DocumentSignModalTypes.SIGN);
          break;
        case DocumentFieldsIdentifiers.STAMP:
          setSigningCompleteModalOpen(DocumentSignModalTypes.STAMP);
          break;
        case DocumentFieldsIdentifiers.DECLINE:
          setSigningCompleteModalOpen(DocumentSignModalTypes.DECLINE);
          break;
        default:
          setSigningCompleteModalOpen(DocumentSignModalTypes.NONE);
          break;
      }
      return;
    }

    if (fieldType === DocumentFieldsIdentifiers.SIGN && signatureLink) {
      const updatedFields = signatureFields.map((signField) =>
        signField.id === field.id
          ? {
              ...signField,
              signature: signatureLink,
              status: SignatureFieldStatus.COMPLETED
            }
          : signField
      );
      setSignatureFields(updatedFields);
      return;
    }

    // NOTE: 'displaySignature' represents the full signature object and is used directly to update the 'signatureFields' with the user's signature details.
    if (
      fieldType === DocumentFieldsIdentifiers.SIGN &&
      displaySignature?.value
    ) {
      const updatedFields = signatureFields.map((signField) =>
        signField.id === field.id
          ? {
              ...signField,
              signature: displaySignature?.value,
              signatureType: displaySignature.type,
              signatureStyle: displaySignature.style,
              status: SignatureFieldStatus.COMPLETED
            }
          : signField
      );
      setSignatureFields(updatedFields);
      return;
    }

    if (
      fieldType === DocumentFieldsIdentifiers.INITIAL &&
      displayInitials?.value
    ) {
      const updatedFields = signatureFields.map((signField) =>
        signField.id === field.id
          ? {
              ...signField,
              signature: displayInitials.value,
              signatureType: displayInitials.type,
              signatureStyle: displayInitials.style,
              status: SignatureFieldStatus.COMPLETED
            }
          : signField
      );
      setSignatureFields(updatedFields);
      return;
    }

    if (fieldType === DocumentFieldsIdentifiers.STAMP && displayStamp?.value) {
      const updatedFields = signatureFields.map((signField) =>
        signField.id === field.id
          ? {
              ...signField,
              signature: displayStamp.value,
              signatureType: displayStamp.type,
              status: SignatureFieldStatus.COMPLETED
            }
          : signField
      );
      setSignatureFields(updatedFields);
      return;
    }

    switch (field.fieldType) {
      case DocumentFieldsIdentifiers.INITIAL:
        setSigningCompleteModalOpen(DocumentSignModalTypes.INITIAL);
        break;
      case DocumentFieldsIdentifiers.SIGN:
        setSigningCompleteModalOpen(DocumentSignModalTypes.SIGN);
        break;
      case DocumentFieldsIdentifiers.STAMP:
        setSigningCompleteModalOpen(DocumentSignModalTypes.STAMP);
        break;
      case DocumentFieldsIdentifiers.DECLINE:
        setSigningCompleteModalOpen(DocumentSignModalTypes.DECLINE);
        break;
      case DocumentFieldsIdentifiers.APPROVE: {
        const updatedFields = signatureFields.map((signField) =>
          signField.id === field.id
            ? {
                ...signField,
                signature: DocumentFieldsIdentifiers.APPROVE,
                status: SignatureFieldStatus.COMPLETED
              }
            : signField
        );
        setSignatureFields(updatedFields);
        break;
      }
      default:
        setSigningCompleteModalOpen(DocumentSignModalTypes.NONE);
        break;
    }
  };

  const handleDownload = async (onSuccess?: () => void, subject?: string) => {
    if (!documentPath) return;

    try {
      const setCookies = isInternalUser
        ? setCookiesAsync
        : setExternalCookiesAsync;

      await setCookies();

      await downloadFileFromCloudFront(documentPath, subject);
      onSuccess?.();
    } catch {
      console.error("Error downloading file:");
    }
  };

  const handleThumbnailClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    if (pageRefs.current[pageNumber - 1]) {
      pageRefs.current[pageNumber - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return {
    zoomLevel,
    isFullscreen,
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
  };
};
