import { Stack } from "@mui/material";
import React from "react";

import UserPromptModal from "~community/common/components/molecules/UserPromptModal/UserPromptModal";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

interface DeleteContactModalProps {
  onConfirmDelete: () => void;
  onCancel: () => void;
}

const DeleteContactModal: React.FC<DeleteContactModalProps> = ({
  onConfirmDelete,
  onCancel
}) => {
  const translateText = useTranslator("eSignatureModule", "contact");

  return (
    <Stack spacing={2}>
      <UserPromptModal
        description={translateText(["deleteContactConfirmation"])}
        primaryBtn={{
          label: translateText(["delete"]),
          buttonStyle: ButtonStyle.ERROR,
          endIcon: IconName.DELETE_BUTTON_ICON,
          styles: { mt: "1rem" },
          onClick: onConfirmDelete
        }}
        secondaryBtn={{
          label: translateText(["cancel"]),
          buttonStyle: ButtonStyle.TERTIARY,
          endIcon: IconName.CLOSE_ICON,
          styles: { mt: "1rem" },
          onClick: onCancel
        }}
      />
    </Stack>
  );
};

export default DeleteContactModal;
