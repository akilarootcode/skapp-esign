import { Stack, Typography } from "@mui/material";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { useESignStore } from "~community/sign/store/signStore";

import AddRecipientRow from "../AddRecipientRow/AddRecipientRow";

const RecipientRows = () => {
  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.recipientDetails"
  );

  const translateAria = useTranslator("eSignatureModuleAria", "components");

  const { isSigningOrderEnabled } = useESignStore();

  const sectionTitle = isSigningOrderEnabled
    ? translateText(["signingOrder"])
    : translateText(["recipients"]);
  return (
    <Stack
      component="section"
      role="document"
      aria-label={
        isSigningOrderEnabled
          ? translateAria(["recipientSections", "signingOrderSection"])
          : translateAria(["recipientSections", "recipientsSection"])
      }
      gap={2}
    >
      <Typography variant="h2">{sectionTitle}</Typography>
      <AddRecipientRow />
    </Stack>
  );
};

export default RecipientRows;
