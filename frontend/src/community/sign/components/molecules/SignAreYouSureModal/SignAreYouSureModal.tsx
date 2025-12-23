import { Dispatch, SetStateAction } from "react";

import AreYouSureModal from "~community/common/components/molecules/AreYouSureModal/AreYouSureModal";
import Modal from "~community/common/components/organisms/Modal/Modal";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";

const SignAreYouSureModal = ({
  isOpen,
  setIsOpen,
  onConfirm
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
}) => {
  const translateText = useTranslator("eSignatureModule", "sign", "modals");

  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={() => setIsOpen(false)}
      title={translateText(["titles.cancel"])}
      isClosable={false}
      isDividerVisible={true}
      modalWrapperStyles={{
        zIndex: ZIndexEnums.MODAL
      }}
    >
      <AreYouSureModal
        onPrimaryBtnClick={() => {
          setIsOpen(false);
        }}
        onSecondaryBtnClick={() => onConfirm()}
      />
    </Modal>
  );
};

export default SignAreYouSureModal;
