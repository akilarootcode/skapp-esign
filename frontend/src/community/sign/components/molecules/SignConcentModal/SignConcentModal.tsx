import { Box } from "@mui/material";

import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { AddressBookUserType } from "~community/sign/enums/CommonDocumentsEnums";

import ExternalUserContent from "./ExternalUserContent";
import InternalUserContent from "./InternalUserContent";

interface SignConcentModalProps {
  onClose: () => void;
  onStart: () => void;
  flow: AddressBookUserType | string | null;
}

const SignConcentModal = ({
  onClose,
  onStart,
  flow = AddressBookUserType.EXTERNAL
}: SignConcentModalProps) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "-0.9375rem",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: ZIndexEnums.LEVEL_2,
        pt: 4
      }}
    >
      {flow === AddressBookUserType.INTERNAL && (
        <InternalUserContent onClose={onClose} onStart={onStart} />
      )}
      {flow === AddressBookUserType.EXTERNAL && (
        <ExternalUserContent onClose={onClose} onStart={onStart} />
      )}
    </Box>
  );
};

export default SignConcentModal;
