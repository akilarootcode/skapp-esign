import { Stack, useTheme } from "@mui/material";
import React, { useState } from "react";

import TextArea from "~community/common/components/atoms/TextArea/TextArea";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { alphaNumericWithExtendedSpecialCharacters } from "~community/common/regex/regexPatterns";
import {
  MAX_SUMMARY_EMAIL_MESSAGE_LENGTH,
  MAX_SUMMARY_EMAIL_SUBJECT_LENGTH
} from "~community/sign/constants";

interface EmailDetailsProps {
  emailSubject: string;
  setEmailSubject: (value: string) => void;
  emailMessage: string;
  setEmailMessage: (value: string) => void;
  emailSubjectError?: string;
  setEmailSubjectError?: (value: string) => void;
  translateText: (
    suffixes: string[],
    interpolationValues?: Record<string, any>
  ) => string;
}

const EmailDetails: React.FC<EmailDetailsProps> = ({
  emailSubject,
  setEmailSubject,
  emailMessage,
  setEmailMessage,
  emailSubjectError,
  translateText
}) => {
  const [emailMessageError, setEmailMessageError] = useState<string>("");
  const theme = useTheme();
  const handleEmailSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (
      value.length <= MAX_SUMMARY_EMAIL_SUBJECT_LENGTH &&
      (value === "" || alphaNumericWithExtendedSpecialCharacters().test(value))
    ) {
      setEmailSubject(value);
    }
  };

  const handleEmailMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setEmailMessage(value);
    if (value.length >= MAX_SUMMARY_EMAIL_MESSAGE_LENGTH) {
      setEmailMessageError(
        translateText(["emailMessageLimitError"], {
          limit: MAX_SUMMARY_EMAIL_MESSAGE_LENGTH.toLocaleString()
        })
      );
    } else {
      setEmailMessageError("");
    }
  };

  return (
    <Stack gap="24px" mt="24px">
      <InputField
        label={translateText(["emailSubject"])}
        inputName="emailSubject"
        value={emailSubject}
        onChange={handleEmailSubjectChange}
        placeHolder={translateText(["addEmailSubject"])}
        required
        error={emailSubjectError}
        inputProps={{
          maxLength: MAX_SUMMARY_EMAIL_SUBJECT_LENGTH
        }}
      />
      <TextArea
        label={translateText(["emailMessage"])}
        name="emailMessage"
        value={emailMessage}
        onChange={handleEmailMessageChange}
        placeholder={translateText(["addMessage"])}
        maxLength={MAX_SUMMARY_EMAIL_MESSAGE_LENGTH}
        isRequired={false}
        error={{
          comment: emailMessageError
        }}
        textColor={theme.palette.text.blackText}
      />
    </Stack>
  );
};

export default EmailDetails;
