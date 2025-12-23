import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useESignStore } from "~community/sign/store/signStore";

interface SignConcentModalProps {
  onClose: () => void;
  onStart: () => void;
}

const InternalUserContent = ({ onClose, onStart }: SignConcentModalProps) => {
  const theme = useTheme();
  const translateText = useTranslator("eSignatureModule", "sign");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "pdfViewer"
  );

  const { documentInfo } = useESignStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  const handleStart = () => {
    if (announcerRef.current) {
      announcerRef.current.textContent = translateAria(["documentPageLoaded"]);

      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = "";
        }
      }, 3000);
    }

    onStart();

    const pdfViewerContainer = document.querySelector(
      '[aria-label="Document Viewer"]'
    );
    if (pdfViewerContainer) {
      (pdfViewerContainer as HTMLElement).focus();
    }
  };

  return (
    <>
      <div
        ref={announcerRef}
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

      <Paper
        ref={containerRef}
        elevation={3}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-title"
        sx={{
          width: "100%",
          mx: {
            xs: "2rem",
            lg: "3rem"
          },
          p: 3,
          borderRadius: 2,
          bgcolor: "white"
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }

          if (e.key === "Tab") {
            const focusableElements = containerRef.current?.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as NodeListOf<HTMLElement>;

            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Image
              src="/logo/logo.png"
              alt="Skapp Logo"
              height={64}
              width={180}
            />
          </Box>
        </Box>

        <Stack flexDirection={{ xs: "column" }} gap={2}>
          <Stack flexDirection={"column"} gap={1}>
            <Typography variant="h2" fontWeight={500} id="document-title">
              {documentInfo?.subject}
            </Typography>
            <Stack
              flexDirection={"row"}
              sx={{
                alignItems: "center"
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary
                }}
              >
                {translateText(["concentModal.from"])}&nbsp;
              </Typography>
              <Typography variant="body1">
                {documentInfo?.senderEmail}
              </Typography>
            </Stack>

            <Typography
              sx={{
                lineHeight: "1.5rem",
                fontSize: "0.9375rem",
                color: theme.palette.text.secondary
              }}
            >
              {translateText(["concentModal.description"])}
            </Typography>
          </Stack>

          <Stack
            display="flex"
            gap={2}
            sx={{
              flexDirection: "row",
              width: "100%",
              alignItems: "flex-end",
              justifyContent: "flex-end"
            }}
          >
            <Button
              label={translateText(["close"])}
              buttonStyle={ButtonStyle.TERTIARY}
              isFullWidth={false}
              size={ButtonSizes.MEDIUM}
              onClick={onClose}
            />
            <Button
              label={translateText(["start"])}
              buttonStyle={ButtonStyle.PRIMARY}
              isFullWidth={false}
              size={ButtonSizes.MEDIUM}
              onClick={handleStart}
            />
          </Stack>
        </Stack>
      </Paper>
    </>
  );
};

export default InternalUserContent;
