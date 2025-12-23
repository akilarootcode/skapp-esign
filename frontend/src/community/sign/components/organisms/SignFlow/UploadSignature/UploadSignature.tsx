import { Box, useTheme } from "@mui/material";
import React, { useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import DragAndDropField from "~community/common/components/molecules/DragAndDropField/DragAndDropField";
import { ESIGN_SIGNATURE_MAX_FILE_SIZE } from "~community/common/constants/stringConstantsEnterprise";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { FileUploadType } from "~community/common/types/CommonTypes";

interface UploadSignatureProps {
  signature: string | null;
  onSignatureChange: (signature: string | null) => void;
  currentAppliedSignature?: string | null;
}

export const UploadSignature: React.FC<UploadSignatureProps> = ({
  signature,
  onSignatureChange,
  currentAppliedSignature
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);
  const [isCleared, setIsCleared] = useState(false);
  const theme = useTheme();

  const handleFileUpload = (files: FileUploadType[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      onSignatureChange(file.path);
      setUploadedFiles(files);
      setIsCleared(false);
    } else {
      onSignatureChange(null);
      setUploadedFiles([]);
    }
  };

  const clearUpload = () => {
    onSignatureChange(null);
    setUploadedFiles([]);
    setIsCleared(true);
  };

  const displaySignature = !isCleared
    ? signature || currentAppliedSignature
    : null;

  return (
    <Box sx={{ mb: 2 }}>
      {!displaySignature ? (
        <Box
          sx={{
            height: "max-content"
          }}
        >
          <DragAndDropField
            setAttachments={handleFileUpload}
            uploadableFiles={uploadedFiles}
            accept={{
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"]
            }}
            supportedFiles=".png .jpg"
            maxFileSize={1}
            maxSizeOfFile={ESIGN_SIGNATURE_MAX_FILE_SIZE}
            isZeroFilesErrorRequired={false}
            descriptionStyles={{ fontSize: "0.875rem" }}
            browseTextStyles={{ fontSize: "0.875rem" }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            backgroundColor: theme.palette.grey[100],
            borderRadius: 1,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "18.75rem",
              height: "9.375rem",
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img
              src={displaySignature}
              alt="Signature"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain"
              }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8
            }}
          >
            <Button
              label="Clear"
              buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
              size={ButtonSizes.SMALL}
              isFullWidth={false}
              onClick={clearUpload}
              styles={{
                minWidth: "auto",
                p: 0.5
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
