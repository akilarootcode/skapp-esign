import { Box, Divider, Popover, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { EnvelopeStatus } from "~community/sign/types/ESignInboxTypes";
import {
  getActiveFiltersAnnouncement,
  getApplyButtonAriaLabel,
  getFilterButtonDescription,
  getPopoverDescription,
  getResetButtonAriaLabel
} from "~community/sign/utils/EnvelopeTableUtils";

import { Styles } from "./styles";

export type StatusOption = {
  id: EnvelopeStatus;
  label: string;
};

interface EnvelopeTableStatusFilterProps {
  statusOptions: StatusOption[];
  onApplyFilters: (selectedStatuses: string) => void;
  onResetFilters: () => void;
  currentStatusTypes?: string;
}

const EnvelopeTableStatusFilter: React.FC<EnvelopeTableStatusFilterProps> = ({
  statusOptions,
  onApplyFilters,
  onResetFilters,
  currentStatusTypes
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [appliedStatuses, setAppliedStatuses] = useState<EnvelopeStatus[]>([]);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<
    EnvelopeStatus[]
  >([]);
  const isButtonDisabled = tempSelectedStatuses.length === 0;
  const translateText = useTranslator("eSignatureModule", "inbox");
  const translateAria = useTranslator("eSignatureModuleAria", "components");

  useEffect(() => {
    if (currentStatusTypes) {
      const statusArray = currentStatusTypes.split(",") as EnvelopeStatus[];
      setAppliedStatuses(statusArray);
    } else {
      setAppliedStatuses([]);
    }
  }, [currentStatusTypes]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setTempSelectedStatuses([...appliedStatuses]);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusToggle = (statusId: EnvelopeStatus) => {
    setTempSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleApplyFilters = () => {
    setAppliedStatuses(tempSelectedStatuses);
    const transformedStatuses = tempSelectedStatuses.join(",");
    onApplyFilters(transformedStatuses);
    handleClose();
  };

  const handleResetFilters = () => {
    setTempSelectedStatuses([]);
    setAppliedStatuses([]);
    onResetFilters();
    handleClose();
  };

  const handleRemoveAllFilters = () => {
    setTempSelectedStatuses([]);
    setAppliedStatuses([]);
    onResetFilters();
  };

  const theme = useTheme();
  const styles = Styles(theme);
  const open = Boolean(anchorEl);
  const filterCount = appliedStatuses.length;

  return (
    <Box
      sx={styles.filterContainer}
      role="region"
      aria-label={translateAria(["envelopeTableStatusFilter.filterRegion"])}
    >
      {filterCount > 0 && (
        <Button
          label={`${filterCount}`}
          onClick={handleRemoveAllFilters}
          endIcon={IconName.CLOSE_ICON}
          styles={styles.filterChip}
          ariaLabel={getActiveFiltersAnnouncement(
            appliedStatuses,
            statusOptions,
            translateAria
          )}
        />
      )}
      <IconButton
        id="filter-button"
        icon={<Icon name={IconName.FILTER_ICON} />}
        onClick={handleClick}
        buttonStyles={styles.filterButton}
        ariaLabel={getFilterButtonDescription(
          appliedStatuses,
          statusOptions,
          translateAria
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        PaperProps={{
          sx: styles.filterPopover,
          role: "dialog",
          "aria-labelledby": "filter-dialog-title",
          "aria-modal": "true",
          "aria-label": getPopoverDescription(
            tempSelectedStatuses,
            statusOptions,
            translateAria
          )
        }}
      >
        <Box sx={styles.filterPopoverHeader}>
          <Typography
            id="filter-dialog-title"
            variant="body1"
            fontWeight="bold"
          >
            {translateText(["statusFilter.statusHeader"])}
          </Typography>
        </Box>

        <Box
          sx={styles.filterOptionsList}
          role="group"
          aria-labelledby="filter-dialog-title"
        >
          {statusOptions.map((option) => {
            const isSelected = tempSelectedStatuses.includes(option.id);
            const key = isSelected
              ? "envelopeTableStatusFilter.optionSelectedFormat"
              : "envelopeTableStatusFilter.optionUnselectedFormat";

            return (
              <Button
                key={option.id}
                id={`status-option-${option.id}`}
                label={option.label}
                buttonStyle={
                  isSelected ? ButtonStyle.SECONDARY : ButtonStyle.TERTIARY
                }
                size={ButtonSizes.MEDIUM}
                startIcon={
                  isSelected ? (
                    <Icon
                      name={IconName.CHECK_CIRCLE_ICON}
                      fill={theme.palette.primary.dark}
                    />
                  ) : null
                }
                onClick={() => handleStatusToggle(option.id)}
                styles={styles.filterButtonOption}
                ariaLabel={translateAria([key], { status: option.label })}
                aria-pressed={isSelected}
              />
            );
          })}
        </Box>

        <Divider sx={styles.divider} />

        <Box sx={styles.filterPopoverFooter}>
          <Button
            id="reset-filter"
            label={translateText(["statusFilter.resetFilters"])}
            buttonStyle={ButtonStyle.TERTIARY}
            size={ButtonSizes.SMALL}
            onClick={handleResetFilters}
            disabled={isButtonDisabled}
            ariaLabel={getResetButtonAriaLabel(
              isButtonDisabled,
              tempSelectedStatuses,
              translateAria
            )}
          />

          <Button
            id="apply-filter"
            label={translateText(["statusFilter.applyFilters"])}
            buttonStyle={ButtonStyle.PRIMARY}
            size={ButtonSizes.SMALL}
            onClick={handleApplyFilters}
            disabled={isButtonDisabled}
            ariaLabel={getApplyButtonAriaLabel(
              isButtonDisabled,
              tempSelectedStatuses,
              translateAria
            )}
          />
        </Box>
      </Popover>
    </Box>
  );
};

export default EnvelopeTableStatusFilter;
