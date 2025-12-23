import { Box } from "@mui/material";
import React from "react";

import { KeyboardKeys } from "~community/common/enums/KeyboardEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import ApproveField from "~community/sign/components/molecules/ApproveField/ApproveField";
import DateField from "~community/sign/components/molecules/FilledFields/DateField";
import SignatureDisplay from "~community/sign/components/organisms/SignFlow/SignatureDisplay/SignatureDisplay";
import SignaturePlaceholder from "~community/sign/components/organisms/SignFlow/SignaturePlaceholder/SignaturePlaceholder";
import { DocumentFieldsIdentifiers } from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { SignatureFieldData } from "~community/sign/types/ESignFormTypes";

import AutoFillField from "../FilledFields/AutoFillField";

interface SignatureFieldRendererProps {
  field: SignatureFieldData;
  zoomLevel: number;
  onClick: (field: SignatureFieldData) => void;
}

const SignatureFieldRenderer: React.FC<SignatureFieldRendererProps> = ({
  field,
  zoomLevel,
  onClick
}) => {
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "signatureFieldRenderer"
  );

  const fieldPosition = {
    position: "absolute",
    left: field.x * zoomLevel,
    top: field.y * zoomLevel,
    width: field.width * zoomLevel,
    height: field.height * zoomLevel,
    cursor: "pointer"
  } as const;

  const { documentInfo } = useESignStore();
  if (field.fieldType === DocumentFieldsIdentifiers.DATE) {
    return (
      <Box
        key={field.id}
        sx={fieldPosition}
        role="button"
        aria-label={translateAria(["dateField"])}
      >
        <DateField zoomLevel={zoomLevel} />
      </Box>
    );
  }

  if (field.fieldType === DocumentFieldsIdentifiers.EMAIL) {
    return (
      <Box
        key={field.id}
        sx={fieldPosition}
        role="button"
        aria-label={translateAria(["emailField"])}
      >
        <AutoFillField value={documentInfo?.email} zoomLevel={zoomLevel} />
      </Box>
    );
  }

  if (field.fieldType === DocumentFieldsIdentifiers.NAME) {
    return (
      <Box
        key={field.id}
        sx={fieldPosition}
        role="button"
        aria-label={translateAria(["nameField"])}
      >
        <AutoFillField value={documentInfo?.name} zoomLevel={zoomLevel} />
      </Box>
    );
  }
  if (field.signature) {
    if (field.fieldType === DocumentFieldsIdentifiers.APPROVE) {
      return (
        <Box
          key={field.id}
          sx={fieldPosition}
          onClick={() => onClick(field)}
          tabIndex={0}
          role="button"
          aria-label={translateAria(["approvalField"])}
          onKeyDown={(e) => {
            if (e.key === KeyboardKeys.ENTER || e.key === KeyboardKeys.SPACE) {
              e.preventDefault();
              onClick(field);
            }
          }}
        >
          <ApproveField zoomLevel={zoomLevel} />
        </Box>
      );
    }

    return (
      <SignatureDisplay
        key={field.id}
        field={field}
        zoomLevel={zoomLevel}
        onClick={() => onClick(field)}
      />
    );
  }

  return (
    <SignaturePlaceholder
      key={field.id}
      field={field}
      zoomLevel={zoomLevel}
      onClick={() => onClick(field)}
    />
  );
};

export default SignatureFieldRenderer;
