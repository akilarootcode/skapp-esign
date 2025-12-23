import {
  Box,
  Divider,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import { DateTime } from "luxon";
import { DragEvent, useEffect, useMemo, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useGetESignConfigs } from "~community/sign/api/ConfigApi";
import {
  DocumentFieldsIdentifiers,
  DocumentUserPrivilege
} from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import {
  ESignAssigneesType,
  ESignFieldColorCodesType
} from "~community/sign/types/ESignFormTypes";

import ReminderModal from "../ReminderModal/ReminderModal";

type props = {
  handlePaletteClick: (
    fieldType: DocumentFieldsIdentifiers,
    selectedUser: string,
    colorCodes: ESignFieldColorCodesType,
    tempUserID: string
  ) => Promise<void>;
  handlePaletteDragStart: (
    fieldType: DocumentFieldsIdentifiers,
    selectedUser: string,
    colorCodes: ESignFieldColorCodesType,
    tempUserID: string,
    setFocusOnField?: boolean
  ) => void;
  onNext: () => void;
  handleBack: () => void;
};

const PDFViewFieldContainer = ({
  handlePaletteClick,
  handlePaletteDragStart,
  onNext,
  handleBack
}: props) => {
  const theme = useTheme();
  const { recipients } = useESignStore();
  const translateText = useTranslator(
    "eSignatureModule",
    "create.defineField.fields"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "PDFViewFieldContainer"
  );

  const [selectedUser, setSelectedUser] = useState<string>(
    recipients[0]?.addressBookId as unknown as string
  );
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [hoveredFieldIndex, setHoveredFieldIndex] = useState<number | null>(
    null
  );
  const [hoveredAutoFieldIndex, setHoveredAutoFieldIndex] = useState<
    number | null
  >(null);
  const handleSaveReminder = () => {};
  const { data: configData } = useGetESignConfigs();
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  const [recipientColorAssignments, setRecipientColorAssignments] = useState<
    { recipientId: string; color: ESignFieldColorCodesType }[] | undefined
  >([]);

  const {
    signatureFields,
    isSigningOrderEnabled,
    setExpirationDate,
    expirationDate,
    setSignatureFields,
    setSelectedRecipient
  } = useESignStore();

  const recipientsColors = theme.palette.recipientsColors;

  useEffect(() => {
    if (configData?.defaultEnvelopeExpireDays && !expirationDate) {
      const defaultExpirationDate = DateTime.now()
        .plus({ days: configData.defaultEnvelopeExpireDays })
        .toISODate();

      if (defaultExpirationDate) {
        setExpirationDate(defaultExpirationDate);
      }
    }
  }, [configData, setExpirationDate, expirationDate]);

  const fillableFields = [
    {
      icon: IconName.SIGNATURE_ICON,
      label: translateText(["signature"]),
      identifier: DocumentFieldsIdentifiers.SIGN
    },
    {
      icon: IconName.INITIALS_ICON,
      label: translateText(["initial"]),
      identifier: DocumentFieldsIdentifiers.INITIAL
    },
    {
      icon: IconName.APPROVED_ICON,
      label: translateText(["approve"]),
      identifier: DocumentFieldsIdentifiers.APPROVE
    },
    {
      icon: IconName.DECLINED_ICON,
      label: translateText(["decline"]),
      identifier: DocumentFieldsIdentifiers.DECLINE
    },
    {
      icon: IconName.STAMP_ICON,
      label: translateText(["stamp"]),
      identifier: DocumentFieldsIdentifiers.STAMP
    }
  ];

  const autoFilledFields = [
    {
      icon: IconName.USER_ICON,
      label: translateText(["name"]),
      identifier: DocumentFieldsIdentifiers.NAME
    },
    {
      icon: IconName.EMAIL_ICON,
      label: translateText(["email"]),
      identifier: DocumentFieldsIdentifiers.EMAIL
    },
    {
      icon: IconName.CALENDAR_ICON,
      label: translateText(["dateSigned"]),
      identifier: DocumentFieldsIdentifiers.DATE
    }
  ];

  const signers = useMemo(() => {
    if (recipients === undefined || recipients.length === 0) {
      return [];
    }

    return recipients?.filter(
      (recipient) => recipient.userPrivileges === DocumentUserPrivilege.SIGNER
    );
  }, [recipients]);

  useEffect(() => {
    if (signers.length > 0) {
      setSelectedRecipient(signers[0]);
      setSelectedUser(String(signers[0].addressBookId));
      setSelectedUserId(signers[0].id.toString());
    }
  }, [signers]);

  const recipientsDropDownList = useMemo(() => {
    if (signers === undefined || signers.length === 0) {
      return [];
    }

    return signers.map((recipient, index) => {
      const colorIndex = index % recipientsColors.length;

      if (
        !recipientColorAssignments?.some(
          (item) => item.recipientId === recipient.uuid
        )
      ) {
        setRecipientColorAssignments((prev) => [
          ...(prev || []),
          {
            recipientId: recipient.uuid,
            color: recipientsColors[colorIndex] as ESignFieldColorCodesType
          }
        ]);
      } else {
        setRecipientColorAssignments((prev) =>
          prev?.map((item) =>
            item.recipientId === recipient.uuid
              ? {
                  ...item,
                  color: recipientsColors[colorIndex]
                }
              : item
          )
        );
      }

      return {
        value: recipient.id,
        label: (
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
              minHeight: "2rem"
            }}
          >
            {isSigningOrderEnabled && (
              <Box sx={{ width: "1.5rem", textAlign: "center" }}>
                <Typography>{index + 1}.</Typography>
              </Box>
            )}
            <Box
              sx={{
                width: "1rem",
                height: "1rem",
                minWidth: "1rem",
                borderRadius: "3.125rem",
                backgroundColor: recipientsColors[colorIndex].border
              }}
            ></Box>

            <Typography
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {recipient.firstName}
            </Typography>
          </Stack>
        )
      };
    });
  }, [recipients, recipientsColors, isSigningOrderEnabled]);

  useEffect(() => {
    if (recipientColorAssignments) {
      const updatedSignatureFields = signatureFields.map((field) => {
        return {
          ...field,
          colorCodes: recipientColorAssignments.find(
            (item) => item.recipientId === field?.recipient?.uuid
          )?.color
        };
      });
      setSignatureFields(updatedSignatureFields);
    }
  }, [recipientColorAssignments, recipients]);

  const handleUserSelect = (e: SelectChangeEvent<string>) => {
    const selectedValue = e.target.value;

    setSelectedRecipient(
      recipients.find(
        (recipient) => String(recipient?.id) === String(selectedValue)
      ) as ESignAssigneesType
    );

    setSelectedUser(
      recipients.find(
        (recipient) => String(recipient?.id) === String(selectedValue)
      )?.addressBookId as unknown as string
    );
    setSelectedUserId(selectedValue);
  };

  const dropDownListValue = useMemo(() => {
    if (selectedUserId) {
      return Number(selectedUserId);
    }

    return recipientsDropDownList?.length > 0
      ? recipientsDropDownList[0]?.value
      : "";
  }, [recipientsDropDownList, selectedUserId]);

  const selectedUserIndex = useMemo(() => {
    return recipientsDropDownList.findIndex(
      (recipient) => recipient?.value === dropDownListValue
    );
  }, [dropDownListValue, recipientsDropDownList]);

  const selectedUserColor = useMemo(() => {
    return selectedUserIndex !== -1
      ? recipientsColors[selectedUserIndex % recipientsColors.length].border
      : "common.black";
  }, [recipientsColors, selectedUserIndex]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[50],
        border: `0.0625rem solid ${theme.palette.grey[200]}`,
        height: "100%",
        width: "25%",
        borderRadius: "0.75rem",
        padding: "1rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <Stack gap={2}>
          <Button
            label={translateText(["buttonLabel"])}
            buttonStyle={ButtonStyle.SECONDARY}
            size={ButtonSizes.MEDIUM}
            startIcon={IconName.SETTINGS_ICON}
            onClick={() => setIsReminderModalOpen(true)}
          />
          <Divider sx={{ mb: 3 }} />
        </Stack>

        <Typography variant="label">{translateText(["recipients"])}</Typography>

        <DropdownList
          inputName={"user"}
          onChange={handleUserSelect}
          value={dropDownListValue}
          itemList={recipientsDropDownList}
          paperStyles={{
            border: `0.063rem solid ${selectedUserColor}`
          }}
          inputStyle={{
            border: `0.063rem solid ${selectedUserColor}`,
            mb: 2
          }}
          ariaLabel={translateAria(["recipientsDropdown"])}
        />

        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ mb: 1, fontSize: "1rem", fontWeight: 500 }}>
          {translateText(["fields"])}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {translateText(["fillableFields"])}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            mb: 3
          }}
        >
          {fillableFields.map((field, index) => (
            <Box
              draggable
              data-field-type={field.identifier}
              onDragStart={(e: DragEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                handlePaletteDragStart(
                  field.identifier,
                  selectedUser,
                  {
                    background:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.background,
                    border:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.border
                  },
                  selectedUserId,
                  true
                );
              }}
              onClick={() =>
                handlePaletteClick(
                  field.identifier,
                  selectedUser,
                  {
                    background:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.background,
                    border:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.border
                  },
                  selectedUserId
                )
              }
              onMouseEnter={() => setHoveredFieldIndex(index)}
              onMouseLeave={() => setHoveredFieldIndex(null)}
              key={index}
              component="button"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                backgroundColor: theme.palette.common.white,
                border: `0.063rem solid ${theme.palette.grey[200]}`,
                borderRadius: "0.5rem",
                transition: "background-color 0.2s",
                "&:hover": {
                  border: `0.063rem solid ${theme.palette.secondary.dark}`,
                  backgroundColor: theme.palette.secondary.main,
                  cursor: "grab",
                  "& .MuiTypography-root": {
                    color: theme.palette.secondary.dark
                  }
                },
                "&:focus-visible": {
                  backgroundColor: theme.palette.grey[50],
                  cursor: "grab"
                }
              }}
            >
              <Icon
                name={field.icon}
                fill={
                  hoveredFieldIndex === index
                    ? theme.palette.secondary.dark
                    : theme.palette.grey[400]
                }
              />

              <Typography
                sx={{
                  marginTop: 1,
                  fontSize: "0.875rem",
                  color: theme.palette.text.secondary
                }}
              >
                {field.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {translateText(["autoFilledFields"])}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2
          }}
        >
          {autoFilledFields.map((field, index) => (
            <Box
              draggable
              data-field-type={field.identifier}
              onDragStart={(e: DragEvent<HTMLButtonElement>) =>
                handlePaletteDragStart(
                  field.identifier,
                  selectedUser,
                  {
                    background:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.background,
                    border:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.border
                  },
                  selectedUserId,
                  true
                )
              }
              onClick={() =>
                handlePaletteClick(
                  field.identifier,
                  selectedUser,
                  {
                    background:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.background,
                    border:
                      recipientsColors[
                        selectedUserIndex % recipientsColors.length
                      ]?.border
                  },
                  selectedUserId
                )
              }
              onMouseEnter={() => setHoveredAutoFieldIndex(index)}
              onMouseLeave={() => setHoveredAutoFieldIndex(null)}
              key={index}
              component="button"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                backgroundColor: theme.palette.common.white,
                border: `0.063rem solid ${theme.palette.grey[200]}`,
                borderRadius: "0.5rem",
                transition: "background-color 0.2s",
                "&:hover": {
                  border: `0.063rem solid ${theme.palette.secondary.dark}`,
                  backgroundColor: theme.palette.secondary.main,
                  cursor: "grab",
                  "& .MuiTypography-root": {
                    color: theme.palette.secondary.dark
                  }
                }
              }}
            >
              <Icon
                name={field.icon}
                fill={
                  hoveredAutoFieldIndex === index
                    ? theme.palette.secondary.dark
                    : theme.palette.grey[400]
                }
              />
              <Typography
                sx={{
                  marginTop: 1,
                  fontSize: "0.875rem",
                  color: theme.palette.text.secondary
                }}
              >
                {field.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Stack gap={1} sx={{ mt: 4 }}>
        <Button
          label={translateText(["nextBtnLabel"])}
          buttonStyle={ButtonStyle.PRIMARY}
          size={ButtonSizes.LARGE}
          endIcon={IconName.RIGHT_ARROW_ICON}
          onClick={onNext}
        />
        <Button
          label={translateText(["backBtnLabel"])}
          buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
          size={ButtonSizes.LARGE}
          startIcon={IconName.LEFT_ARROW_ICON}
          onClick={handleBack}
        />
      </Stack>
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={handleSaveReminder}
        defaultExpirationDays={configData?.defaultEnvelopeExpireDays}
        dateFormat={configData?.dateFormat}
      />
    </Box>
  );
};

export default PDFViewFieldContainer;
