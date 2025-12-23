import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import LocalImage, {
  ImageName
} from "~community/common/components/molecules/LocalImage";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

interface SummaryExternalConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const SummaryExternalConfirmationModal: FC<
  SummaryExternalConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "create.summary.externalConfirmation"
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
      <Stack spacing={3} sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <LocalImage
            name={ImageName.MAIL_BOX}
            width={500}
            height={300}
            style={{ maxWidth: "100%", height: "auto" }}
            aria-hidden={true}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Icon name={IconName.INFO_ICON} fill="#2A61A0" />
          <Typography sx={{ color: "#2A61A0" }}>
            {translateText(["infoSubtitle"])}
          </Typography>
        </Stack>

        <Typography color="text.primary">
          {translateText(["description"])}
        </Typography>

        <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
          <Button
            label={translateText(["confirmBtn"])}
            buttonStyle={ButtonStyle.PRIMARY}
            startIcon={<Icon name={IconName.CHECK_ICON} />}
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

export default SummaryExternalConfirmationModal;
