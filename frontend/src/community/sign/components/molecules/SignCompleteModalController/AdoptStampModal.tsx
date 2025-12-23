import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ErrorCode } from "react-dropzone";

import Button from "~community/common/components/atoms/Button/Button";
import DragAndDropField from "~community/common/components/molecules/DragAndDropField/DragAndDropField";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  FileRejectionType,
  FileUploadType
} from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { SignatureData } from "~community/sign/constants";
import {
  DocumentFieldsIdentifiers,
  DocumentSignModalTypes
} from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";

interface AdoptStampModalProps {
  onSubmit: (signature: SignatureData) => void;
}

const AdoptStampModal: React.FC<AdoptStampModalProps> = ({ onSubmit }) => {
  const translateText = useTranslator("eSignatureModule", "sign");

  const [attachments, setAttachments] = useState<FileUploadType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    setSigningCompleteModalOpen,
    setStampToUpload,
    signatureFields,
    setSignatureFields,
    setDisplayStamp
  } = useESignStore();

  const [currentStamp, setCurrentStamp] = useState<SignatureData | null>(null);

  // When attachments change, create a new stamp data object
  useEffect(() => {
    if (attachments.length > 0 && attachments[0].path) {
      const stampData: SignatureData = {
        type: "image",
        value: attachments[0].path,
        file: attachments[0].file
      };

      setCurrentStamp(stampData);

      setDisplayStamp(stampData.value);
    } else {
      setCurrentStamp(null);
    }
  }, [attachments, setDisplayStamp]);

  const handleUpload = async () => {
    setIsLoading(true);

    if (attachments[0] && currentStamp) {
      try {
        // Update all stamp fields with the new stamp
        if (Array.isArray(signatureFields) && signatureFields.length > 0) {
          const updatedFields = signatureFields.map((field) => {
            if (field.type === DocumentFieldsIdentifiers.STAMP) {
              return {
                ...field,
                signature: currentStamp.value,
                signatureType: currentStamp.type
              };
            }
            return field;
          });

          setSignatureFields(updatedFields);
        }

        setStampToUpload(currentStamp);
        setDisplayStamp(currentStamp);
        onSubmit(currentStamp);
      } catch {
        return null;
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileErrors = (errors: FileRejectionType[]) => {
    if (!errors || errors.length === 0) return;

    const error = errors?.[0]?.errors?.[0]?.code;

    switch (error) {
      case ErrorCode.FileInvalidType:
        setErrorMessage(
          translateText(["modals.content.adoptSign.fileTypeError"])
        );
        break;
      case ErrorCode.FileTooLarge:
        setErrorMessage(
          translateText(["modals.content.adoptSign.fileSizeError"])
        );
        break;
      default:
        setErrorMessage("");
    }
  };

  const handleClear = () => {
    setAttachments([]);
    setErrorMessage("");
    setCurrentStamp(null);
  };

  return (
    <Box>
      {attachments.length === 0 ? (
        <DragAndDropField
          setAttachmentErrors={handleFileErrors}
          setAttachments={(attachments: FileUploadType[]) =>
            setAttachments(attachments)
          }
          accept={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": []
          }}
          uploadableFiles={attachments}
          maxFileSize={1}
          supportedFiles={".jpg .png"}
          customError={errorMessage}
        />
      ) : (
        <Stack
          sx={{
            height: "13.375rem",
            width: "100%",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: ".5rem",
            position: "relative",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Stack
            sx={{
              backgroundColor: "white",
              padding: ".5rem 1.2188rem",
              width: "max-content",
              borderRadius: "3.125rem",
              alignItems: "center",
              position: "absolute",
              right: 10,
              top: 10,
              cursor: "pointer"
            }}
            onClick={handleClear}
          >
            <Typography variant="caption">
              {translateText(["clear"])}
            </Typography>
          </Stack>

          {attachments[0]?.path && (
            <Image
              src={attachments[0].path}
              alt={translateText(["uploadStampAltText"])}
              width={200}
              height={200}
              style={{
                maxWidth: "50%",
                maxHeight: "90%",
                objectFit: "contain",
                borderRadius: "0.5rem"
              }}
            />
          )}
        </Stack>
      )}

      <Stack
        gap={1}
        sx={{
          marginTop: "1rem"
        }}
      >
        <Button
          label={translateText(["add"])}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.RIGHT_ARROW_ICON}
          disabled={attachments.length === 0 || isLoading}
          onClick={handleUpload}
          isLoading={isLoading}
        />
        <Button
          label={translateText(["cancel"])}
          buttonStyle={ButtonStyle.TERTIARY}
          endIcon={IconName.CLOSE_ICON}
          onClick={() =>
            setSigningCompleteModalOpen(DocumentSignModalTypes.NONE)
          }
          disabled={isLoading}
        />
      </Stack>
    </Box>
  );
};

export default AdoptStampModal;
