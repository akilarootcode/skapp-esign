import { Box } from "@mui/material";
import { JSX } from "react";



import SortRow from "~community/common/components/atoms/SortRow/SortRow";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { SortKeyTypes, SortOrderTypes } from "~community/common/types/CommonTypes";
import { useESignStore } from "~community/sign/store/signStore";


interface Props {
  handleClose: () => void;
  scrollToTop?: () => void;
}

const ContactDataSortMenuItems = ({
  handleClose,
  scrollToTop
}: Props): JSX.Element => {
  const sortKey = useESignStore((state) => state.contactDataParams.sortKey);
  const sortOrder = useESignStore((state) => state.contactDataParams.sortOrder);
  const handleContactDataSort = useESignStore(
    (state) => state.handleContactDataSort
  );

  const translateText = useTranslator("eSignatureModule", "contact");

  return (
    <Box sx={{ backgroundColor: "common.white" }}>
      <SortRow
        text={translateText(["sort.sortAlphabeticalAsc"])}
        selected={
          sortKey === SortKeyTypes.NAME && sortOrder === SortOrderTypes.ASC
        }
        onClick={() => {
          handleContactDataSort("sortKey", SortKeyTypes.NAME);
          handleContactDataSort("sortOrder", SortOrderTypes.ASC);
          handleClose();
          scrollToTop?.();
        }}
      />
      <SortRow
        text={translateText(["sort.sortAlphabeticalDesc"])}
        selected={
          sortKey === SortKeyTypes.NAME && sortOrder === SortOrderTypes.DESC
        }
        onClick={() => {
          handleContactDataSort("sortKey", SortKeyTypes.NAME);
          handleContactDataSort("sortOrder", SortOrderTypes.DESC);
          handleClose();
          scrollToTop?.();
        }}
      />
    </Box>
  );
};

export default ContactDataSortMenuItems;