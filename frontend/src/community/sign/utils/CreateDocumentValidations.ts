import * as Yup from "yup";

import { characterLengths } from "~community/common/constants/stringConstantsEnterprise";
import { TranslatorFunctionType } from "~community/common/types/CommonTypes";
import { isValidEmailPattern } from "~community/common/utils/validation";

export const addExternalUserValidations = (
  translator: TranslatorFunctionType
) => {
  return Yup.object({
    name: Yup.string()
      .required(translator(["requireNameError"]))
      .max(
        characterLengths.RECIPIENT_NAME_MAX_CHARACTER_LENGTH,
        translator(["maxCharacterLimitError"])
      ),
    email: Yup.string()
      .trim()
      .test(
        "valid-email-format",
        translator(["validEmailError"]),
        function (value) {
          if (value) {
            return isValidEmailPattern(value);
          }
          return false;
        }
      )
      .required(translator(["requireEmailError"])),
    contactNo: Yup.string()
      .max(
        characterLengths.PHONE_NUMBER_LENGTH_MAX,
        translator(["validContactNumberError"])
      )
      .min(
        characterLengths.PHONE_NUMBER_LENGTH_MIN,
        translator(["validContactNumberError"])
      )
  });
};
