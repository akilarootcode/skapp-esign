import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Stack, Theme, Typography, useTheme } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";



import Icon from "~community/common/components/atoms/Icon/Icon";
import useDebounce from "~community/common/hooks/useDebounce";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useGetRecipientsForDocuments } from "~community/sign/api/DocumentApi";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { useESignStore } from "~community/sign/store/signStore";
import { FieldResponseDtoList } from "~community/sign/types/CommonEsignTypes";
import {
  ESignAssigneesType,
  ESignSearchBookSuggestionType,
  SignatureFieldData
} from "~community/sign/types/ESignFormTypes";



import RecipientRoleSelector from "../RecipientRoleSelector/RecipientRoleSelector";
import RecipientSearch from "../RecipientSearch/RecipientSearch";


interface RecipientRowDetailsProps {
  recipientData: ESignAssigneesType;
  showDeleteIcon?: boolean;
  showDragIcon?: boolean;
  onDelete: (id: number, addressBookId: number, userId: number) => void;
  shouldFocus?: boolean;
  onFocusHandled?: () => void;
}

const RecipientRowDetails = ({
  recipientData,
  showDeleteIcon = true,
  showDragIcon = false,
  onDelete,
  shouldFocus = false,
  onFocusHandled
}: RecipientRowDetailsProps) => {
  const theme: Theme = useTheme();
  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.recipientDetails"
  );
  const translateAria = useTranslator("eSignatureModuleAria", "components");

  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(
    recipientData?.email || ""
  );
  const [disabled, setDisabled] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    setDocumentControllerModalType,
    setIsDocumentControllerModalOpen,
    setCurrentRecipientInAction,
    currentRecipientInAction,
    externalUser,
    setRecipients,
    recipients,
    isSigningOrderEnabled,
    signatureFields,
    setSignatureFields,
    setCurrentSearchTerm
  } = useESignStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: recipientData.uuid
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: suggestions, isLoading: isSuggestionsPending } =
    useGetRecipientsForDocuments(debouncedSearchTerm);

  const onSearchChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    e.target.value = e.target.value.replace(/^\s+/g, "");
    const newSearchTerm = e.target.value;

    if (newSearchTerm.trim() === "") {
      onDelete(
        recipientData?.id,
        recipientData?.addressBookId as number,
        recipientData?.userId as number
      );
    }

    if (recipientData.addressBookId && recipientData.email !== newSearchTerm) {
      setRecipients(
        recipients.map((recipient) =>
          recipient.id === recipientData.id
            ? {
                ...recipient,
                addressBookId: null,
                userId: null,
                email: "",
                firstName: "",
                lastName: "",
                authPic: null,
                userType: null,
                error: null
              }
            : recipient
        )
      );

      setSignatureFields(
        signatureFields.filter(
          (field: SignatureFieldData | FieldResponseDtoList) =>
            field.recipient?.addressBookId !== recipientData.addressBookId
        )
      );
      setSearchTerm(newSearchTerm);
      setDisabled(false);

      if (newSearchTerm.trim().length > 0) {
        setIsPopperOpen(true);
      } else {
        setIsPopperOpen(false);
      }

      return;
    }

    setSearchTerm(newSearchTerm);

    if (newSearchTerm.trim().length > 0) {
      setIsPopperOpen(true);
    } else {
      setIsPopperOpen(false);
      setRecipients(
        recipients.map((recipient) => {
          if (recipient.id === recipientData.id) {
            return {
              ...recipient,
              addressBookId: null,
              userId: null,
              email: "",
              firstName: "",
              lastName: "",
              authPic: null,
              userType: null,
              error: null
            };
          }
          return recipient;
        })
      );
    }
  };

  const handleFocus = () => {
    if (searchTerm && searchTerm.trim()) {
      const matchingSuggestion = suggestions?.find(
        (suggestion: { email: string }) =>
          suggestion.email?.toLowerCase() === searchTerm.toLowerCase()
      );

      if (matchingSuggestion) {
        onSelectUser(matchingSuggestion);
      } else if (!recipientData.addressBookId) {
        setRecipients(
          recipients.map((recipient) =>
            recipient.id === recipientData.id
              ? {
                  ...recipient,
                  error: translateText(["recipientNotInContacts"])
                }
              : recipient
          )
        );
      }
    }
  };

  const isDuplicate = (email: string) => {
    if (!email?.trim()) return false;

    const matches = recipients.filter(
      (r) => r.email?.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (matches.length > 1) {
      const sortedMatches = [...matches].sort((a, b) => a.id - b.id);
      return sortedMatches[0].id !== recipientData.id;
    }

    return false;
  };

  const onSelectUser = (user: ESignSearchBookSuggestionType) => {
    setIsPopperOpen(false);
    setSearchTerm(user.email);
    setRecipients(
      recipients.map((recipient) =>
        recipient.id === recipientData.id
          ? {
              ...recipient,
              addressBookId: user.addressBookId,
              userId: user.userId,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              authPic: user.authPic,
              userType: user.userType,
              error:
                isDuplicate(user.email) && !isSigningOrderEnabled
                  ? translateText(["duplicateEmailError"])
                  : null
            }
          : recipient
      )
    );
    setDisabled(true);
  };

  const handleBlur = () => {
    if (searchTerm && searchTerm.trim()) {
      const matchingSuggestion = suggestions?.find(
        (suggestion: { email: string }) =>
          suggestion.email?.trim().toLowerCase() ===
          searchTerm.trim().toLowerCase()
      );

      if (matchingSuggestion) {
        onSelectUser(matchingSuggestion);
      }
    }
  };

  useEffect(() => {
    if (recipientData.email && recipientData.email.trim()) {
      const currentError = recipientData.error;
      const duplicateError = translateText(["duplicateEmailError"]);
      const contactError = translateText(["recipientNotInContacts"]);

      const hasDuplicate = isDuplicate(recipientData.email);

      let newError = null;
      if (hasDuplicate && !isSigningOrderEnabled) {
        newError = duplicateError;
      } else if (currentError === contactError) {
        newError = contactError;
      }

      if (currentError !== newError) {
        setRecipients(
          recipients.map((recipient) =>
            recipient.id === recipientData.id
              ? { ...recipient, error: newError }
              : recipient
          )
        );
      }
    }
  }, [
    recipients,
    isSigningOrderEnabled,
    recipientData.id,
    recipientData.email,
    translateText
  ]);

  useEffect(() => {
    if (
      currentRecipientInAction &&
      currentRecipientInAction === recipientData.id &&
      externalUser
    ) {
      setRecipients(
        recipients.map((recipient) =>
          recipient.id === recipientData.id
            ? {
                ...recipient,
                addressBookId: externalUser?.addressBookId,
                userId: externalUser?.userId,
                email: externalUser?.email,
                firstName: externalUser?.firstName,
                lastName: externalUser?.lastName,
                authPic: externalUser?.authPic,
                error: null
              }
            : recipient
        )
      );
      setDisabled(true);
      setSearchTerm(externalUser.email);
      setCurrentRecipientInAction(null);
    }
  }, [externalUser, recipientData.id]);

  useEffect(() => {
    if (!recipientData?.email) setDisabled(false);
  }, [recipientData?.email]);

  useEffect(() => {
    if (shouldFocus && searchInputRef.current) {
      // Use setTimeout to ensure the component is fully rendered
      searchInputRef.current?.focus();
      onFocusHandled?.();
    }
  }, [shouldFocus, onFocusHandled]);

  return (
    <Box ref={setNodeRef} style={style} role="listitem">
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4
        }}
        aria-label={translateAria(["recipientRowDetails", "recipient"], {
          id: recipientData.id.toString()
        })}
      >
        {showDragIcon && (
          <Box
            {...listeners}
            {...attributes}
            sx={{
              cursor: "grab",
              touchAction: "none",
              display: "flex",
              alignItems: "center",
              "&:focus-visible": {
                outline: `0.125rem solid ${theme.palette.primary.main}`,
                borderRadius: "0.25rem"
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={translateAria(["recipientRowDetails", "dragToReorder"])}
          >
            <Icon name={IconName.DRAG_ICON} />
          </Box>
        )}
        <Stack
          sx={{
            flexDirection: "row",
            border: `0.0625rem solid ${theme.palette.grey[200]}`,
            borderRadius: "0.5rem",
            minWidth: "47.188rem"
          }}
        >
          {isSigningOrderEnabled && (
            <Box
              sx={{
                borderRight: `0.0625rem solid ${theme.palette.grey[200]}`,
                backgroundColor: theme.palette.grey[100],
                padding: "1.75rem 1.25rem",
                alignContent: "center",
                minWidth: "3.563rem"
              }}
            >
              <Typography>{recipientData.id}.</Typography>
            </Box>
          )}
          <Stack
            sx={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              position: "relative"
            }}
          >
            <Box
              sx={{
                width: "27.1875rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <RecipientSearch
                ref={searchInputRef}
                isPopperOpen={isPopperOpen}
                setIsPopperOpen={setIsPopperOpen}
                placeHolder={translateText(["searchPlaceholder"])}
                onChange={onSearchChange}
                onFocus={handleFocus}
                value={searchTerm}
                onBlur={handleBlur}
                isAutoFocus={shouldFocus}
                suggestions={suggestions}
                isLoading={isSuggestionsPending}
                onSelectUser={onSelectUser}
                error={recipientData.error}
                isErrorTextAvailable={true}
                onAddButtonClick={() => {
                  setIsPopperOpen(false);
                  setIsDocumentControllerModalOpen(true);
                  setCurrentRecipientInAction(recipientData.id);
                  setCurrentSearchTerm(searchTerm);
                  setDocumentControllerModalType(
                    CreateDocumentsModalTypes.ADD_EXTERNAL_USER
                  );
                }}
              />
            </Box>

            <Stack
              sx={{
                justifyContent: "center"
              }}
            >
              <RecipientRoleSelector
                recipientId={recipientData.id}
                recipientRole={recipientData.userPrivileges}
              />
            </Stack>
          </Stack>
        </Stack>
        {showDeleteIcon && (
          <Box
            sx={{
              padding: "1rem",
              backgroundColor: theme.palette.grey[100],
              borderRadius: "6.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "&:focus-visible": {
                outline: `0.125 solid ${theme.palette.primary.main}`
              }
            }}
            onClick={() =>
              onDelete(
                recipientData.id,
                recipientData.addressBookId,
                recipientData.userId
              )
            }
            role="button"
            tabIndex={0}
            aria-label={translateAria([
              "recipientRowDetails",
              "deleteRecipient"
            ])}
          >
            <Icon name={IconName.BIN_ICON} />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default RecipientRowDetails;