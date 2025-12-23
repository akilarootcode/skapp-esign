import { useCallback, useEffect, useState } from "react";

import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { SignatureData } from "~community/sign/constants";
import { DocumentSignModalTypes } from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { SignatureFieldStatus } from "~community/sign/types/ESignFormTypes";

import InitialCapture from "../../organisms/SignFlow/InitialCapture/InitialCapture";
import SignatureCapture from "../../organisms/SignFlow/SignatureCapture/SignatureCapture";
import AdoptStampModal from "./AdoptStampModal";
import CancelFlowModal from "./CancelFlowModal";
import DeclineModal from "./DeclineModal";

interface SignCompleteModalControllerProps {
  isInternalUser?: boolean;
}

const SignCompleteModalController = ({
  isInternalUser
}: SignCompleteModalControllerProps) => {
  const translateText = useTranslator("eSignatureModule", "sign");
  const {
    signatureFields,
    currentField,
    setSignatureFields,
    setCurrentField,
    isSigningCompleteModalOpen,
    signingCompleteModalType,
    setSigningCompleteModalOpen
  } = useESignStore();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setSigningCompleteModalOpen(DocumentSignModalTypes.NONE);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (signingCompleteModalType === DocumentSignModalTypes.NONE) {
      setIsProcessing(false);
    }
  }, [signingCompleteModalType]);

  const handleCloseModal = useCallback((): void => {
    setSigningCompleteModalOpen(DocumentSignModalTypes.NONE);
    setCurrentField(null);
    setIsProcessing(false);
  }, [setSigningCompleteModalOpen, setCurrentField]);

  const handleCompleteSignature = useCallback(
    async (signature: SignatureData) => {
      if (isProcessing) return;

      setIsProcessing(true);

      if (currentField) {
        const updatedFields = signatureFields.map((f) =>
          f.id === currentField.id
            ? {
                ...f,
                signature: signature.value,
                signatureType: signature.type,
                signatureStyle: signature.style,
                status: SignatureFieldStatus.COMPLETED
              }
            : f
        );

        setSignatureFields(updatedFields);
      }

      handleCloseModal();
    },
    [
      currentField,
      signatureFields,
      setSignatureFields,
      isProcessing,
      handleCloseModal
    ]
  );

  const getModalTitle = (): string => {
    switch (signingCompleteModalType) {
      case DocumentSignModalTypes.STAMP:
        return translateText(["modals.titles.stamp"]);
      case DocumentSignModalTypes.CANCEL_FLOW:
        return translateText(["modals.titles.cancel"]);
      case DocumentSignModalTypes.DECLINE:
        return translateText(["modals.titles.cancel"]);
      case DocumentSignModalTypes.SIGN:
        return translateText(["modals.titles.sign"]);
      case DocumentSignModalTypes.INITIAL:
        return translateText(["modals.titles.initial"]);
      default:
        return "";
    }
  };

  return (
    <ModalController
      isModalOpen={isSigningCompleteModalOpen}
      handleCloseModal={handleCloseModal}
      modalTitle={getModalTitle()}
      setModalType={setSigningCompleteModalOpen}
      isClosable={false}
    >
      <>
        {signingCompleteModalType === DocumentSignModalTypes.STAMP && (
          <AdoptStampModal onSubmit={handleCompleteSignature} />
        )}
        {signingCompleteModalType === DocumentSignModalTypes.CANCEL_FLOW && (
          <CancelFlowModal />
        )}
        {signingCompleteModalType === DocumentSignModalTypes.DECLINE && (
          <DeclineModal isInternalUser={isInternalUser} />
        )}
        {signingCompleteModalType === DocumentSignModalTypes.SIGN && (
          <SignatureCapture
            onComplete={handleCompleteSignature}
            disabled={isProcessing}
          />
        )}
        {signingCompleteModalType === DocumentSignModalTypes.INITIAL && (
          <InitialCapture
            onComplete={handleCompleteSignature}
            disabled={isProcessing}
          />
        )}
      </>
    </ModalController>
  );
};

export default SignCompleteModalController;
