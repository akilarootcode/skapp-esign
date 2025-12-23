import { Box, Stack } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import {
  DEFAULT_SIGNATURE,
  FONT_COLORS,
  FONT_STYLES,
  SignatureData
} from "~community/sign/constants";
import { DocumentSignModalTypes } from "~community/sign/enums/CommonDocumentsEnums";
import { SignatureTabType } from "~community/sign/enums/CommonEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { prepareSignatureForUpload } from "~community/sign/utils/signatureUtils";

import { DrawSignature } from "../DrawSignature/DrawSignature";
import { SignatureTabs } from "../SignatureTabs/SignatureTabs";
import { TypeSignature } from "../TypeSignature/TypeSignature";
import { UploadSignature } from "../UploadSignature/UploadSignature";

interface SignatureCaptureProps {
  onComplete: (signature: SignatureData) => void;
  disabled?: boolean;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  onComplete,
  disabled = false
}) => {
  const translateText = useTranslator("eSignatureModule", "sign");

  const [activeTab, setActiveTab] = useState<SignatureTabType>(
    SignatureTabType.TYPE
  );

  const [typedSignature, setTypedSignature] = useState({
    name: "",
    font: FONT_STYLES[0].value,
    color: FONT_COLORS[0].value
  });

  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(
    null
  );
  const [isSignButtonEnabled, setIsSignButtonEnabled] = useState(false);
  const [currentSignature, setCurrentSignature] = useState<SignatureData>({
    ...DEFAULT_SIGNATURE
  });
  const [isUploading, setIsUploading] = useState(false);

  const {
    setSigningCompleteModalOpen,
    setSignatureToUpload,
    documentId,
    recipientId,
    setDisplaySignature
  } = useESignStore();

  const updateCurrentSignature = useCallback(() => {
    let signature: SignatureData = { ...DEFAULT_SIGNATURE };

    switch (activeTab) {
      case SignatureTabType.TYPE:
        signature = {
          value: typedSignature.name,
          type: "text",
          style: {
            font: typedSignature.font,
            color: typedSignature.color
          }
        };
        break;
      case SignatureTabType.DRAW:
        signature = {
          value: drawnSignature || "",
          type: "image"
        };
        break;
      case SignatureTabType.UPLOAD:
        signature = {
          value: uploadedSignature || "",
          type: "image"
        };
        break;
    }
    setDisplaySignature(signature.value);
    setCurrentSignature(signature);
  }, [
    activeTab,
    typedSignature,
    drawnSignature,
    uploadedSignature,
    setDisplaySignature
  ]);

  useEffect(() => {
    updateCurrentSignature();
    const isEnabled = (() => {
      switch (activeTab) {
        case SignatureTabType.TYPE:
          return !!typedSignature.name && typedSignature.name.trim().length > 0;
        case SignatureTabType.DRAW:
          return !!drawnSignature;
        case SignatureTabType.UPLOAD:
          return !!uploadedSignature;
        default:
          return false;
      }
    })();

    setIsSignButtonEnabled(isEnabled);
  }, [
    typedSignature,
    drawnSignature,
    uploadedSignature,
    activeTab,
    updateCurrentSignature
  ]);

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: SignatureTabType
  ) => {
    setActiveTab(newValue);
  };

  const handleConfirm = async () => {
    if (!isSignButtonEnabled) return;

    try {
      setIsUploading(true);

      const signatureToUpload = await prepareSignatureForUpload(
        activeTab,
        currentSignature,
        uploadedSignature,
        documentId ?? 0,
        recipientId
      );

      setSignatureToUpload(signatureToUpload);
      setDisplaySignature(currentSignature);
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

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case SignatureTabType.TYPE:
        return (
          <TypeSignature
            signature={typedSignature}
            onChange={setTypedSignature}
          />
        );
      case SignatureTabType.DRAW:
        return (
          <DrawSignature
            signature={drawnSignature}
            onSignatureChange={setDrawnSignature}
          />
        );
      case SignatureTabType.UPLOAD:
        return (
          <UploadSignature
            signature={uploadedSignature}
            onSignatureChange={setUploadedSignature}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SignatureTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <Box>{renderActiveTabContent()}</Box>
      <Stack spacing={1} direction="column">
        <Button
          label={translateText(["sign"])}
          onClick={handleConfirm}
          endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
          disabled={disabled || !isSignButtonEnabled || isUploading}
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

export default SignatureCapture;
