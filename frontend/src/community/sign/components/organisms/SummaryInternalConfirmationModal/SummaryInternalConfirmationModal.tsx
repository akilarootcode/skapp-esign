import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

interface SummaryInternalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const SummaryInternalConfirmationModal: FC<
  SummaryInternalConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "create.summary.internalConfirmation"
  );
  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={onClose}
      title={translateText(["title"])}
      isIconVisible={false}
      isClosable={false}
      modalContentStyles={{ maxWidth: "500px", width: "100%" }}
    >
      <Stack spacing={3}>
        <Typography variant="body1" color="text.primary">
          {translateText(["description"])}
        </Typography>

        <Stack direction="column" spacing={2}>
          <Button
            label={translateText(["confirmBtn"])}
            buttonStyle={ButtonStyle.PRIMARY}
            endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          />

          <Button
            label={translateText(["cancelBtn"])}
            buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
            endIcon={<Icon name={IconName.CLOSE_ICON} />}
            onClick={onClose}
            disabled={isLoading}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

export default SummaryInternalConfirmationModal;
