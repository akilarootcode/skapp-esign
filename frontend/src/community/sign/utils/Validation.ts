import * as Yup from "yup";

import { VOID_MESSAGE_LENGTH } from "~community/common/constants/stringConstants";
import { alphaNumericNamePatternWithSpecialCharacters } from "~community/common/regex/regexPatterns";

export const getVoidEnvelopeValidationSchema = (translateText: Function) => {
  return Yup.object({
    voidReason: Yup.string()
      .max(
        VOID_MESSAGE_LENGTH,
        translateText(["voidEnvelopeModal.characterLimitExceeded"])
      )
      .required(translateText(["voidEnvelopeModal.requiredError"]))
  });
};

export const isValidVoidReason = (text: string): boolean => {
  return alphaNumericNamePatternWithSpecialCharacters().test(text);
};
