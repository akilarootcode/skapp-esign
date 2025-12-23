"use client";

import { Box, Stack, Typography, useTheme } from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.mjs";
import pdfjsPackage from "pdfjs-dist/package.json";
import React, { useEffect, useRef, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useESignStore } from "~community/sign/store/signStore";

// Set the PDF.js worker source to offload PDF processing to a Web Worker,
// preventing UI blocking and ensuring smooth rendering.
const pdfjsVersion = pdfjsPackage.version;
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`;

type FilePreviewModalProps = {
  isOpen: boolean;
  file: string;
  onClose: () => void;
  onUpload: () => void;
  isLoading: boolean;
  modalTitle: string;
};

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  file,
  onClose,
  onUpload,
  isLoading,
  modalTitle
}) => {
  const theme = useTheme();
  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.uploadDoc"
  );
  const { setToastMessage } = useToast();

  const [numPages, setNumPages] = useState<number>(0);
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);

  const { setAttachments } = useESignStore();

  useEffect(() => {
    if (!file) return;

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(file);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        setPdf(pdf);
      } catch (error) {
        console.error("Failed to load PDF:", error);
        setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["errorLoadingPdf"]),
          open: true
        });
      }
    };

    loadPdf();
  }, [file]);

  useEffect(() => {
    if (!pdf || numPages === 0) return;

    const renderPages = async () => {
      for (let i = 0; i < numPages; i++) {
        try {
          const page = await pdf.getPage(i + 1);
          const scale = 1.0;
          const viewport = page.getViewport({ scale });

          if (!canvasRefs.current[i]) continue;

          const canvas = canvasRefs.current[i]!;
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = { canvasContext: context, viewport };
          await page.render(renderContext).promise;
        } catch (error) {
          console.error(`Error rendering page ${i + 1}:`, error);
          setToastMessage({
            toastType: ToastType.ERROR,
            title: translateText(["errorLoadingPdf"]),
            open: true
          });
        }
      }
    };

    renderPages();
  }, [pdf, numPages]);

  return (
    <Modal
      isModalOpen={isOpen}
      title={modalTitle}
      isDividerVisible
      isClosable={false}
      onCloseModal={onClose}
      aria-labelledby={translateText(["modalAriaLabel"])}
      aria-describedby={translateText(["modalAriaDescription"])}
      modalContentStyles={{
        width: "max-content !important",
        maxWidth: "90vw !important",
        minWidth: "41.75rem"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            overflow: "auto",
            maxHeight: "70vh",
            p: 3,
            backgroundColor: theme.palette.grey[100],
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {numPages > 0 ? (
            Array.from({ length: numPages }).map((_, index) => (
              <canvas
                key={`page_${index + 1}`}
                ref={(el) => (canvasRefs.current[index] = el)}
                style={{ marginBottom: "10px", border: "1px solid #ccc" }}
              />
            ))
          ) : (
            <Typography>{translateText(["loadingPdf"])}</Typography>
          )}
        </Box>
        <Stack
          mt={2}
          sx={{
            flexDirection: "row",
            gap: 2,
            justifyContent: "flex-end",
            maxWidth: "40%",
            marginLeft: "auto"
          }}
        >
          <Button
            label={translateText(["cancel"])}
            buttonStyle={ButtonStyle.TERTIARY}
            endIcon={IconName.CLOSE_ICON}
            onClick={() => {
              setAttachments([]);
              onClose();
            }}
          />
          <Button
            label={translateText(["upload"])}
            onClick={onUpload}
            isLoading={isLoading}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default FilePreviewModal;
