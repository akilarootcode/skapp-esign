import { Box, Stack, Typography } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { FC, MouseEvent, useEffect } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import IconButton from "~community/common/components/atoms/IconButton/IconButton";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { pascalCaseFormatter } from "~community/common/utils/commonUtil";
import ShowSelectedFilters from "~community/people/components/molecules/ShowSelectedFilters/ShowSelectedFilters";
import ContactTableFilterModal from "~community/sign/components/molecules/ContactTableFilterModal/ContactTableFilterModal";
import { useESignStore } from "~community/sign/store/signStore";

import styles from "./styles";

interface Props {
  filterEl: HTMLElement | null;
  handleFilterClose: (value?: boolean) => void;
  handleFilterClick: (event: MouseEvent<HTMLElement>) => void;
  filterId: string | undefined;
  filterOpen: boolean;
}
const ContactTableFilters: FC<Props> = ({
  filterEl,
  handleFilterClose,
  handleFilterClick,
  filterId,
  filterOpen
}) => {
  const translateText = useTranslator("eSignatureModule", "contact");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "ContactTableFilters"
  );
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const {
    contactTableSelectedFilterLabels,
    contactTableFilters,
    setContactTableSelectedFilterLabels,
    setContactTableFilters,
    resetContactTableParams
  } = useESignStore((state) => state);

  const selectedFilterLabels = contactTableSelectedFilterLabels;

  const removeContactFilters = (label: string) => {
    const employeeSelectedTimesheetFilterLabelsCopy = [...selectedFilterLabels];
    const employeeFilteredLabels =
      employeeSelectedTimesheetFilterLabelsCopy?.filter(
        (itemLabel) => itemLabel !== pascalCaseFormatter(label)
      );
    setContactTableSelectedFilterLabels(employeeFilteredLabels);

    const employeeTimesheetRequestsFiltersCopy: Record<string, string[]> = {
      ...contactTableFilters
    };
    Object.keys(employeeTimesheetRequestsFiltersCopy)?.forEach((category) => {
      const index = employeeTimesheetRequestsFiltersCopy[category]?.indexOf(
        label?.toLocaleUpperCase()
      );
      if (index !== -1) {
        employeeTimesheetRequestsFiltersCopy[category]?.splice(index, 1);
      }
    });
    setContactTableFilters(employeeTimesheetRequestsFiltersCopy);
  };

  const handleResetEmployee = () => {
    handleFilterClose();
    resetContactTableParams();
  };

  const handleApplyEmployee = (
    selectedFilters: Record<string, string[]>,
    selectedFilterLabels: string[]
  ) => {
    setContactTableSelectedFilterLabels(selectedFilterLabels);
    setContactTableFilters(selectedFilters);
    handleFilterClose(selectedFilterLabels.length > 0);
  };

  useEffect(() => {
    return () => {
      resetContactTableParams();
    };
  }, [resetContactTableParams]);

  return (
    <Stack
      sx={classes.stackContainer}
      flexDirection={"row"}
      justifyContent={"space-between"}
    >
      <Box>
        <Stack direction="row" alignItems="center" gap={0.5}>
          {selectedFilterLabels?.length > 0 && (
            <Typography>{translateText(["filterLabel"])}</Typography>
          )}
          <ShowSelectedFilters
            filterOptions={selectedFilterLabels}
            onDeleteIcon={removeContactFilters as (label?: string) => void}
          />
          <IconButton
            icon={<Icon name={IconName.FILTER_ICON} />}
            onClick={handleFilterClick}
            buttonStyles={classes.iconButtonStyles}
            ariaLabel={translateAria(["filterButton"])}
          />
        </Stack>
        <ContactTableFilterModal
          anchorEl={filterEl}
          handleClose={handleFilterClose}
          position="bottom-end"
          id={filterId}
          open={filterOpen}
          onApply={handleApplyEmployee}
          onReset={handleResetEmployee}
        />
      </Box>
    </Stack>
  );
};

export default ContactTableFilters;
