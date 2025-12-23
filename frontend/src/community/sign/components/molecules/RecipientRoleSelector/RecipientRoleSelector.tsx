import { Box, useTheme } from "@mui/material";
import { MouseEvent, useState } from "react";



import DropDownArrow from "~community/common/assets/Icons/DropdownArrow";
import SignerIcon from "~community/common/assets/Icons/SignerIcon";
import ViewIcon from "~community/common/assets/Icons/ViewIcon";
import IconChip from "~community/common/components/atoms/Chips/IconChip.tsx/IconChip";
import SortRow from "~community/common/components/atoms/SASortRow/SASortRow";
import Popper from "~community/common/components/molecules/Popper/Popper";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { DocumentUserPrivilege } from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";


const RecipientRoleSelector = ({
  recipientId,
  recipientRole
}: {
  recipientId: number;
  recipientRole: DocumentUserPrivilege;
}) => {
  const theme = useTheme();
  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.roles"
  );

  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dropdownItem, _] = useState([
    {
      label: translateText(["signer"]),
      value: DocumentUserPrivilege.SIGNER,
      icon: IconName.SIGN_ICON
    },
    {
      label: translateText(["cc"]),
      value: DocumentUserPrivilege.CC,
      icon: IconName.VIEW_ICON
    }
  ]);

  const [selectedItem, setSelectedItem] = useState(
    recipientRole || DocumentUserPrivilege.SIGNER
  );

  const { recipients, setRecipients, setSignatureFields, signatureFields } =
    useESignStore();

  const closeMenu = (): void => {
    setAnchorEl(null);
    setShowOverlay(false);
  };

  const onSelectOption = (value: DocumentUserPrivilege) => {
    const recipient = recipients.find(
      (recipient) => recipient.id === recipientId
    );
    setSignatureFields(
      signatureFields.filter(
        (signatureField) =>
          signatureField.recipient &&
          signatureField.recipient.addressBookId !== recipient?.addressBookId
      )
    );
    setRecipients(
      recipients.map((recipient) =>
        recipient.id === recipientId
          ? {
              ...recipient,
              userPrivileges: value
            }
          : recipient
      )
    );
    setShowOverlay(false);
  };

  return (
    <>
      <Box>
        <IconChip
          label={
            selectedItem === DocumentUserPrivilege.SIGNER
              ? translateText(["signer"])
              : translateText(["cc"])
          }
          endIcon={<DropDownArrow />}
          icon={
            selectedItem === DocumentUserPrivilege.SIGNER ? (
              <SignerIcon />
            ) : (
              <ViewIcon />
            )
          }
          chipStyles={{
            gap: 2,
            backgroundColor: theme.palette.grey[100],
            paddingX: 2,
            minWidth: "8.75rem"
          }}
          onClick={(event: MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
            setShowOverlay(true);
          }}
        />
      </Box>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(showOverlay)}
        position={"bottom-end"}
        handleClose={() => closeMenu()}
        menuType={MenuTypes.SORT}
        isManager={true}
        disablePortal={true}
        id="popper"
        isFlip={false}
        timeout={300}
        ariaLabel="Recipients"
        containerStyles={{
          maxWidth: "9.375rem"
        }}
      >
        <Box
          sx={{
            backgroundColor: "common.white"
          }}
        >
          {dropdownItem?.map((item) => (
            <SortRow
              key={item?.value}
              text={item?.label}
              selected={selectedItem === item?.value}
              onClick={() => {
                onSelectOption(item?.value);
                setSelectedItem(item?.value);
              }}
              isStartIcon
              startIcon={item.icon}
              showSelectedIcon={false}
            />
          ))}
        </Box>
      </Popper>
    </>
  );
};

export default RecipientRoleSelector;