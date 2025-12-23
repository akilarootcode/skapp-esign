import { useRouter } from "next/router";
import { useState } from "react";

import ROUTES from "~community/common/constants/routes";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { useRecipientConsent } from "~community/sign/api/SignApi";
import { useESignStore } from "~community/sign/store/signStore";

export const useConsentModal = (isInternalUser?: boolean) => {
  const router = useRouter();

  const translateText = useTranslator("eSignatureModule", "sign");
  const { setToastMessage } = useToast();
  const { documentInfo, setDocumentInfo } = useESignStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    documentInfo?.consent ? false : true
  );

  const { mutate: submitConsent } = useRecipientConsent(
    () => {
      if (documentInfo) {
        setDocumentInfo({
          ...documentInfo,
          consent: true
        });
      }
      setIsModalOpen(false);
    },
    () => {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["concentModal.consentFailedTitle"]),
        description: translateText(["concentModal.consentFailedDesc"]),
        isIcon: true
      });
    }
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    isInternalUser ? router.back() : router.push(ROUTES.SIGN.INFO);
  };

  const handleStartSign = () => {
    submitConsent({
      isConsent: true,
      isInternalUser: isInternalUser as boolean
    });
  };

  return {
    isModalOpen,
    documentInfo,
    handleCloseModal,
    handleStartSign
  };
};
