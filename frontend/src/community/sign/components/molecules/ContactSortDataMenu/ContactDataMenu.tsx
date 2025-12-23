import { Box } from "@mui/material";
import { JSX } from "react";

import Popper from "~community/common/components/molecules/Popper/Popper";
import { useMediaQuery } from "~community/common/hooks/useMediaQuery";
import {
  MenuTypes,
  PopperAndTooltipPositionTypes
} from "~community/common/types/MoleculeTypes";
import { FilterButtonTypes } from "~community/common/types/filterTypes";
import { JobRole } from "~community/people/types/EmployeeTypes";
import ContactDataSortMenuItems from "~community/sign/components/molecules/ContactDataSortMenuItems/ContactDataSortMenuItems";

interface Props {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  position: PopperAndTooltipPositionTypes;
  menuType: MenuTypes;
  id: string | undefined;
  open: boolean;
  teamData?: { teams: FilterButtonTypes[] | undefined; isTeamLoading: boolean };
  roleData?: { roles: JobRole[] | undefined; isRoleLoading: boolean };
  scrollToTop: () => void;
  teams?: FilterButtonTypes[] | undefined;
  jobFamilies?: FilterButtonTypes[] | undefined;
}

const ContactDataMenu = ({
  anchorEl,
  handleClose,
  position,
  menuType,
  id,
  open,
  scrollToTop
}: Props): JSX.Element => {
  const queryMatches = useMediaQuery();
  const isSmallScreen = queryMatches(`(max-width: 1150px)`);
  return (
    <Popper
      anchorEl={anchorEl}
      open={open}
      position={position}
      menuType={menuType}
      id={id}
      handleClose={handleClose}
      containerStyles={{
        width:
          menuType === MenuTypes.SORT
            ? "16.25rem"
            : isSmallScreen
              ? "23.75rem"
              : "53.125rem",
        height: "5.625rem"
      }}
    >
      <Box>
        <ContactDataSortMenuItems
          handleClose={handleClose}
          scrollToTop={scrollToTop}
        />
      </Box>
    </Popper>
  );
};

export default ContactDataMenu;
