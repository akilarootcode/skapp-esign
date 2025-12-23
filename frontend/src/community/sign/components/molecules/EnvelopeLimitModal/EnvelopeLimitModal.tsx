import { useRouter } from "next/navigation";

import UpgradeTierContent from "~community/common/components/molecules/UpgradeTierContent/UpgradeTierContent";
import BasicModal from "~community/common/components/organisms/BasicModal/BasicModal";
import ROUTES from "~community/common/constants/routes";
import { SKAPP_CONTACT_US_LINK } from "~community/common/constants/stringConstantsEnterprise";
import { ButtonStyle } from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useESignStore } from "~community/sign/store/signStore";

const EnvelopeLimitModal = () => {
  const translateText = useTranslator("eSignatureModule", "info");
  const { isSuperAdmin, isProTier } = useSessionData();
  const router = useRouter();
  const { showEnvelopeLimitModal, setShowEnvelopeLimitModal } = useESignStore(
    (state) => ({
      showEnvelopeLimitModal: state.showEnvelopeLimitModal,
      setShowEnvelopeLimitModal: state.setShowEnvelopeLimitModal
    })
  );
  const handleUpgradeClick = () => {
    setShowEnvelopeLimitModal(false);
    isProTier
      ? router.push(SKAPP_CONTACT_US_LINK)
      : router.push(ROUTES.SUBSCRIPTION);
  };

  const getDescription = () => {
    if (isProTier && isSuperAdmin) {
      return translateText(["envelopeLimitReached", "descriptionProTier"]);
    } else if (isProTier && !isSuperAdmin) {
      return translateText([
        "envelopeLimitReached",
        "descriptionNonAdminProTier"
      ]);
    } else if (!isProTier && isSuperAdmin) {
      return translateText([
        "envelopeLimitReached",
        "descriptionAdminFreeTier"
      ]);
    } else {
      return translateText([
        "envelopeLimitReached",
        "descriptionNonAdminFreeTier"
      ]);
    }
  };

  return (
    <BasicModal
      open={showEnvelopeLimitModal}
      onClose={() => setShowEnvelopeLimitModal(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <UpgradeTierContent
        title={translateText(["envelopeLimitReached", "title"])}
        btnLabel={
          isProTier && isSuperAdmin
            ? translateText(["envelopeLimitReached", "contactButton"])
            : translateText(["envelopeLimitReached", "upgradeButton"])
        }
        description={getDescription()}
        buttonStyle={
          isProTier ? ButtonStyle.PRIMARY : ButtonStyle.BLUE_OUTLINED
        }
        onBtnClick={handleUpgradeClick}
        onClose={() => setShowEnvelopeLimitModal(false)}
      />
    </BasicModal>
  );
};

export default EnvelopeLimitModal;
