import { useTheme } from "@mui/material/styles";
import * as pdfjsLib from "pdfjs-dist";
import React, {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";

import { DocumentFieldsIdentifiers } from "../enums/CommonDocumentsEnums";
import { useESignStore } from "../store/signStore";
import {
  DraggedField,
  ESignFieldColorCodesType,
  SignatureFieldData,
  SignatureFieldStatus
} from "../types/ESignFormTypes";
import {
  getFieldDimensions,
  getLocalizedFieldLabel
} from "../utils/dragAndDropUtils";

export const useDragAndDrop = (
  pdfDocument: pdfjsLib.PDFDocumentProxy | null,
  scale: number,
  setSignatureFields: (fields: SignatureFieldData[]) => void,
  signatureIdCounter: number,
  setSignatureIdCounter: Dispatch<SetStateAction<number>>,
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  pageRefs: MutableRefObject<(HTMLDivElement | null)[]>,
  setSelectedFieldId: Dispatch<SetStateAction<number | null>>
) => {
  const theme = useTheme();
  const translateText = useTranslator(
    "eSignatureModule",
    "create.defineField.fields"
  );

  const [draggedField, setDraggedField] = useState<DraggedField>({
    fieldId: null,
    isExisting: false,
    fieldType: null,
    tempUserID: ""
  });
  const { signatureFields, selectedRecipient } = useESignStore();

  const ghostDivRef = useRef<HTMLDivElement | null>(null);
  const activeFieldRef = useRef<HTMLElement | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const getPageFromY = useCallback(
    (clientY: number): { page: number; pageElement: HTMLElement } | null => {
      if (!scrollContainerRef.current) return null;

      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageElement = pageRefs.current[i];
        if (!pageElement) continue;

        const rect = pageElement.getBoundingClientRect();
        if (clientY >= rect.top && clientY <= rect.bottom) {
          return { page: i + 1, pageElement };
        }
      }
      return null;
    },
    [scrollContainerRef, pageRefs]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      document.querySelectorAll(".signature-field").forEach((field) => {
        (field as HTMLElement).style.opacity = "1";
      });

      const pageInfo = getPageFromY(e.clientY);
      if (!pageInfo || !pdfDocument) return;

      const { page, pageElement } = pageInfo;
      const canvas = pageElement.querySelector("canvas");
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();

      const pdfPage = await pdfDocument.getPage(page);
      const viewport = pdfPage.getViewport({ scale: 1.0 });

      const { fieldWidth, fieldHeight } = getFieldDimensions(
        draggedField.fieldType as DocumentFieldsIdentifiers
      );

      const pdfX = (e.clientX - canvasRect.left) / scale - fieldWidth / 2;
      const pdfY = (e.clientY - canvasRect.top) / scale - fieldHeight / 2;

      const boundedX = Math.max(0, Math.min(pdfX, viewport.width - fieldWidth));
      const boundedY = Math.max(
        0,
        Math.min(pdfY, viewport.height - fieldHeight)
      );

      if (draggedField.isExisting && draggedField.fieldId !== null) {
        const signatures = signatureFields.map((field) =>
          field.id === draggedField.fieldId
            ? {
                ...field,
                page,
                x: boundedX,
                y: boundedY
              }
            : { ...field }
        );
        setSignatureFields(signatures);

        setSelectedFieldId(draggedField.fieldId);
      } else if (draggedField.fieldType) {
        const newId = signatureIdCounter;
        const newSignatureField: SignatureFieldData = {
          id: newId,
          page,
          x: boundedX,
          y: boundedY,
          width: fieldWidth,
          height: fieldHeight,
          fieldType: draggedField.fieldType,
          fieldStatus: SignatureFieldStatus.EMPTY,
          colorCodes:
            draggedField?.colorCodes || theme.palette.recipientsColors[0],
          userId: draggedField?.selectedUser ?? "",
          recipient: selectedRecipient
        };

        setSignatureFields([...signatureFields, newSignatureField]);
        setSignatureIdCounter((prev) => prev + 1);
        setSelectedFieldId(newId);

        if (draggedField.setFocusOnField) {
          setTimeout(() => {
            const addedField = document.querySelector(
              `[data-field-id="${newId}"]`
            );
            if (addedField instanceof HTMLElement) {
              addedField.focus();
            }
          }, 100);
        }
      }

      setDraggedField({ fieldId: null, isExisting: false, fieldType: null });

      activeFieldRef.current = null;
    },
    [
      draggedField,
      pdfDocument,
      scale,
      setSignatureFields,
      signatureFields,
      signatureIdCounter,
      setSignatureIdCounter,
      setSelectedFieldId,
      getPageFromY,
      theme.palette.recipientsColors
    ]
  );

  const handleFieldDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, field: SignatureFieldData) => {
      e.stopPropagation();
      if (!e.dataTransfer) return;

      setDraggedField({
        fieldId: field.id,
        isExisting: true,
        fieldType: field.fieldType
      });
      setSelectedFieldId(field.id);

      const originalElement = e.currentTarget;
      if (!originalElement) return;

      activeFieldRef.current = originalElement;

      try {
        if (ghostDivRef.current && ghostDivRef.current.parentElement) {
          document.body.removeChild(ghostDivRef.current);
        }

        ghostDivRef.current = document.createElement("div");
        const ghostDiv = ghostDivRef.current;

        ghostDiv.style.width = `${(field.width / 16) * scale}rem`;
        ghostDiv.style.height = `${(field.height / 16) * scale}rem`;
        ghostDiv.style.backgroundColor = field.colorCodes.background;
        ghostDiv.style.border = `0.09375rem dotted ${field.colorCodes.border}`;
        ghostDiv.style.display = "flex";
        ghostDiv.style.alignItems = "center";
        ghostDiv.style.justifyContent = "center";
        ghostDiv.style.padding = "0.25rem";
        ghostDiv.style.borderRadius = "0.25rem";
        ghostDiv.style.position = "absolute";

        ghostDiv.innerHTML = "";

        const innerContainer = document.createElement("div");
        innerContainer.style.display = "flex";
        innerContainer.style.alignItems = "center";
        innerContainer.style.justifyContent = "center";
        innerContainer.style.width = "100%";

        if (
          field.fieldType === DocumentFieldsIdentifiers.STAMP ||
          field.fieldType === DocumentFieldsIdentifiers.INITIAL
        ) {
          innerContainer.style.flexDirection = "column";
          innerContainer.style.gap = "0.5rem";
        } else {
          innerContainer.style.flexDirection = "row";
          innerContainer.style.gap = "0.5rem";
        }

        const originalIcon = originalElement.querySelector("svg");
        if (originalIcon) {
          const iconClone = originalIcon.cloneNode(true) as SVGElement;
          const width =
            originalIcon.getAttribute("width") || originalIcon.style.width;
          const height =
            originalIcon.getAttribute("height") || originalIcon.style.height;

          iconClone.style.width = width;
          iconClone.style.height = height;
          innerContainer.appendChild(iconClone);
        }

        const label = document.createElement("div");
        label.style.color = field.colorCodes.border;
        label.style.fontSize = "0.75rem";
        label.style.fontFamily = "Poppins, sans-serif";
        label.style.fontWeight = "400";
        label.textContent = getLocalizedFieldLabel(
          field.fieldType,
          translateText
        );
        innerContainer.appendChild(label);

        ghostDiv.appendChild(innerContainer);
        document.body.appendChild(ghostDiv);

        e.dataTransfer.effectAllowed = "move";

        // Calculate centered position based on scale
        const centerX = (field.width * scale) / 2;
        const centerY = (field.height * scale) / 2;

        e.dataTransfer.setDragImage(ghostDiv, centerX, centerY);

        originalElement.style.opacity = "0";
        originalElement.classList.add("signature-field");

        const handleDragEnd = () => {
          if (activeFieldRef.current) {
            activeFieldRef.current.style.opacity = "1";
            activeFieldRef.current.classList.remove("signature-field");
          }

          if (ghostDivRef.current && ghostDivRef.current.parentElement) {
            document.body.removeChild(ghostDivRef.current);
            ghostDivRef.current = null;
          }

          window.removeEventListener("dragend", handleDragEnd);
        };

        window.addEventListener("dragend", handleDragEnd);
      } catch {
        if (activeFieldRef.current) {
          activeFieldRef.current.style.opacity = "1";
          activeFieldRef.current.classList.remove("signature-field");
        }

        if (ghostDivRef.current && ghostDivRef.current.parentElement) {
          document.body.removeChild(ghostDivRef.current);
          ghostDivRef.current = null;
        }
      }
    },
    [scale, translateText]
  );
  const createGhostElement = useCallback(
    (
      fieldType: DocumentFieldsIdentifiers,
      colorCodes: ESignFieldColorCodesType,
      fieldWidth: number,
      fieldHeight: number
    ) => {
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.top = "-9999px";
      tempContainer.style.left = "-9999px";
      document.body.appendChild(tempContainer);

      const fieldElement = document.createElement("div");
      fieldElement.style.width = `${fieldWidth * scale}px`;
      fieldElement.style.height = `${fieldHeight * scale}px`;
      fieldElement.style.backgroundColor = colorCodes.background;
      fieldElement.style.border = `1.5px solid ${colorCodes.border}`;
      fieldElement.style.display = "flex";
      fieldElement.style.alignItems = "center";
      fieldElement.style.justifyContent = "center";
      fieldElement.style.padding = "4px";
      fieldElement.style.borderRadius = "4px";
      fieldElement.style.position = "absolute";
      fieldElement.style.boxShadow = "0px 2px 4px rgba(0, 0, 0, 0.2)";
      fieldElement.style.fontFamily = "Poppins, sans-serif";

      const innerContainer = document.createElement("div");
      innerContainer.style.display = "flex";
      innerContainer.style.alignItems = "center";
      innerContainer.style.justifyContent = "center";
      innerContainer.style.width = "100%";
      innerContainer.style.gap = "8px";

      if (
        fieldType === DocumentFieldsIdentifiers.STAMP ||
        fieldType === DocumentFieldsIdentifiers.INITIAL
      ) {
        innerContainer.style.flexDirection = "column";
        innerContainer.style.gap = "4px";
      } else {
        innerContainer.style.flexDirection = "row";
      }

      const paletteField = document.querySelector(
        `[data-field-type="${fieldType}"]`
      );
      if (paletteField) {
        const originalIcon = paletteField.querySelector("svg");
        if (originalIcon) {
          const iconClone = originalIcon.cloneNode(true) as SVGElement;
          iconClone.style.width = `${24 * scale}px`;
          iconClone.style.height = `${24 * scale}px`;

          iconClone.style.fill = colorCodes.border;
          iconClone.style.removeProperty("color");

          const nestedElements = iconClone.querySelectorAll("*");
          nestedElements.forEach((element) => {
            const svgElement = element as SVGElement;
            svgElement.style.removeProperty("color");
            svgElement.removeAttribute("color");

            // Set the fill color
            if (
              fieldType === DocumentFieldsIdentifiers.STAMP ||
              fieldType === DocumentFieldsIdentifiers.NAME
            ) {
              svgElement.style.fill = "none";
            } else {
              svgElement.style.fill = colorCodes.border;
            }
            svgElement.setAttribute("fill", colorCodes.border);

            if (
              svgElement.getAttribute("stroke") &&
              svgElement.getAttribute("stroke") !== "none"
            ) {
              svgElement.style.stroke = colorCodes.border;
              svgElement.setAttribute("stroke", colorCodes.border);
            }
          });

          innerContainer.appendChild(iconClone);
        }
      }

      // Add label
      const label = document.createElement("div");
      label.style.color = colorCodes.border;
      label.style.fontSize = `${12 * scale}px`;
      label.style.fontWeight = "500";
      label.style.whiteSpace = "nowrap";
      label.textContent = getLocalizedFieldLabel(fieldType, translateText);
      innerContainer.appendChild(label);

      fieldElement.appendChild(innerContainer);
      tempContainer.appendChild(fieldElement);

      // Clean up temporary container
      setTimeout(() => {
        if (tempContainer.parentElement) {
          document.body.removeChild(tempContainer);
        }
      }, 100);

      return fieldElement;
    },
    [scale, translateText]
  );

  const handlePaletteDragStart = useCallback(
    (
      fieldType: DocumentFieldsIdentifiers,
      selectedUser: string,
      colorCodes: ESignFieldColorCodesType,
      tempUserID: string,
      setFocusOnField?: boolean
    ) => {
      try {
        if (ghostDivRef.current && ghostDivRef.current.parentElement) {
          document.body.removeChild(ghostDivRef.current);
        }

        const { fieldWidth, fieldHeight } = getFieldDimensions(fieldType);

        ghostDivRef.current = createGhostElement(
          fieldType,
          colorCodes,
          fieldWidth,
          fieldHeight
        );

        document.body.appendChild(ghostDivRef.current);

        const event = window.event as DragEvent;
        if (event && event.dataTransfer) {
          event.dataTransfer.effectAllowed = "move";

          const centerX = (fieldWidth * scale) / 2;
          const centerY = (fieldHeight * scale) / 2;

          event.dataTransfer.setDragImage(
            ghostDivRef.current,
            centerX,
            centerY
          );
        }

        const handleDragEnd = () => {
          if (ghostDivRef.current && ghostDivRef.current.parentElement) {
            document.body.removeChild(ghostDivRef.current);
            ghostDivRef.current = null;
          }
          window.removeEventListener("dragend", handleDragEnd);
        };

        window.addEventListener("dragend", handleDragEnd);
      } catch (error) {
        console.error("Error creating drag image:", error);
        if (ghostDivRef.current && ghostDivRef.current.parentElement) {
          document.body.removeChild(ghostDivRef.current);
          ghostDivRef.current = null;
        }
      }

      setDraggedField({
        fieldId: null,
        isExisting: false,
        fieldType: fieldType,
        selectedUser,
        colorCodes,
        tempUserID,
        setFocusOnField
      });

      setSelectedFieldId(null);
    },
    [
      scale,
      translateText,
      setDraggedField,
      setSelectedFieldId,
      createGhostElement
    ]
  );

  useEffect(() => {
    return () => {
      if (ghostDivRef.current && ghostDivRef.current.parentElement) {
        document.body.removeChild(ghostDivRef.current);
        ghostDivRef.current = null;
      }

      const cleanupDragEnd = () => {
        if (activeFieldRef.current) {
          activeFieldRef.current.style.opacity = "1";
          activeFieldRef.current.classList.remove("signature-field");
        }
      };

      window.removeEventListener("dragend", cleanupDragEnd);
    };
  }, []);

  return {
    handleDragOver,
    handleDrop,
    handleFieldDragStart,
    handlePaletteDragStart
  };
};
