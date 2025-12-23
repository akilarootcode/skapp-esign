import { Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import {
  FONT_COLORS,
  FONT_STYLES,
  SignatureData
} from "~community/sign/constants";
import {
  DocumentFieldsIdentifiers,
  DocumentSignModalTypes
} from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { prepareInitialsForUpload } from "~community/sign/utils/signatureUtils";

import { TypeInitials } from "../TypeInitials/TypeInitials";

interface InitialCaptureProps {
  onComplete: (signature: SignatureData) => void;
  disabled?: boolean;
  fieldWidth?: number;
  fieldHeight?: number;
}

const InitialCapture: React.FC<InitialCaptureProps> = ({
  onComplete,
  disabled = false
}) => {
  const {
    setSigningCompleteModalOpen,
    setInitialsToUpload,
    documentId,
    recipientId,
    signatureFields,
    setSignatureFields,
    setDisplayInitials
  } = useESignStore();
  const translateText = useTranslator("eSignatureModule", "sign");
  const [isUploading, setIsUploading] = useState(false);

  const [typedInitials, setTypedInitials] = useState({
    name: "",
    font: FONT_STYLES[0].value,
    color: FONT_COLORS[0].value
  });

  const [currentSignature, setCurrentSignature] = useState<SignatureData>({
    value: "",
    type: "text",
    style: {
      font: FONT_STYLES[0].value,
      color: FONT_COLORS[0].value
    }
  });

  const updateCurrentSignature = useCallback(() => {
    const signature: SignatureData = {
      value: typedInitials.name,
      type: "text",
      style: {
        font: typedInitials.font,
        color: typedInitials.color
      }
    };

    setCurrentSignature(signature);
    setDisplayInitials(signature.value);
  }, [typedInitials, setDisplayInitials]);

  useEffect(() => {
    updateCurrentSignature();
  }, [typedInitials, updateCurrentSignature]);

  const handleConfirm = async () => {
    if (!typedInitials.name) return;

    try {
      setIsUploading(true);

      const initialsToUpload = await prepareInitialsForUpload(
        currentSignature,
        documentId ?? 0,
        recipientId
      );

      // Update all initial fields with the new initials
      if (Array.isArray(signatureFields) && signatureFields.length > 0) {
        const updatedFields = signatureFields.map((field) => {
          if (field.type === DocumentFieldsIdentifiers.INITIAL) {
            return {
              ...field,
              signature: currentSignature.value,
              signatureType: currentSignature.type,
              signatureStyle: currentSignature.style
            };
          }
          return field;
        });

        setSignatureFields(updatedFields);
      }

      setInitialsToUpload(initialsToUpload);
      setDisplayInitials(currentSignature);
      onComplete(currentSignature);
    } catch {
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSigningCompleteModalOpen(DocumentSignModalTypes.NONE);
  };

  return (
    <>
      <TypeInitials initials={typedInitials} onChange={setTypedInitials} />

      <Stack spacing={1} direction="column" sx={{ mt: 2 }}>
        <Button
          label={translateText(["modals.titles.initial"])}
          onClick={handleConfirm}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          disabled={disabled || !typedInitials.name || isUploading}
          isLoading={isUploading}
        />
        <Button
          label={translateText(["cancel"])}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={<Icon name={IconName.CLOSE_ICON} />}
          onClick={handleCancel}
          disabled={isUploading}
        />
      </Stack>
    </>
  );
};

export default InitialCapture;
