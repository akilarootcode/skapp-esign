import { Stack, Typography, useTheme } from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, FC, useEffect } from "react";



import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import TextArea from "~community/common/components/atoms/TextArea/TextArea";
import Form from "~community/common/components/molecules/Form/Form";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ButtonStyle, ButtonTypes, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useVoidSpecificEnvelope } from "~community/sign/api/EnvelopeApi";
import { VOID_MESSAGE_MAX_LENGTH } from "~community/sign/constants";
import { getVoidEnvelopeValidationSchema } from "~community/sign/utils/Validation";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";


interface VoidEnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  envelopeId: number;
}

const VoidEnvelopeModal: FC<VoidEnvelopeModalProps> = ({
  isOpen,
  onClose,
  envelopeId
}) => {
  const translateText = useTranslator("eSignatureModule", "modals");
  const { setToastMessage } = useToast();
  const theme = useTheme();
  const { sendEvent } = useGoogleAnalyticsEvent();

  const onSuccess = () => {
    sendEvent(GoogleAnalyticsTypes.GA4_ESIGN_ENVELOPE_VOIDED);
    setToastMessage({
      open: true,
      toastType: ToastType.SUCCESS,
      title: translateText(["voidEnvelopeModal.successTitle"]),
      description: translateText(["voidEnvelopeModal.successMessage"])
    });
  };

  const onError = () => {
    setToastMessage({
      open: true,
      toastType: ToastType.ERROR,
      title: translateText(["voidEnvelopeModal.errorTitle"]),
      description: translateText(["voidEnvelopeModal.errorMessage"])
    });
  };

  const handleSubmit = () => {
    voidSpecificEnvelope({
      voidReason: formik.values.voidReason
    });
    formik.resetForm();
    onClose();
  };

  const { mutate: voidSpecificEnvelope } = useVoidSpecificEnvelope(
    envelopeId,
    onSuccess,
    onError
  );

  const formik = useFormik({
    initialValues: {
      voidReason: ""
    },
    validationSchema: getVoidEnvelopeValidationSchema(translateText),
    onSubmit: handleSubmit
  });

  useEffect(() => {
    if (formik.values.voidReason.length > 0) {
      formik.validateField("voidReason");
    }
  }, [formik.values.voidReason]);

  const handleVoidReasonChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const newValue = e.target.value;
    formik.setFieldValue("voidReason", newValue);
  };

  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={onClose}
      title={translateText(["voidEnvelopeModal.title"])}
      isClosable={false}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <Typography variant="body1">
            {translateText(["voidEnvelopeModal.description.part1"])}
            <strong>
              {translateText(["voidEnvelopeModal.description.part2"])}
            </strong>
            {translateText(["voidEnvelopeModal.description.part3"])}
          </Typography>
          <TextArea
            label={translateText(["voidEnvelopeModal.inputLabel"])}
            name="voidReason"
            placeholder={translateText(["voidEnvelopeModal.inputPlaceholder"])}
            value={formik.values.voidReason}
            onChange={handleVoidReasonChange}
            error={
              formik.errors.voidReason
                ? { comment: formik.errors.voidReason as string }
                : undefined
            }
            isErrorTopic={false}
            maxLength={VOID_MESSAGE_MAX_LENGTH}
            isRequired={false}
          />
          <Button
            label={translateText(["voidEnvelopeModal.confirmBtn"])}
            buttonStyle={ButtonStyle.ERROR}
            type={ButtonTypes.SUBMIT}
            disabled={
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.values.voidReason.trim()
            }
            endIcon={
              <Icon
                name={IconName.BLOCKED_ICON}
                fill={theme.palette.text.error}
                width="1.25rem"
                height="1.25rem"
              />
            }
          />
          <Button
            label={translateText(["voidEnvelopeModal.cancelBtn"])}
            buttonStyle={ButtonStyle.TERTIARY}
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            endIcon={IconName.CLOSE_ICON}
          />
        </Stack>
      </Form>
    </Modal>
  );
};

export default VoidEnvelopeModal;