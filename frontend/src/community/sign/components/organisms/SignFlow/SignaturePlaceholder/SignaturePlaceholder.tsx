import { Paper, Stack, Typography } from "@mui/material";
import React from "react";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { DocumentFieldsIdentifiers } from "~community/sign/enums/CommonDocumentsEnums";
import { getLocalizedFieldLabel } from "~community/sign/utils/dragAndDropUtils";
import { getFieldIcon } from "~community/sign/utils/fieldIconUtils";
import { createActivationKeyDownHandler } from "~community/sign/utils/keyboardEventUtils";

interface SignatureFieldData {
  id: number;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fieldType: string;
  colorCodes: { background: string; border: string };
  signature?: string;
}

interface SignaturePlaceholderProps {
  field: SignatureFieldData;
  zoomLevel: number;
  onClick: () => void;
}

const SignaturePlaceholder: React.FC<SignaturePlaceholderProps> = ({
  field,
  zoomLevel,
  onClick
}) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "create.defineField.fields"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "signaturePlaceholder"
  );
  const fieldLabel = getLocalizedFieldLabel(
    field.fieldType as DocumentFieldsIdentifiers,
    translateText
  );

  const handleKeyDown = createActivationKeyDownHandler(onClick);

  return (
    <Paper
      elevation={2}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={translateAria(["fieldPlaceholder"], {
        fieldType: fieldLabel
      })}
      sx={{
        position: "absolute",
        left: field.x * zoomLevel,
        top: field.y * zoomLevel,
        width: field.width * zoomLevel,
        height: field.height * zoomLevel,
        bgcolor: field.colorCodes.background,
        border: `${1.5 * zoomLevel}px solid ${field.colorCodes.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        zIndex: ZIndexEnums.LEVEL_2,
        borderRadius: `${0.375 * zoomLevel}rem`
      }}
    >
      <Stack
        direction={
          field.fieldType === DocumentFieldsIdentifiers.STAMP ||
          field.fieldType === DocumentFieldsIdentifiers.INITIAL
            ? "column"
            : "row"
        }
        spacing={1 * zoomLevel}
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "100%",
          height: "100%",
          px: `${1 * zoomLevel}rem`
        }}
      >
        {getFieldIcon(
          field.fieldType as DocumentFieldsIdentifiers,
          field.colorCodes.border,
          zoomLevel
        )}
        <Typography
          variant="caption"
          sx={{
            color: field.colorCodes.border,
            fontWeight: "medium",
            fontSize: `${0.75 * zoomLevel}rem`,
            lineHeight: 1.2,
            textAlign: "center"
          }}
        >
          {getLocalizedFieldLabel(
            field.fieldType as DocumentFieldsIdentifiers,
            translateText
          )}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default SignaturePlaceholder;
