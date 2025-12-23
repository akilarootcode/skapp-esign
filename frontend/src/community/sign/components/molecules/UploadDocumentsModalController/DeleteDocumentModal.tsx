import { Stack, Typography } from "@mui/material";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useDeleteDocument } from "~community/sign/api/DocumentApi";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { useESignStore } from "~community/sign/store/signStore";
import { deleteFileFromS3 } from "~enterprise/common/utils/awsS3ServiceFunctions";

const DeleteDocumentModal = () => {
  const translateText = useTranslator("eSignatureModule", "modals");

  const {
    setDocumentControllerModalType,
    setAttachments,
    attachments,
    documentId,
    uploadedPdfS3Url,
    resetSignatureFields
  } = useESignStore();

  const onSuccess = () => {
    resetSignatureFields();
  };

  const { mutateAsync: DeleteDocument } = useDeleteDocument(
    documentId || "",
    onSuccess
  );
  return (
    <Stack>
      <Typography variant="body1">
        {translateText(["deleteDocumentDesc"])}
      </Typography>

      <Stack>
        <Button
          label={translateText(["delete"])}
          endIcon={IconName.DELETE_BUTTON_ICON}
          styles={{
            marginTop: 2
          }}
          buttonStyle={ButtonStyle.ERROR}
          onClick={() => {
            if (uploadedPdfS3Url) {
              deleteFileFromS3(uploadedPdfS3Url);
            }
            DeleteDocument();
            setAttachments([]);
            setDocumentControllerModalType(CreateDocumentsModalTypes.NONE);
          }}
        />
        <Button
          label={translateText(["cancel"])}
          endIcon={IconName.CLOSE_ICON}
          styles={{
            marginTop: 2
          }}
          buttonStyle={ButtonStyle.TERTIARY}
          onClick={() => {
            setDocumentControllerModalType(CreateDocumentsModalTypes.NONE);
          }}
        />
      </Stack>
    </Stack>
  );
};

export default DeleteDocumentModal;
