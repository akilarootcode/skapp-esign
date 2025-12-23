import { Box } from "@mui/material";
import { FormEvent, MouseEvent } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import { peopleDirectoryTestId } from "~community/common/constants/testIds";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { MenuTypes } from "~community/common/types/MoleculeTypes";
import ContactDataMenu from "~community/sign/components/molecules/ContactSortDataMenu/ContactDataMenu";

const ContactTableSortBy = ({
  sortEl,
  handleSortClose,
  scrollToTop,
  sortOpen,
  sortId,
  sortType,
  handleSortClick,
  disabled
}: {
  sortEl: HTMLElement | null;
  handleSortClose: () => void;
  scrollToTop: () => void;
  sortOpen: boolean;
  sortId: string | undefined;
  sortType: string;
  handleSortClick: (
    event: MouseEvent<HTMLElement> | FormEvent<HTMLFormElement>
  ) => void;
  disabled: boolean;
}) => {
  const translateText = useTranslator("eSignatureModule", "contact");

  return (
    <Box>
      <Button
        label={translateText(["sortBy"], { sortBy: sortType })}
        buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
        size={ButtonSizes.MEDIUM}
        endIcon={IconName.DROP_DOWN_ICON}
        onClick={handleSortClick}
        disabled={disabled}
        aria-describedby={sortId}
        data-testid={peopleDirectoryTestId.buttons.sortByBtn}
      />
      <ContactDataMenu
        anchorEl={sortEl}
        handleClose={handleSortClose}
        position="bottom-start"
        menuType={MenuTypes.SORT}
        id={sortId}
        open={sortOpen}
        scrollToTop={scrollToTop}
      />
    </Box>
  );
};

export default ContactTableSortBy;
