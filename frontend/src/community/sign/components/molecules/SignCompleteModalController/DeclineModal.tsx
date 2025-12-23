import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import TextArea from "~community/common/components/atoms/TextArea/TextArea";
import ROUTES from "~community/common/constants/routes";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useDeclineDocument } from "~community/sign/api/SignApi";
import { DECLINE_MESSAGE_MAX_LENGTH } from "~community/sign/constants";
import {
  DocumentFieldsIdentifiers,
  DocumentSignModalTypes
} from "~community/sign/enums/CommonDocumentsEnums";
import { RedirectStatus } from "~community/sign/enums/CommonEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { DocumentStatus } from "~community/sign/types/CommonEsignTypes";
import { SignatureFieldStatus } from "~community/sign/types/ESignFormTypes";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

interface DeclineModalProps {
  isInternalUser?: boolean;
}

const DeclineModal = ({ isInternalUser }: DeclineModalProps) => {
  const router = useRouter();
  const translateText = useTranslator(
    "eSignatureModule",
    "sign.modals.content.decline"
  );
  const description = translateText(["text"]);
  const declineTranslateText = useTranslator("eSignatureModule", "sign");
  const { sendEvent } = useGoogleAnalyticsEvent();
  const {
    setSigningCompleteModalOpen,
    documentInfo,
    completingFiledId,
    setCompleteFlowSignatureFields,
    completeFlowSignatureFields,
    setDocumentInfo,
    recipientId
  } = useESignStore();

  const { setToastMessage } = useToast();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: declineDocument } = useDeclineDocument(
    () => {
      setCompleteFlowSignatureFields(
        completeFlowSignatureFields.map((field) =>
          field.id === completingFiledId
            ? {
                ...field,
                value: true,
                fieldStatus: SignatureFieldStatus.COMPLETED
              }
            : field
        )
      );

      setCompleteFlowSignatureFields(
        completeFlowSignatureFields.map((field) => {
          if (field.fieldType === DocumentFieldsIdentifiers.APPROVE) {
            return {
              ...field,
              fieldStatus: SignatureFieldStatus.SKIPPED,
              value: false
            };
          }
          return field;
        })
      );

      setDocumentInfo({
        ...documentInfo,
        status: DocumentStatus.DECLINED
      });

      setSigningCompleteModalOpen(DocumentSignModalTypes.NONE);

      router.push({
        pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
        query: {
          status: RedirectStatus.DECLINED_DOCUMENT,
          ...(isInternalUser && { isInternalUser: isInternalUser })
        }
      });
      setIsLoading(false);
    },
    () => {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: declineTranslateText(["toast", "declineErrorTitle"]),
        description: declineTranslateText(["toast", "declineErrorDesc"])
      });
      setIsLoading(false);
    }
  );

  const onDecline = async () => {
    setIsLoading(true);

    declineDocument({
      data: {
        declineReason: message,
        recipientId: recipientId
      },
      isInternalUser
    });
    sendEvent(GoogleAnalyticsTypes.GA4_ESIGN_ENVELOPE_DECLINED);
  };

  return (
    <Stack gap={"1rem"}>
      <Typography variant="body1">{description}</Typography>
      <TextArea
        label={translateText(["textBoxLabel"])}
        placeholder={translateText(["textBoxPlaceholder"])}
        name={"reason"}
        value={message}
        onChange={function (event: ChangeEvent<HTMLTextAreaElement>): void {
          const newValue = event.target.value;
          if (newValue.length >= DECLINE_MESSAGE_MAX_LENGTH) {
            setError(translateText(["errorText"]));
          } else {
            setError(undefined);
          }

          setMessage(newValue);
        }}
        error={{
          comment: error
        }}
        maxLength={DECLINE_MESSAGE_MAX_LENGTH}
        isRequired={true}
      />

      <Button
        label={translateText(["decline"])}
        buttonStyle={ButtonStyle.ERROR}
        onClick={onDecline}
        endIcon={IconName.RIGHT_ARROW_ICON}
        isLoading={isLoading}
        disabled={isLoading || !message.trim().length || !!error}
      />
      <Button
        label={translateText(["cancel"])}
        buttonStyle={ButtonStyle.TERTIARY}
        onClick={() => setSigningCompleteModalOpen(DocumentSignModalTypes.NONE)}
        endIcon={IconName.CLOSE_ICON}
      />
    </Stack>
  );
};

export default DeclineModal;
