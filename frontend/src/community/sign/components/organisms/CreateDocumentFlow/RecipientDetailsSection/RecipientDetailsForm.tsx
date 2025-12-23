import { Stack } from "@mui/material";
import Head from "next/head";
import { useCallback, useMemo } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useESignStore } from "~community/sign/store/signStore";

import RecipientDetailsSection from "./RecipientDetailsSection";
import UploadDocumentSection from "./UploadDocumentSection";

interface Props {
  onNext: () => void;
}

const RecipientDetailsForm = ({ onNext }: Props) => {
  const translateText = useTranslator("eSignatureModule", "create");

  const {
    attachments,
    setCustomFileError,
    recipients,
    isSigningOrderEnabled,
    setRecipients
  } = useESignStore();

  const hasDuplicateEmails = useMemo(() => {
    const validEmails = recipients
      .filter((r) => r.email?.trim())
      .map((r) => r.email?.toLowerCase().trim());
    return validEmails.length !== new Set(validEmails).size;
  }, [recipients]);

  const recipientsWithNoEmail = useMemo(() => {
    return recipients.filter((recipient) => !recipient.email);
  }, [recipients]);

  const recipientError = useMemo(() => {
    const hasNotInContactsError = recipients.some(
      (recipient) =>
        recipient.error ===
        translateText([
          "recipientDetails",
          "recipientDetails",
          "recipientNotInContacts"
        ])
    );
    if (hasNotInContactsError) {
      return translateText([
        "recipientDetails",
        "recipientDetails",
        "recipientNotInContacts"
      ]);
    }
    const recipientsWithEmail =
      recipients.length - recipientsWithNoEmail.length;

    if (recipientsWithEmail > 0) {
      return translateText(["emptyFieldError"]);
    } else {
      return translateText(["noRecipientError"]);
    }
  }, [recipients, recipientsWithNoEmail.length, translateText]);

  const setNoRecipientErrors = useCallback(() => {
    const updatedRecipients = recipients.map((recipient) => {
      if (!recipient.email) {
        return {
          ...recipient,
          error: recipientError
        };
      }
      return recipient;
    });

    setRecipients(updatedRecipients);
  }, [recipientError, recipients]);

  const handleNext = async () => {
    if (attachments.length === 0) {
      setCustomFileError(translateText(["noAttachmentCustomError"]));
    } else if (recipientsWithNoEmail.length > 0) {
      setNoRecipientErrors();
    } else if (hasDuplicateEmails && !isSigningOrderEnabled) {
      return;
    } else {
      onNext();
    }
  };
  return (
    <Stack component="div">
      <Head>
        <title>{translateText(["pageHead"])}</title>
      </Head>
      <UploadDocumentSection />
      <RecipientDetailsSection />{" "}
      <Stack
        component="nav"
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ padding: "6rem 0 1rem 0" }}
      >
        <Button
          label={translateText(["next"])}
          buttonStyle={ButtonStyle.PRIMARY}
          endIcon={IconName.RIGHT_ARROW_ICON}
          isFullWidth={false}
          onClick={handleNext}
        />
      </Stack>
    </Stack>
  );
};

export default RecipientDetailsForm;
