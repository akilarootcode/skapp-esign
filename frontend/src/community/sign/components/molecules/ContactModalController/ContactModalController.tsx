import { useCallback, useState } from "react";

import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import ModalController from "~community/common/components/organisms/ModalController/ModalController";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { useDeleteExternalUser } from "~community/sign/api/DocumentApi";
import AddExternalUserModal from "~community/sign/components/molecules/UploadDocumentsModalController/AddExternalUserModal";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { useESignStore } from "~community/sign/store/signStore";
import {
  ContactDataType,
  ContactFormValues
} from "~community/sign/types/contactTypes";
import {
  extractPhoneInfo,
  getContactExternalFullName
} from "~community/sign/utils/contactUtils";

import DeleteContactModal from "../DeleteContactModal/DeleteContactModal";

interface ContactModalControllerProps {
  selectedContact: ContactDataType | null;
  isEditMode: boolean;
  onClose: () => void;
}

const ContactModalController = ({
  selectedContact,
  isEditMode,
  onClose
}: ContactModalControllerProps) => {
  const translateText = useTranslator("eSignatureModule", "contact");
  const { documentControllerModalType, setDocumentControllerModalType } =
    useESignStore();
  const { setToastMessage } = useToast();
  const [isDeleteProcessing, setIsDeleteProcessing] = useState(false);
  const [tempFormValues, setTempFormValues] = useState<
    ContactFormValues | undefined
  >(undefined);
  const [currentFormValues, setCurrentFormValues] = useState<
    ContactFormValues | undefined
  >(undefined);

  const onDeleteSuccess = useCallback(() => {
    setDocumentControllerModalType(CreateDocumentsModalTypes.NONE);
    setTempFormValues?.(undefined);
    onClose();

    setToastMessage({
      open: true,
      toastType: ToastType.SUCCESS,
      title: translateText(["deleteSuccessTitle"]),
      description: translateText(["deleteSuccessDescription"])
    });

    setIsDeleteProcessing(false);
  }, [onClose, setDocumentControllerModalType, setToastMessage, translateText]);

  const onDeleteError = useCallback(() => {
    setToastMessage({
      open: true,
      toastType: ToastType.ERROR,
      title: translateText(["deleteErrorTitle"]),
      description: translateText(["deleteErrorDescription"])
    });

    setIsDeleteProcessing(false);
  }, [setToastMessage, translateText]);

  const { mutate: deleteContact } = useDeleteExternalUser(
    onDeleteSuccess,
    onDeleteError
  );

  const hasUnsavedChanges = useCallback((): boolean => {
    if (!currentFormValues) return false;

    if (isEditMode && selectedContact) {
      const initialValues = {
        name: getContactExternalFullName(
          selectedContact.firstName,
          selectedContact.lastName
        ),
        email: selectedContact.email,
        ...extractPhoneInfo(selectedContact.phone)
      };

      const hasChanges = !!(
        (currentFormValues.name || "").trim() !==
          (initialValues.name || "").trim() ||
        (currentFormValues.email || "").trim() !==
          (initialValues.email || "").trim() ||
        (currentFormValues.contactNo || "") !==
          (initialValues.contactNo || "") ||
        (initialValues.contactNo &&
          (currentFormValues.countryCode || "") !==
            (initialValues.countryCode || ""))
      );

      return hasChanges;
    } else {
      return !!(
        (currentFormValues.name || "").trim() ||
        (currentFormValues.email || "").trim() ||
        currentFormValues.contactNo
      );
    }
  }, [currentFormValues, selectedContact, isEditMode]);

  const handleCloseModal = useCallback((): void => {
    if (isDeleteProcessing) return;

    if (
      documentControllerModalType ===
        CreateDocumentsModalTypes.ADD_EXTERNAL_USER &&
      hasUnsavedChanges()
    ) {
      setTempFormValues(currentFormValues);
      setDocumentControllerModalType(CreateDocumentsModalTypes.UNSAVED_CHANGES);
    } else {
      setTempFormValues?.(undefined);
      onClose();
    }
  }, [
    onClose,
    isDeleteProcessing,
    currentFormValues,
    hasUnsavedChanges,
    documentControllerModalType,
    setDocumentControllerModalType
  ]);

  const handleShowDeleteConfirmation = useCallback(() => {
    setDocumentControllerModalType(
      CreateDocumentsModalTypes.DELETE_EXTERNAL_USER
    );
  }, [setDocumentControllerModalType]);

  const handleCancelDelete = useCallback(() => {
    if (!isDeleteProcessing) {
      setDocumentControllerModalType(
        CreateDocumentsModalTypes.ADD_EXTERNAL_USER
      );
    }
  }, [setDocumentControllerModalType, isDeleteProcessing]);

  const handleConfirmDelete = useCallback(() => {
    if (isDeleteProcessing) return;

    if (selectedContact?.addressBookId) {
      setIsDeleteProcessing(true);
      deleteContact(selectedContact.addressBookId);
    }
  }, [deleteContact, selectedContact, isDeleteProcessing]);

  const getModalTitle = (): string => {
    switch (documentControllerModalType) {
      case CreateDocumentsModalTypes.ADD_EXTERNAL_USER:
        return isEditMode
          ? translateText(["editContact"])
          : translateText(["addContact"]);
      case CreateDocumentsModalTypes.DELETE_EXTERNAL_USER:
        return translateText(["deleteConfirmationTitle"]);
      case CreateDocumentsModalTypes.UNSAVED_CHANGES:
        return translateText(["unsavedChangesModalTitle"]);
      default:
        return "";
    }
  };

  const handleResume = () => {
    setDocumentControllerModalType(CreateDocumentsModalTypes.ADD_EXTERNAL_USER);
  };

  const handleLeave = () => {
    setTempFormValues(undefined);
    setCurrentFormValues(undefined);
    onClose();
  };

  return (
    <ModalController
      isModalOpen={
        documentControllerModalType ===
          CreateDocumentsModalTypes.ADD_EXTERNAL_USER ||
        documentControllerModalType ===
          CreateDocumentsModalTypes.DELETE_EXTERNAL_USER ||
        documentControllerModalType ===
          CreateDocumentsModalTypes.UNSAVED_CHANGES
      }
      handleCloseModal={handleCloseModal}
      isClosable={
        documentControllerModalType ===
        CreateDocumentsModalTypes.ADD_EXTERNAL_USER
      }
      modalTitle={getModalTitle()}
      setModalType={setDocumentControllerModalType}
    >
      <>
        {documentControllerModalType ===
          CreateDocumentsModalTypes.ADD_EXTERNAL_USER && (
          <AddExternalUserModal
            initialValues={
              tempFormValues ||
              (selectedContact
                ? {
                    name: getContactExternalFullName(
                      selectedContact.firstName,
                      selectedContact.lastName
                    ),
                    email: selectedContact.email,
                    ...extractPhoneInfo(selectedContact.phone)
                  }
                : undefined)
            }
            isEdit={isEditMode}
            onDelete={handleShowDeleteConfirmation}
            contactId={selectedContact?.addressBookId}
            setTempFormValues={setTempFormValues}
            setCurrentFormValues={setCurrentFormValues}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )}
        {documentControllerModalType ===
          CreateDocumentsModalTypes.DELETE_EXTERNAL_USER && (
          <DeleteContactModal
            onConfirmDelete={handleConfirmDelete}
            onCancel={handleCancelDelete}
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

export default ContactModalController;
