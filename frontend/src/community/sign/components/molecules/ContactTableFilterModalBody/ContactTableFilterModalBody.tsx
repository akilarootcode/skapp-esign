import { Box, Divider, Stack, Typography } from "@mui/material";
import { JSX, useEffect, useState } from "react";

import { FilterChipType } from "~community/attendance/types/timeSheetTypes";
import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { ContactFilterTypes } from "~community/sign/enums/ContactEnums";
import { useESignStore } from "~community/sign/store/signStore";

import styles from "./styles";

interface Props {
  onApply: (
    selectedFilters: Record<string, string[]>,
    selectedFilterLabels: string[]
  ) => void;
  onReset: () => void;
}

const ContactTableFilterModalBody = ({
  onApply,
  onReset
}: Props): JSX.Element => {
  const translateText = useTranslator("eSignatureModule", "contact");
  const classes = styles();
  const { contactTableSelectedFilterLabels, contactTableFilters } =
    useESignStore((state) => state);

  const filterLabels = contactTableSelectedFilterLabels;
  const filters = contactTableFilters;

  const filterData = {
    status: [
      {
        label: translateText(["filters.internal"]),
        value: ContactFilterTypes.INTERNAL
      },
      {
        label: translateText(["filters.external"]),
        value: ContactFilterTypes.EXTERNAL
      }
    ]
  };

  const dataAttributeKey: string = "data-value";
  const [selectedFilterLabels, setSelectedFilterLabels] = useState<string[]>(
    []
  );
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const onClickFilter = (category: string, filter: FilterChipType) => {
    const filterLabelIndex = selectedFilterLabels?.findIndex(
      (label) => label === filter?.label
    );
    const filterLabelCopy = [...selectedFilterLabels];
    if (filterLabelIndex < 0) {
      setSelectedFilterLabels([...selectedFilterLabels, filter?.label]);
    } else {
      filterLabelCopy.splice(filterLabelIndex, 1);
      setSelectedFilterLabels(filterLabelCopy);
    }

    const selectedFiltersCopy = { ...selectedFilters };
    if (
      selectedFiltersCopy?.[category] &&
      Array.isArray(selectedFiltersCopy?.[category])
    ) {
      const index = selectedFiltersCopy[category]?.indexOf(filter?.value);
      if (index !== -1) {
        selectedFiltersCopy[category]?.splice(index, 1);
      } else {
        selectedFiltersCopy[category]?.push(filter?.value);
      }
    } else {
      selectedFiltersCopy[category] = [filter?.value];
    }
    setSelectedFilters(selectedFiltersCopy);
  };

  useEffect(() => {
    if (filterLabels?.length > 0) {
      setSelectedFilterLabels(filterLabels);
    }
  }, [filterLabels]);

  useEffect(() => {
    if (Object.keys(filters)?.length > 0) {
      setSelectedFilters(filters);
    }
  }, [filters]);

  return (
    <Box>
      <Box>
        <Typography variant="h5" mb={"1.25rem"}>
          {translateText(["statusFilterTitle"])}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {filterData?.status?.map((status: FilterChipType) => (
            <Button
              key={status?.value}
              isFullWidth={false}
              dataAttr={{ [dataAttributeKey]: status?.value }}
              label={status?.label}
              buttonStyle={
                selectedFilterLabels.includes(status?.label)
                  ? ButtonStyle.SECONDARY
                  : ButtonStyle.TERTIARY
              }
              size={ButtonSizes.MEDIUM}
              onClick={() =>
                onClickFilter("userType", {
                  ...status,
                  value: status?.value?.toUpperCase()
                })
              }
              startIcon={
                selectedFilterLabels.includes(status?.label) ? (
                  <Icon name={IconName.CHECK_CIRCLE_ICON} />
                ) : null
              }
              styles={classes.filterChipButtonStyles}
            />
          ))}
        </Box>
      </Box>
      <Divider />
      <Stack direction="row" spacing="0.75rem" sx={classes.stackStyles}>
        <Button
          styles={classes.buttonStyles}
          label={translateText(["resetBtnTxt"])}
          buttonStyle={ButtonStyle.TERTIARY}
          onClick={onReset}
          disabled={selectedFilterLabels?.length === 0}
          size={ButtonSizes.MEDIUM}
        />
        <Button
          styles={classes.buttonStyles}
          label={translateText(["applyBtnTxt"])}
          buttonStyle={ButtonStyle.PRIMARY}
          onClick={() => onApply(selectedFilters, selectedFilterLabels)}
          ariaLabel={translateText(["applyBtnTxt"])}
          size={ButtonSizes.MEDIUM}
        />
      </Stack>
    </Box>
  );
};

export default ContactTableFilterModalBody;
