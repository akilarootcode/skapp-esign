import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";

import SearchBox from "~community/common/components/molecules/SearchBox/SearchBox";
import { peopleDirectoryTestId } from "~community/common/constants/testIds";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useGetContactData } from "~community/sign/api/ContactApi";
import ContactTable from "~community/sign/components/molecules/contactTable/ContactTable";
import { useESignStore } from "~community/sign/store/signStore";
import { ContactDataType } from "~community/sign/types/contactTypes";

interface ContactDataProps {
  onRowClick?: (contact: ContactDataType) => void;
}

const ContactData: FC<ContactDataProps> = ({ onRowClick }) => {
  const translateText = useTranslator("eSignatureModule", "contact");

  const [searchTerm, setSearchTerm] = useState("");
  const [contactDataItems, setContactDataItems] = useState<ContactDataType[]>(
    []
  );
  const [isConcatenationDone, setIsConcatenationDone] =
    useState<boolean>(false);

  const {
    data: contactData,
    fetchNextPage,
    isLoading: isContactDataLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage
  } = useGetContactData();

  const { setSearchKeyword } = useESignStore((state) => state);

  useEffect(() => {
    if (contactData?.pages) {
      const contactDataItems = contactData?.pages
        ?.map((page: any) => page?.items)
        ?.flat();
      setContactDataItems(contactDataItems);
      setIsConcatenationDone(true);
    } else if (isFetching && !isContactDataLoading) {
      setIsConcatenationDone(true);
    } else {
      setIsConcatenationDone(false);
    }
  }, [contactData, isContactDataLoading, isFetching, isFetchingNextPage]);

  useEffect(() => {
    setSearchKeyword(searchTerm.trimStart());
  }, [searchTerm, setSearchKeyword]);

  return (
    <Stack gap={"1rem"}>
      <SearchBox
        value={searchTerm}
        setSearchTerm={setSearchTerm}
        placeHolder={translateText(["contactsSearchPlaceholder"])}
        data-testid={peopleDirectoryTestId.searchInput}
        name="contactSearch"
      />
      <ContactTable
        contactData={contactDataItems}
        fetchNextPage={fetchNextPage}
        isFetching={!isConcatenationDone}
        isFetchingNextPage={isFetchingNextPage}
        onSearch={searchTerm?.length > 0}
        hasNextPage={hasNextPage}
        onRowClick={onRowClick}
      />
    </Stack>
  );
};

export default ContactData;
