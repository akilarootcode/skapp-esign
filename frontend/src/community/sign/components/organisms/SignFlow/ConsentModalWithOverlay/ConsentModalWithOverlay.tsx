import { Box } from "@mui/material";
import React, { useEffect } from "react";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { theme } from "~community/common/theme/theme";
import SignConcentModal from "~community/sign/components/molecules/SignConcentModal/SignConcentModal";
import { AddressBookUserType } from "~community/sign/enums/CommonDocumentsEnums";

interface ConsentModalWithOverlayProps {
  isModalOpen: boolean;
  documentInfo: any;
  userType: string | null;
  onClose: () => void;
  onStart: () => void;
}

const ConsentModalWithOverlay: React.FC<ConsentModalWithOverlayProps> = ({
  isModalOpen,
  documentInfo,
  userType,
  onClose,
  onStart
}) => {
  useEffect(() => {
    if (isModalOpen && !documentInfo?.consent) {
      const mainContent = document.getElementById(
        "content-without-drawer-main-content"
      );
      if (mainContent) {
        mainContent.setAttribute("aria-hidden", "true");
      }

      document.body.style.overflow = "hidden";
    } else {
      const mainContent = document.getElementById(
        "content-without-drawer-main-content"
      );
      if (mainContent) {
        mainContent.removeAttribute("aria-hidden");
      }

      document.body.style.overflow = "auto";
    }

    return () => {
      const mainContent = document.getElementById(
        "content-without-drawer-main-content"
      );
      if (mainContent) {
        mainContent.removeAttribute("aria-hidden");
      }
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, documentInfo?.consent]);

  if (!isModalOpen || documentInfo?.consent) {
    return null;
  }

  return (
    <>
      <SignConcentModal
        onClose={onClose}
        onStart={onStart}
        flow={userType ?? AddressBookUserType.EXTERNAL}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: "blur(0.313rem)",
          backgroundColor:
            theme.palette.text.blackText + theme.palette.opacity[20],
          zIndex: ZIndexEnums.DEFAULT
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default ConsentModalWithOverlay;
