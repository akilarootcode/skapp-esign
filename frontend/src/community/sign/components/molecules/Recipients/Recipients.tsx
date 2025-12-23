import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@mui/material";
import React, { useMemo } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import { ButtonSizes } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";
import { IconName } from "~community/common/types/IconTypes";
import { RECIPIENT_STATUS } from "~community/sign/constants";
import { DocumentUserPrivilege } from "~community/sign/enums/CommonDocumentsEnums";

interface AddressBook {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  profilePic: string;
}

interface Recipient {
  id: number;
  memberRole: DocumentUserPrivilege;
  status: string;
  signingOrder: number;
  color: string;
  addressBook: AddressBook;
}

interface RecipientsProps {
  recipients: Recipient[];
  onNudgeRecipient?: (recipientId: number) => void;
  showNudgeIcon?: boolean;
  onSignClick?: (recipientId: number) => void;
  showSignButton?: boolean;
  loggedUserAddressBookId?: number;
  isParallel?: boolean;
}

export const Recipients: React.FC<RecipientsProps> = ({
  recipients,
  onNudgeRecipient,
  showNudgeIcon = true,
  onSignClick,
  showSignButton = false,
  loggedUserAddressBookId,
  isParallel = false
}) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "inbox",
    "tableHeaders"
  );

  const translateStatus = useTranslator(
    "eSignatureModule",
    "inbox",
    "documentStatus"
  );
  const translateButton = useTranslator(
    "eSignatureModule",
    "inbox",
    "buttonText"
  );

  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "recipients"
  );

  const sortedRecipients = useMemo(() => {
    return [...recipients].sort((a, b) => a.signingOrder - b.signingOrder);
  }, [recipients]);

  const STATUS_CONFIG = {
    [RECIPIENT_STATUS.COMPLETED]: {
      label: translateStatus(["completed"]),
      icon: (
        <Icon
          name={IconName.CHECK_CIRCLE_ICON}
          fill={theme.palette.greens.lightSecondary}
        />
      ),
      chipStyles: {
        backgroundColor: theme.palette.greens.lighter,
        color: theme.palette.greens.darker,
        height: "2rem"
      }
    },
    [RECIPIENT_STATUS.NEED_TO_SIGN]: {
      label: translateStatus(["needToSign"]),
      icon: (
        <Icon
          name={IconName.DOTTED_CLOCK_ICON}
          fill={theme.palette.amber.chipText}
        />
      ),
      chipStyles: {
        backgroundColor: theme.palette.amber.mid,
        color: theme.palette.amber.chipText,
        height: "2rem"
      }
    },
    [RECIPIENT_STATUS.DECLINED]: {
      label: translateStatus(["declined"]),
      icon: (
        <Icon name={IconName.CLOSE_ICON} fill={theme.palette.text.darkerText} />
      ),
      chipStyles: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.text.darkerText,
        height: "2rem"
      }
    }
  };

  const handleNudgeClick = (recipientId: number) => {
    if (onNudgeRecipient) {
      onNudgeRecipient(recipientId);
    }
  };

  const formatRecipientRole = (memberRole: string): string => {
    if (memberRole === DocumentUserPrivilege.CC) {
      return memberRole;
    }

    return memberRole
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Box>
      <Typography variant="h2" component="h2" sx={{ mb: 2 }} aria-hidden={true}>
        {translateText(["recipients"])}
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", border: "none" }}
        aria-label={translateAria(["recipientTable"])}
      >
        <Table sx={{ borderCollapse: "separate", borderSpacing: "0 0.75rem" }}>
          <TableBody>
            {sortedRecipients.map((recipient, index) => {
              const fullName = `${recipient.addressBook.firstName} ${recipient.addressBook.lastName}`;
              const role = formatRecipientRole(recipient.memberRole);
              const status =
                STATUS_CONFIG[recipient.status]?.label || recipient.status;

              const rowAriaLabel = translateAria(["recipientRow"], {
                position: isParallel
                  ? ""
                  : `${translateText(["position"])} ${index + 1}`,
                name: fullName,
                email: recipient.addressBook.email,
                role: role,
                status: status
              });

              return (
                <TableRow
                  key={recipient.id}
                  sx={{
                    backgroundColor: theme.palette.grey[50],
                    "&:focus": {
                      outline: `0.063rem solid ${theme.palette.text.blackText}`
                    },
                    "&:focus-visible": {
                      outline: `0.063rem solid ${theme.palette.text.blackText}`
                    },
                    "& .MuiTableCell-root": {
                      height: "4rem"
                    }
                  }}
                  aria-label={rowAriaLabel}
                  tabIndex={0}
                >
                  {!isParallel && (
                    <TableCell
                      width="5%"
                      sx={{
                        backgroundColor: theme.palette.grey[100],
                        textAlign: "center",
                        verticalAlign: "middle"
                      }}
                      aria-hidden={true}
                    >
                      {index + 1}.
                    </TableCell>
                  )}
                  <TableCell width="25%" aria-hidden={true}>
                    {fullName}
                  </TableCell>
                  <TableCell width="35%" aria-hidden={true}>
                    {recipient.addressBook.email}
                  </TableCell>
                  <TableCell width="15%" aria-hidden={true}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {recipient.memberRole === DocumentUserPrivilege.CC ? (
                        <Icon
                          name={IconName.VIEW_ICON}
                          width="1.5rem"
                          height="1.5rem"
                        />
                      ) : (
                        <Icon name={IconName.SIGN_ICON} />
                      )}
                      {recipient.memberRole === DocumentUserPrivilege.CC
                        ? recipient.memberRole
                        : recipient.memberRole
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                    </Box>
                  </TableCell>
                  <TableCell
                    width="15%"
                    aria-hidden={true}
                    sx={{
                      padding: 0
                    }}
                  >
                    {recipient.status !== RECIPIENT_STATUS.EMPTY &&
                      recipient.status !== RECIPIENT_STATUS.EXPIRED && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          {showSignButton &&
                          recipient.status === RECIPIENT_STATUS.NEED_TO_SIGN &&
                          recipient.addressBook.id ===
                            loggedUserAddressBookId ? (
                            <Button
                              label={translateButton(["sign"])}
                              size={ButtonSizes.SMALL}
                              onClick={() => onSignClick?.(recipient.id)}
                              endIcon={
                                <Icon
                                  name={IconName.SIGNATURE_PEN_ICON}
                                  fill="theme.palette.text.blackText"
                                  height="1rem"
                                  width="1rem"
                                />
                              }
                              styles={{
                                py: "0.5rem",
                                px: "0.75rem",
                                width: "7rem"
                              }}
                              isStrokeAvailable={true}
                              accessibility={{
                                ariaHidden: true
                              }}
                            />
                          ) : (
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexDirection="row"
                              gap={1}
                              sx={{
                                ...STATUS_CONFIG[recipient.status]?.chipStyles,
                                py: "0.5rem",
                                px: "0.75rem",
                                borderRadius: "4rem",
                                width: "auto"
                              }}
                            >
                              {STATUS_CONFIG[recipient.status]?.icon}
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    whiteSpace: "nowrap",
                                    color:
                                      STATUS_CONFIG[recipient.status]
                                        ?.chipStyles.color
                                  }}
                                >
                                  {STATUS_CONFIG[recipient.status]?.label ||
                                    recipient.status}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}
                  </TableCell>
                  <TableCell
                    width="5%"
                    align="right"
                    aria-hidden={true}
                    sx={{ padding: 0 }}
                  >
                    {recipient.status === RECIPIENT_STATUS.NEED_TO_SIGN &&
                      showNudgeIcon && (
                        <IconButton
                          icon={
                            <Icon
                              name={IconName.NUDGE_BELL_ICON}
                              fill={theme.palette.secondary.dark}
                              width="1rem"
                              height="1rem"
                            />
                          }
                          buttonStyles={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.secondary.main,
                            border: `0.125rem solid ${theme.palette.secondary.dark}`,
                            width: "2rem",
                            height: "2rem",
                            padding: "0.125rem",
                            color: theme.palette.primary.dark,
                            minWidth: "auto"
                          }}
                          onClick={() => handleNudgeClick(recipient.id)}
                          aria-label={translateAria(["nudgeRecipient"], {
                            recipientName: `${recipient.addressBook.firstName} ${recipient.addressBook.lastName}`
                          })}
                        />
                      )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
