import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { DocumentSignModalTypes } from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";

const CancelFlowModal = () => {
  const router = useRouter();
  const translateText = useTranslator("eSignatureModule", "sign");
  const { setSigningCompleteModalOpen } = useESignStore();

  return (
    <Box>
      <Typography>{translateText(["modals.content.cancel.text"])}</Typography>
      <Stack
        gap={1}
        sx={{
          marginTop: "1rem"
        }}
      >
        <Button
          label={translateText(["modals.content.cancel.resume"])}
          buttonStyle={ButtonStyle.PRIMARY}
          onClick={() =>
            setSigningCompleteModalOpen(DocumentSignModalTypes.NONE)
          }
          endIcon={IconName.RIGHT_ARROW_ICON}
        />
        <Button
          label={translateText(["modals.content.cancel.leave"])}
          buttonStyle={ButtonStyle.ERROR}
          endIcon={IconName.CLOSE_ICON}
          onClick={() => {
            router.back();
            setSigningCompleteModalOpen(DocumentSignModalTypes.NONE);
          }}
        />
      </Stack>
    </Box>
  );
};

export default CancelFlowModal;
