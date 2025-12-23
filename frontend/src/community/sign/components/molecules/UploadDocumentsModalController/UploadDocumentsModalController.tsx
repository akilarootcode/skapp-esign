import { useCallback, useState } from "react";

import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { useESignStore } from "~community/sign/store/signStore";
import { ContactFormValues } from "~community/sign/types/contactTypes";

import AddExternalUserModal from "./AddExternalUserModal";
import DeleteDocumentModal from "./DeleteDocumentModal";

const UploadDocumentsModalController = () => {
  const translateText = useTranslator("eSignatureModule", "modals");
  const {
    isDocumentControllerModalOpen,
    setDocumentControllerModalType,
    documentControllerModalType,
    currentSearchTerm
  } = useESignStore();

  const [tempFormValues, setTempFormValues] = useState<
    ContactFormValues | undefined
  >(undefined);
  const [currentFormValues, setCurrentFormValues] = useState<
    ContactFormValues | undefined
  >(undefined);

  const getModalTitle = (): string => {
    switch (documentControllerModalType) {
      case CreateDocumentsModalTypes.DELETE_DOCUMENT:
        return translateText(["deleteDocumentTitle"]);
      case CreateDocumentsModalTypes.PREVIEW_DOCUMENT:
        return translateText(["previewTitle"]);
      case CreateDocumentsModalTypes.ADD_EXTERNAL_USER:
        return translateText(["addExternalUser"]);
      case CreateDocumentsModalTypes.UNSAVED_CHANGES:
        return translateText(["unsavedChangesModalTitle"]);
      default:
        return "";
    }
  };

  const hasUnsavedChanges = useCallback((): boolean => {
    if (!currentFormValues) return false;

    return !!(
      currentFormValues.name ||
      currentFormValues.email ||
      currentFormValues.contactNo
    );
  }, [currentFormValues]);

  const handleCloseModal = (): void => {
    if (
      documentControllerModalType ===
        CreateDocumentsModalTypes.ADD_EXTERNAL_USER &&
      hasUnsavedChanges()
    ) {
      setTempFormValues(currentFormValues);
      setDocumentControllerModalType(CreateDocumentsModalTypes.UNSAVED_CHANGES);
    } else {
      setTempFormValues(undefined);
      setDocumentControllerModalType(CreateDocumentsModalTypes.NONE);
    }
  };

  const handleResume = () => {
    setDocumentControllerModalType(CreateDocumentsModalTypes.ADD_EXTERNAL_USER);
  };

  const handleLeave = () => {
    setTempFormValues(undefined);
    setCurrentFormValues(undefined);
    handleCloseModal();
  };
  return (
    <ModalController
      isModalOpen={isDocumentControllerModalOpen}
      handleCloseModal={handleCloseModal}
      modalTitle={getModalTitle()}
      setModalType={setDocumentControllerModalType}
    >
      <>
        {documentControllerModalType ===
          CreateDocumentsModalTypes.DELETE_DOCUMENT && <DeleteDocumentModal />}
        {documentControllerModalType ===
          CreateDocumentsModalTypes.ADD_EXTERNAL_USER && (
          <AddExternalUserModal
            initialValues={{
              ...tempFormValues,
              email: tempFormValues?.email || currentSearchTerm || ""
            }}
            hasUnsavedChanges={hasUnsavedChanges}
            setTempFormValues={setTempFormValues}
            setCurrentFormValues={setCurrentFormValues}
          />
        )}
        {documentControllerModalType ===
          CreateDocumentsModalTypes.UNSAVED_CHANGES && (
          <AreYouSureModal
            onPrimaryBtnClick={handleResume}
            onSecondaryBtnClick={handleLeave}
          />
        )}
      </>
    </ModalController>
  );
};

export default UploadDocumentsModalController;
