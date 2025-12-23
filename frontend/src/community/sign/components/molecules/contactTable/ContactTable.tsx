import { Box } from "@mui/material";
import { type Theme, useTheme } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import { FC, FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

import BasicChip from "~community/common/components/atoms/Chips/BasicChip/BasicChip";
import AvatarChip from "~community/common/components/molecules/AvatarChip/AvatarChip";
import Table from "~community/common/components/molecules/Table/Table";
import { TableNames } from "~community/common/enums/Table";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { AdminTypes, SenderTypes } from "~community/common/types/AuthTypes";
import {
  SortKeyTypes,
  SortOrderTypes
} from "~community/common/types/CommonTypes";
import {
  pascalCaseFormatter,
  testPassiveEventSupport
} from "~community/common/utils/commonUtil";
import ContactTableFilters from "~community/sign/components/molecules/ContactTableFilters/ContactTableFilters";
import { useESignStore } from "~community/sign/store/signStore";
import { ContactDataType } from "~community/sign/types/contactTypes";

import ContactTableSortBy from "../ContactTableSort/ContactTableSortBy";

interface Props {
  contactData: ContactDataType[];
  fetchNextPage: () => void;
  isFetching?: boolean;
  isFetchingNextPage?: boolean;
  onSearch: boolean;
  hasNextPage?: boolean;
  onRowClick?: (contact: ContactDataType) => void;
}

const ContactTable: FC<Props> = ({
  contactData,
  fetchNextPage,
  isFetching,
  isFetchingNextPage,
  onSearch,
  hasNextPage,
  onRowClick
}) => {
  const theme: Theme = useTheme();
  const { data } = useSession();
  const translateText = useTranslator("eSignatureModule", "contact");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "contactTable"
  );

  const isEsignAdminOrSuperAdmin = data?.user.roles?.some((role) =>
    [
      AdminTypes.ESIGN_ADMIN,
      AdminTypes.SUPER_ADMIN,
      SenderTypes.ESIGN_SENDER
    ].includes(role as AdminTypes | SenderTypes)
  );

  const [sortOpen, setSortOpen] = useState<boolean>(false);
  const [sortEl, setSortEl] = useState<null | HTMLElement>(null);
  const [sortType, setSortType] = useState<string>(
    translateText(["sort.AlphabeticalAsc"])
  );
  const [filter, setFilter] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterEl, setFilterEl] = useState<null | HTMLElement>(null);

  const filterByOpen: boolean = filterOpen && Boolean(filterEl);
  const filterId: string | undefined = filterByOpen
    ? "filter-popper"
    : undefined;

  const sortByOpen: boolean = sortOpen && Boolean(sortEl);
  const sortId: string | undefined = sortByOpen ? "sortBy-popper" : undefined;

  const { contactDataParams } = useESignStore((state) => state);

  const listInnerRef = useRef<HTMLDivElement>();
  const supportsPassive = testPassiveEventSupport();

  const handleSortClick = (
    event: MouseEvent<HTMLElement> | FormEvent<HTMLFormElement>
  ): void => {
    setSortEl(event.currentTarget);
    setSortOpen((previousOpen) => !previousOpen);
  };

  const handleFilterClick = (event: MouseEvent<HTMLElement>): void => {
    setFilterEl(event.currentTarget);
    setFilterOpen((previousOpen) => !previousOpen);
  };

  const handleSortClose = (): void => {
    setSortOpen(false);
    scrollToTop();
  };

  const scrollToTop = () => {
    if (listInnerRef.current) {
      listInnerRef.current.scrollTop = 0;
    }
  };

  const tableHeadStyles = {
    borderTopLeftRadius: "0.625rem",
    borderTopRightRadius: "0.625rem"
  };

  const tableHeaderCellStyles = {
    border: "none"
  };

  const tableContainerStyles = {
    borderRadius: "0.625rem",
    overflow: "auto"
  };

  const columns = [
    { field: "name", headerName: translateText(["tableHeaders", "name"]) },
    { field: "email", headerName: translateText(["tableHeaders", "email"]) },
    { field: "phone", headerName: translateText(["tableHeaders", "phone"]) },
    {
      field: "type",
      headerName: translateText(["tableHeaders", "type"])
    }
  ];

  const tableHeaders = columns.map((col) => ({
    id: col.field,
    label: col.headerName
  }));

  const transformToTableRows = () => {
    return contactData?.map((contact: ContactDataType, index: number) => {
      const rowAriaLabel = translateAria(["rowDescription"], {
        rowIndex: index + 1,
        name: `${contact?.firstName} ${contact?.lastName}`,
        email: contact?.email,
        phone: contact?.phone ? `+${contact.phone}` : translateAria(["empty"]),
        type: pascalCaseFormatter(contact?.userType)
      });

      return {
        id: contact?.addressBookId,
        ariaLabel: {
          row: rowAriaLabel
        },
        name: (
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            <AvatarChip
              firstName={contact?.firstName ?? ""}
              lastName={contact?.lastName ?? ""}
              avatarUrl={contact?.authPic}
              isResponsiveLayout={true}
              chipStyles={{ width: "fit-content" }}
            />
          </Box>
        ),
        email: (
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {contact?.email}
          </Box>
        ),
        phone: contact?.phone ? `+${contact.phone}` : "-",
        type: (
          <BasicChip
            label={pascalCaseFormatter(contact?.userType)}
            chipStyles={{
              backgroundColor:
                contact?.userType === "INTERNAL"
                  ? theme.palette.contactUserChip.internal.light
                  : theme.palette.contactUserChip.external.light,
              color:
                contact?.userType === "INTERNAL"
                  ? theme.palette.contactUserChip.internal.dark
                  : theme.palette.contactUserChip.external.dark,
              padding: "0.75rem 1rem"
            }}
            tabIndex={-1}
          />
        )
      };
    });
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;
      if (isNearBottom && !isFetchingNextPage && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;

    if (!isFetchingNextPage && listInnerElement) {
      listInnerElement.addEventListener(
        "touchmove",
        onScroll,
        supportsPassive ? { passive: true } : false
      );

      listInnerElement?.addEventListener(
        "wheel",
        onScroll,
        supportsPassive ? { passive: true } : false
      );

      return () => {
        listInnerElement?.removeEventListener("touchmove", onScroll);
        listInnerElement?.removeEventListener("wheel", onScroll);
      };
    }
  }, [isFetchingNextPage, hasNextPage]);

  useEffect(() => {
    switch (contactDataParams.sortKey) {
      case SortKeyTypes.NAME:
        setSortType(
          contactDataParams.sortOrder === SortOrderTypes.ASC
            ? translateText(["sort.AlphabeticalAsc"])
            : translateText(["sort.AlphabeticalDesc"])
        );
        break;
      default:
        setSortType(translateText(["sort.AlphabeticalAsc"]));
        break;
    }
  }, [contactDataParams.sortKey, contactDataParams.sortOrder, translateText]);

  const handleFilterClose = (value?: boolean): void => {
    setFilterOpen(false);
    if (value) setFilter(true);
    else setFilter(false);
  };

  const handleRowClick = (row: any) => {
    const selectedContact = contactData.find(
      (contact) => contact.addressBookId === row.id
    );
    if (selectedContact && onRowClick) {
      onRowClick(selectedContact);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.grey[100],
        display: "flex",
        flexDirection: "column",
        borderRadius: "0.5rem",
        gap: "0.125rem"
      }}
    >
      <Box ref={listInnerRef}>
        {isEsignAdminOrSuperAdmin ? (
          <Table
            tableName={TableNames.CONTACT}
            headers={tableHeaders}
            rows={transformToTableRows()}
            tableHead={{
              customStyles: {
                row: tableHeadStyles,
                cell: tableHeaderCellStyles
              }
            }}
            tableBody={{
              emptyState: {
                noData: {
                  title:
                    !contactData?.length && onSearch
                      ? translateText(["emptySearchResult", "title"])
                      : !contactData?.length && filter
                        ? translateText(["emptyFilterResult", "title"])
                        : !contactData?.length
                          ? translateText(["emptyContactData", "title"])
                          : undefined,
                  description:
                    !contactData?.length && onSearch
                      ? translateText(["emptySearchResult", "description"])
                      : !contactData?.length && filter
                        ? translateText(["emptyFilterResult", "description"])
                        : !contactData?.length
                          ? translateText(["emptyContactData", "description"])
                          : undefined
                }
              },
              loadingState: {
                skeleton: {
                  rows: 5
                }
              },
              onRowClick: handleRowClick
            }}
            tableFoot={{
              pagination: {
                isEnabled: false
              }
            }}
            customStyles={{
              container: tableContainerStyles,
              wrapper: {
                overflow: "hidden"
              }
            }}
            actionToolbar={{
              firstRow: {
                leftButton: isEsignAdminOrSuperAdmin ? (
                  <ContactTableSortBy
                    sortEl={sortEl}
                    handleSortClose={handleSortClose}
                    scrollToTop={scrollToTop}
                    sortOpen={sortOpen}
                    sortId={sortId}
                    sortType={sortType}
                    handleSortClick={handleSortClick}
                    disabled={contactData?.length === 0}
                  />
                ) : undefined,
                rightButton: isEsignAdminOrSuperAdmin ? (
                  <ContactTableFilters
                    handleFilterClose={handleFilterClose}
                    filterOpen={filterOpen}
                    handleFilterClick={handleFilterClick}
                    filterId={filterId}
                    filterEl={filterEl}
                  />
                ) : undefined
              },
              customStyles: {
                wrapper: {
                  padding: "0rem 1rem"
                }
              }
            }}
            isLoading={isFetching && !isFetchingNextPage}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default ContactTable;
