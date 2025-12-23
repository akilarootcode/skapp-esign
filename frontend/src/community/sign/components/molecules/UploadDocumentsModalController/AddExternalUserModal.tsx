import { Box, Stack } from "@mui/material";
import { useFormik } from "formik";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import Button from "~community/common/components/atoms/Button/Button";
import InputField from "~community/common/components/molecules/InputField/InputField";
import InputPhoneNumber from "~community/common/components/molecules/InputPhoneNumber/InputPhoneNumber";
import { characterLengths } from "~community/common/constants/stringConstants";
import { ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { ErrorResponse } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { formatPhoneNumber } from "~community/common/utils/commonUtil";
import { isValidNamePatternWithForwardSlash } from "~community/common/utils/validation";
import useGetDefaultCountryCode from "~community/people/hooks/useGetDefaultCountryCode";
import {
  useCreateExternalUser,
  useUpdateExternalUser
} from "~community/sign/api/DocumentApi";
import {
  COMMON_ERROR_USER_ALREADY_EXISTS,
  ESIGN_ERROR_EXTERNAL_USER_EMAIL_ALREADY_EXITS,
  ESIGN_ERROR_EXTERNAL_USER_EXISTS
} from "~community/sign/constants";
import { DocumentUserPrivilege } from "~community/sign/enums/CommonDocumentsEnums";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { useESignStore } from "~community/sign/store/signStore";
import {
  AddExternalUserPayloadType,
  AddExternalUserResponseDto,
  ESignAssigneesType
} from "~community/sign/types/ESignFormTypes";
import { ContactFormValues } from "~community/sign/types/contactTypes";
import { addExternalUserValidations } from "~community/sign/utils/CreateDocumentValidations";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

interface AddExternalUserModalProps {
  initialValues?: {
    name?: string;
    email?: string;
    contactNo?: string;
    countryCode?: string;
  };
  isEdit?: boolean;
  onDelete?: () => void;
  contactId?: number;
  setTempFormValues?: Dispatch<SetStateAction<ContactFormValues | undefined>>;
  setCurrentFormValues?: Dispatch<
    SetStateAction<ContactFormValues | undefined>
  >;
  hasUnsavedChanges?: () => boolean;
}

const AddExternalUserModal = ({
  initialValues: userInitialValues,
  isEdit = false,
  onDelete,
  contactId,
  setTempFormValues,
  setCurrentFormValues,
  hasUnsavedChanges
}: AddExternalUserModalProps) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.recipientDetails.newRecipientModal"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "addExternalUserModal"
  );

  const contactTranslate = useTranslator("eSignatureModule", "contact");
  const countryCode = useGetDefaultCountryCode();
  const { setDocumentControllerModalType, setExternalUser } = useESignStore();
  const { setToastMessage } = useToast();
  const [shouldFocusPhone, setShouldFocusPhone] = useState(false);
  const phoneInputRef = useRef<HTMLDivElement>(null);

  const handleSuccess = useCallback(
    (data: AddExternalUserResponseDto, isUpdate: boolean) => {
      const externalUser: ESignAssigneesType = {
        addressBookId: data.id,
        authPic: null,
        email: isUpdate
          ? (data.email ?? "")
          : (data.externalUserResponseDto?.email ?? ""),
        firstName: isUpdate
          ? (data.firstName ?? "")
          : (data.externalUserResponseDto?.firstName ?? ""),
        userId: data.id,
        userPrivileges: DocumentUserPrivilege.SIGNER,
        lastName: "",
        id: 0
      };

      setExternalUser(externalUser);
      setTempFormValues?.(undefined);
      setDocumentControllerModalType(CreateDocumentsModalTypes.NONE);

      if (isUpdate) {
        setToastMessage({
          open: true,
          toastType: ToastType.SUCCESS,
          title: contactTranslate(["updateSuccessTitle"]),
          description: contactTranslate(["updateSuccessDescription"])
        });
      } else {
        setToastMessage({
          open: true,
          toastType: ToastType.SUCCESS,
          title: contactTranslate(["createSuccessTitle"]),
          description: contactTranslate(["createSuccessDescription"])
        });
      }
    },
    [
      setExternalUser,
      setDocumentControllerModalType,
      setToastMessage,
      contactTranslate,
      setTempFormValues
    ]
  );

  const onCreateSuccess = useCallback(
    (data: AddExternalUserResponseDto) => handleSuccess(data, false),
    [handleSuccess]
  );

  const onUpdateSuccess = useCallback(
    (data: AddExternalUserResponseDto) => handleSuccess(data, true),
    [handleSuccess]
  );

  const onError = useCallback(
    (error: ErrorResponse) => {
      if (
        error.response.data.results[0].messageKey ===
          ESIGN_ERROR_EXTERNAL_USER_EXISTS ||
        error.response.data.results[0].messageKey ===
          ESIGN_ERROR_EXTERNAL_USER_EMAIL_ALREADY_EXITS ||
        error.response.data.results[0].messageKey ===
          COMMON_ERROR_USER_ALREADY_EXISTS
      ) {
        setFieldError("email", contactTranslate(["emailAlreadyExists"]));
        return;
      }

      if (isEdit) {
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: contactTranslate(["updateErrorTitle"]),
          description: contactTranslate(["updateErrorDescription"])
        });
      }
    },
    [setToastMessage, contactTranslate, isEdit]
  );

  const { mutate: createExternalUser, isPending: isCreatingPending } =
    useCreateExternalUser(onCreateSuccess, onError);

  const { mutate: updateExternalUser, isPending: isUpdatingPending } =
    useUpdateExternalUser(onUpdateSuccess, onError);

  const initialValues = {
    name: userInitialValues?.name || "",
    email: userInitialValues?.email || "",
    contactNo: userInitialValues?.contactNo || "",
    countryCode: userInitialValues?.countryCode || countryCode
  };
  const { sendEvent } = useGoogleAnalyticsEvent();

  const onSubmit = async (values: any) => {
    if (isEdit) {
      const payload: Partial<AddExternalUserPayloadType> = {
        id: contactId
      };

      if (values.name && values.name !== userInitialValues?.name) {
        payload.firstName = values.name;
      }

      if (values.email && values.email !== userInitialValues?.email) {
        payload.email = values.email;
      }

      const phoneChanged =
        values.contactNo !== userInitialValues?.contactNo ||
        values.countryCode !== userInitialValues?.countryCode;

      if (values.contactNo && phoneChanged) {
        payload.phone = formatPhoneNumber(values.countryCode, values.contactNo);
      }

      if (Object.keys(payload).length > 1) {
        updateExternalUser(payload as AddExternalUserPayloadType);
      }
    } else {
      const createPayload: AddExternalUserPayloadType = {
        firstName: values.name,
        email: values.email,
        lastName: ""
      };

      if (values.contactNo) {
        createPayload.phone = formatPhoneNumber(
          values.countryCode,
          values.contactNo
        );
      }

      createExternalUser(createPayload);
      sendEvent(GoogleAnalyticsTypes.GA4_ESIGN_CONTACT_ADDED);
    }
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: addExternalUserValidations(translateText),
    validateOnChange: false,
    validateOnBlur: true
  });

  const { values, errors, setFieldValue, handleSubmit, setFieldError } = formik;

  const handlePhoneNumber = async (
    phone: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    await setFieldValue("contactNo", phone.target.value);
    setFieldError("contactNo", "");

    if (!values.countryCode) {
      setFieldValue("countryCode", countryCode);
    }
  };
  const onChangeCountry = async (countryCode: string): Promise<void> => {
    setFieldValue("countryCode", countryCode);
    setShouldFocusPhone(true);
  };

  const handleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      await setFieldValue(name, value);
      setFieldError(name, "");
    } else {
      await setFieldValue(name, value);
      setFieldError(name, "");
    }
  };
  useEffect(() => {
    setCurrentFormValues?.(values);
  }, [values, setCurrentFormValues]);
  useEffect(() => {
    if (shouldFocusPhone && phoneInputRef.current) {
      const phoneInput = phoneInputRef.current.querySelector(
        `input[name="contactNo"]`
      ) as HTMLInputElement;
      if (phoneInput) {
        phoneInput.focus();
      }
      setShouldFocusPhone(false);
    }
  }, [shouldFocusPhone]);

  const handleDeleteOrCancel = () => {
    if (isEdit && onDelete) {
      onDelete();
    } else if (hasUnsavedChanges?.()) {
      setTempFormValues?.(values);
      setDocumentControllerModalType(CreateDocumentsModalTypes.UNSAVED_CHANGES);
    } else {
      setTempFormValues?.(undefined);
      setDocumentControllerModalType(CreateDocumentsModalTypes.NONE);
    }
  };

  return (
    <Stack>
      <Stack
        sx={{
          flexDirection: "column",
          gap: 2
        }}
        role="form"
        aria-label={
          isEdit
            ? translateAria(["editContactDescription"])
            : translateAria(["addContactDescription"])
        }
      >
        <InputField
          inputName="name"
          value={values.name}
          error={errors.name}
          label={translateText(["name"])}
          required
          onChange={handleInput}
          placeHolder={translateText(["namePlaceholder"])}
          maxLength={characterLengths.RECIPIENT_NAME_MAX_CHARACTER_LENGTH}
        />
        <InputField
          inputName="email"
          value={values.email}
          error={errors.email}
          label={translateText(["email"])}
          placeHolder={translateText(["emailPlaceholder"])}
          required
          onChange={handleInput}
        />
        <Box ref={phoneInputRef}>
          <InputPhoneNumber
            label={translateText(["contactNo"])}
            value={values?.contactNo ?? ""}
            countryCodeValue={values.countryCode}
            placeHolder={translateText(["contactNoPlaceholder"])}
            onChangeCountry={onChangeCountry}
            onChange={handlePhoneNumber}
            error={errors.contactNo ?? ""}
            inputName="contactNo"
            fullComponentStyle={{
              mt: "0rem",
              fontFamily: "Poppins, sans-serif"
            }}
            ariaLabel={translateAria(["contactNoAriaLabel"])}
          />
        </Box>
        <Button
          buttonStyle={ButtonStyle.PRIMARY}
          label={
            isEdit ? translateText(["savesChanges"]) : translateText(["save"])
          }
          endIcon={IconName.FORWARD_ARROW}
          styles={{
            marginTop: 2
          }}
          onClick={() => handleSubmit()}
          disabled={values.email === "" || values.name === ""}
          isLoading={isCreatingPending || isUpdatingPending}
        />
        <Button
          buttonStyle={isEdit ? ButtonStyle.ERROR : ButtonStyle.TERTIARY}
          label={isEdit ? translateText(["delete"]) : translateText(["cancel"])}
          endIcon={isEdit ? IconName.DELETE_BUTTON_ICON : IconName.CLOSE_ICON}
          onClick={handleDeleteOrCancel}
        />
      </Stack>
    </Stack>
  );
};

export default AddExternalUserModal;
