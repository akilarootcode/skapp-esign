import {
  Box,
  InputAdornment,
  InputBase,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Popper from "~community/common/components/molecules/Popper/Popper";
import Modal from "~community/common/components/organisms/Modal/Modal";
import {
  ButtonSizes,
  ButtonStyle,
  ToastType
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import { Role } from "~community/people/types/EmployeeTypes";
import {
  useCustodyTransfer,
  useSearchInternalEsignSenders
} from "~community/sign/api/EnvelopeApi";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  envelopeId: number;
}
interface UserType {
  addressBookId: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  userRole: string;
  authPic: string | null;
}
const TransferOwnershipModal = ({ isOpen, onClose, envelopeId }: Props) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "modals",
    "transferOwnership"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const theme = useTheme();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setToastMessage } = useToast();
  const { data: searchResults } = useSearchInternalEsignSenders(searchTerm);
  const { sendEvent } = useGoogleAnalyticsEvent();

  const onSuccess = () => {
    setIsLoading(false);
    setToastMessage({
      open: true,
      toastType: ToastType.SUCCESS,
      title: translateText(["successTitle"]),
      description: translateText(["successMessage"])
    });
    onClose();
  };

  const onError = () => {
    setIsLoading(false);
    setToastMessage({
      open: true,
      toastType: ToastType.ERROR,
      title: translateText(["errorTitle"]),
      description: translateText(["errorMessage"])
    });
  };

  const { mutate: transferCustody } = useCustodyTransfer(
    envelopeId,
    onSuccess,
    onError
  );

  const handleConfirmTransfer = () => {
    sendEvent(GoogleAnalyticsTypes.GA4_ESIGN_ENVELOPE_OWNERSHIP_TRANSFERRED);
    if (!selectedUser) return;
    setIsLoading(true);
    transferCustody(selectedUser.addressBookId);
    setSelectedUser(null);
    onClose();
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    setSearchTerm("");
    setSelectedUser(null);
    onClose();
  };

  const handleUserSelect = (user: UserType) => {
    setSelectedUser(user);
    setSearchTerm("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (selectedUser && e.key === "Backspace") {
      setSelectedUser(null);
      setSearchTerm("");
    }
  };
  const shouldShowPopper = searchTerm.length > 0 && !selectedUser;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) {
      setSearchTerm(e.target.value);
    }
  };

  const translateRole = (role: string): string => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return translateText(["roles.superAdmin"]);
      case Role.ESIGN_ADMIN:
        return translateText(["roles.esignAdmin"]);
      case Role.ESIGN_SENDER:
        return translateText(["roles.esignSender"]);
      default:
        return role;
    }
  };
  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={handleCloseModal}
      title={translateText(["title"])}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography
            variant="label"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {translateText(["selectNewOwner"])}
          </Typography>
          <Box
            ref={searchContainerRef}
            sx={{
              position: "relative",
              gap: "0.5rem",
              display: "flex",
              alignItems: "center",
              paddingLeft: selectedUser ? "1.5rem" : "1rem",
              py: "0.75rem",
              paddingRight: "0.75rem",
              borderRadius: "0.75rem",
              backgroundColor: theme.palette.grey[100]
            }}
          >
            <InputBase
              inputRef={inputRef}
              placeholder={
                selectedUser ? "" : translateText(["searchPlaceholder"])
              }
              fullWidth
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
              startAdornment={
                selectedUser && (
                  <InputAdornment
                    position="start"
                    sx={{ pointerEvents: "none", marginRight: "1rem" }}
                  >
                    <AvatarChip
                      firstName={selectedUser.firstName}
                      lastName={selectedUser.lastName}
                      avatarUrl={selectedUser.authPic || undefined}
                      chipStyles={{ height: "2.5rem" }}
                    />
                  </InputAdornment>
                )
              }
            />
            <Icon
              name={IconName.SEARCH_ICON}
              width="1.25rem"
              height="1.25rem"
            />
            {searchContainerRef.current && shouldShowPopper && (
              <Popper
                open
                anchorEl={searchContainerRef.current}
                position="bottom-start"
                menuType={MenuTypes.SEARCH}
                id="suggestionPopper"
                containerStyles={{
                  width: "100%"
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: "0.75rem",
                    overflowY: "auto",
                    overflowX: "hidden"
                  }}
                >
                  {searchResults?.length === 0 ||
                  searchResults === undefined ? (
                    <Box sx={{ p: "1rem" }}>
                      {translateText(["noUsersFound"])}
                    </Box>
                  ) : (
                    searchResults.map((user: UserType) => (
                      <Box
                        key={user.userId}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: "0.5rem",
                          px: "0.75rem",
                          cursor: "pointer"
                        }}
                        onClick={() => handleUserSelect(user)}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <AvatarChip
                            firstName={user.firstName}
                            lastName={user.lastName}
                            avatarUrl={user.authPic || undefined}
                            chipStyles={{ maxWidth: "fit-content" }}
                          />
                          <Typography variant="body2">
                            {translateRole(user.userRole)}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </Popper>
            )}
          </Box>
        </Stack>
        <Stack spacing={2}>
          <Button
            label={translateText(["confirmBtn"])}
            buttonStyle={ButtonStyle.PRIMARY}
            size={ButtonSizes.LARGE}
            onClick={handleConfirmTransfer}
            isLoading={isLoading}
            endIcon={IconName.RIGHT_ARROW_ICON}
            disabled={!selectedUser}
          />
          <Button
            label={translateText(["cancelBtn"])}
            buttonStyle={ButtonStyle.TERTIARY}
            size={ButtonSizes.LARGE}
            onClick={handleCloseModal}
            disabled={isLoading}
            endIcon={IconName.CLOSE_ICON}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};
export default TransferOwnershipModal;
