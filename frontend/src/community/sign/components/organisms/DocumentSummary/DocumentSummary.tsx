import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { usePdfDocument } from "~community/sign/hooks/usePdfDocument";
import { usePdfViewerControls } from "~community/sign/hooks/usePdfViewerControls";
import { useRenderPages } from "~community/sign/hooks/useRenderPages";
import { useESignStore } from "~community/sign/store/signStore";

import PdfTopBar from "../../molecules/PdfTopBar/PdfTopBar";
import PdfViewerCore from "../CreateDocumentFlow/DefineFieldsSection/PdfViewerCore";
import EmailDetails from "./EmailDetails";
import RemindersAndExpirations from "./RemindersAndExpirations";
import SigningOrder from "./SigningOrder";
import { useStyles } from "./styles";

interface DocumentSummaryProps {
  onSend: () => void;
  onBack: () => void;
  emailSubject: string;
  setEmailSubject: (value: string) => void;
  emailMessage: string;
  setEmailMessage: (value: string) => void;
  isLoading: boolean;
  emailSubjectError?: string;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  onSend,
  onBack,
  emailSubject,
  setEmailSubject,
  emailMessage,
  setEmailMessage,
  isLoading,
  emailSubjectError
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const translateText = useTranslator("eSignatureModule", "create.summary");
  const translateAria = useTranslator("eSignatureModuleAria", "components");
  const { signatureFields, uploadedFileUrl } = useESignStore();

  const { pdfDocument, numPages } = usePdfDocument(uploadedFileUrl || "");

  const {
    zoomLevel,
    scrollContainerRef,
    handleZoomIn,
    handleZoomOut,
    handleToggleFullscreen
  } = usePdfViewerControls();

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredSignatureFields = signatureFields.filter(
    (field) => field.colorCodes
  );

  const { canvasRefs, renderAllPages, getPageDimensions } = useRenderPages(
    pdfDocument,
    zoomLevel
  );

  useEffect(() => {
    if (pdfDocument) {
      renderAllPages();
    }
  }, [pdfDocument, renderAllPages]);
  return (
    <Stack direction="row" spacing={2} width="100%" paddingBottom="3rem">
      <Stack component="section" width="60%">
        <Box
          component="div"
          role="region"
          aria-label={translateAria(["documentSummary", "documentPreview"])}
          tabIndex={0}
          sx={{
            "&:focus": {
              outline: `0.125rem solid ${theme.palette.primary.main}`,
              outlineOffset: "0.125rem"
            }
          }}
        >
          <PdfTopBar
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            zoomLevel={zoomLevel}
            onToggleFullscreen={handleToggleFullscreen}
            showFullscreenToggle={true}
            showMenuIcon={false}
          />
          {pdfDocument && (
            <PdfViewerCore
              pdfDocument={pdfDocument}
              numPages={numPages}
              zoomLevel={zoomLevel}
              currentPage={1}
              signatureFields={filteredSignatureFields}
              canvasRefs={canvasRefs}
              pageRefs={pageRefs}
              scrollContainerRef={scrollContainerRef}
              getPageDimensions={getPageDimensions}
              selectedFieldId={null}
            />
          )}
        </Box>
      </Stack>
      <Stack component="aside" width="33.33%">
        {" "}
        <Box
          component="form"
          aria-label={translateAria(["documentSummary", "documentDetailsForm"])}
          sx={styles.container}
        >
          <Box component="div">
            <Stack gap="24px">
              <Typography variant="h2">
                {translateText(["documentSummary"])}
              </Typography>
              <Divider />
            </Stack>

            <EmailDetails
              emailSubject={emailSubject}
              setEmailSubject={setEmailSubject}
              emailMessage={emailMessage}
              setEmailMessage={setEmailMessage}
              emailSubjectError={emailSubjectError}
              translateText={translateText}
            />

            <SigningOrder translateText={translateText} styles={styles} />

            <RemindersAndExpirations
              translateText={translateText}
              styles={styles}
            />
          </Box>
          <Stack component="nav" gap={1} mt={2}>
            <Button
              label={translateText(["send"])}
              buttonStyle={ButtonStyle.PRIMARY}
              endIcon={IconName.SEND_ICON}
              isStrokeAvailable={true}
              onClick={onSend}
              disabled={isLoading}
            />
            <Button
              label={translateText(["back"])}
              buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
              startIcon={IconName.LEFT_ARROW_ICON}
              onClick={onBack}
              disabled={isLoading}
            />
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default DocumentSummary;
