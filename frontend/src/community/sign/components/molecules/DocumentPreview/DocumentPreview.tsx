import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import React from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";
import { IconName } from "~community/common/types/IconTypes";
import { DocumentStatus } from "~community/sign/types/CommonEsignTypes";

interface DocumentPreviewProps {
  id: string;
  title: string;
  pageCount: number;
  icon?: React.ReactNode;
  envelopeStatus: DocumentStatus;
}

interface DocumentsProps {
  documents: DocumentPreviewProps[];
  openDocument?: (documentId: string) => void;
}

const DocumentPreview: React.FC<DocumentsProps> = ({
  documents,
  openDocument
}) => {
  const translateText = useTranslator("eSignatureModule", "sign");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "documentPreview"
  );

  const hasInvalidDocument = documents.some(
    (document) =>
      document.envelopeStatus === DocumentStatus.EXPIRED ||
      document.envelopeStatus === DocumentStatus.VOID ||
      document.envelopeStatus === DocumentStatus.DECLINED
  );

  if (hasInvalidDocument) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h3" component="h3" sx={{ mb: 2 }}>
        {translateText(["documents"])}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
        {documents.map((document) => (
          <Box
            key={document.id}
            sx={{
              width: "11.8125rem",
              position: "relative"
            }}
          >
            <Card
              variant="outlined"
              sx={{
                width: "100%",
                height: "9.3125rem",
                display: "flex",
                flexDirection: "column",
                borderRadius: "0.4rem 0.4rem 0 0",
                borderTop: `1px solid ${theme.palette.grey[200]}`,
                borderLeft: `1px solid ${theme.palette.grey[200]}`,
                borderRight: `1px solid ${theme.palette.grey[200]}`,
                borderBottom: "none",
                backgroundColor: theme.palette.grey[50]
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  height: "100%",
                  backgroundColor: theme.palette.grey[50]
                }}
              >
                <Icon name={IconName.PDF_ICON} />
              </CardContent>
            </Card>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 1rem",
                height: "3.75rem",
                bgcolor: theme.palette.grey[50],
                width: "100%",
                borderRadius: "0 0 0.3125rem 0.3125rem",
                border: `1px solid ${theme.palette.grey[200]}`,
                boxSizing: "border-box"
              }}
            >
              <Box
                sx={{
                  marginTop: "0.4375rem",
                  marginBottom: "0.4375rem",
                  overflow: "hidden"
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%"
                  }}
                >
                  {document.title}
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                >
                  {document.pageCount}
                  {document.pageCount === 1
                    ? ` ${translateText(["page"])}`
                    : ` ${translateText(["pages"])}`}
                </Typography>
              </Box>{" "}
              <IconButton
                onClick={() => openDocument && openDocument(document.id)}
                aria-label={translateAria(["openDocument"])}
              >
                <Icon name={IconName.POP_OUT_ICON} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default DocumentPreview;
