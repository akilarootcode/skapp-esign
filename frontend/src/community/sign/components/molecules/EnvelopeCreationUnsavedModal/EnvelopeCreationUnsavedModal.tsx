import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";

interface Props {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  handleModalResume: () => void;
  handleModalLeave: () => void;
}

const EnvelopeCreationUnsavedModal = ({
  modalOpen,
  setModalOpen,
  handleModalResume,
  handleModalLeave
}: Props) => {
  const translateText = useTranslator(
    "peopleModule",
    "addResource",
    "commonText"
  );
  return (
    <Modal
      isModalOpen={modalOpen}
      onCloseModal={() => {
        setModalOpen(false);
      }}
      title={translateText(["areYouSureModalTitle"])}
      isClosable={false}
      modalWrapperStyles={{
        zIndex: ZIndexEnums.MODAL
      }}
    >
      <AreYouSureModal
        onPrimaryBtnClick={handleModalResume}
        onSecondaryBtnClick={handleModalLeave}
      />
    </Modal>
  );
};

export default EnvelopeCreationUnsavedModal;
