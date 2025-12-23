import { Box, Typography, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { SortOrderTypes } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { useGetUserPersonalDetails } from "~community/people/api/PeopleApi";
import { useGetEnvelopeLimitation } from "~community/sign/api/EnvelopeLimitationApi";
import {
  useGetAllInbox,
  useGetMySignatureLink,
  useGetNeedToSignEnvelopeCount
} from "~community/sign/api/InboxApi";
import EnvelopeLimitModal from "~community/sign/components/molecules/EnvelopeLimitModal/EnvelopeLimitModal";
import EnvelopeTable from "~community/sign/components/molecules/EnvelopeTable/EnvelopeTable";
import InboxSignCard from "~community/sign/components/molecules/InboxSignCard/InboxSignCard";
import KPI from "~community/sign/components/molecules/KPI/KPI";
import { useESignStore } from "~community/sign/store/signStore";
import { Envelope } from "~community/sign/types/CommonEsignTypes";
import {
  EnvelopeStatus,
  SortOption,
  SortOptionId,
  StatusOption,
  TableHeader,
  TableHeaderId,
  TableType
} from "~community/sign/types/ESignInboxTypes";
import { usePreserveFilters } from "~community/sign/utils/EnvelopeTableUtils";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";

const Inbox = () => {
  const translateText = useTranslator("eSignatureModule", "inbox");
  const router = useRouter();
  const theme = useTheme();
  const { isESignSender } = useSessionData();
  const {
    inboxDataParams,
    setPage,
    setSize,
    setSortKey,
    setSortOrder,
    setStatusTypes,
    setSearchTerm,
    setShowEnvelopeLimitModal
  } = useESignStore();

  const { data: InboxEnvelopeData, isLoading: isInboxLoading } =
    useGetAllInbox(inboxDataParams);
  const envelopes: Envelope[] = InboxEnvelopeData?.items || [];
  const { data: UserData } = useSession();
  const { data: needToSignCount, isLoading: isCountLoading } =
    useGetNeedToSignEnvelopeCount(UserData?.user?.userId || 0);
  const { data: personalData, isLoading: isPersonalDataLoading } =
    useGetUserPersonalDetails();
  const { data: mySignatureData, isLoading: isMySignatureLoading } =
    useGetMySignatureLink();
  const {
    data: envelopeLimitationData,
    isLoading: isEnvelopeLimitationLoading
  } = useGetEnvelopeLimitation();
  const { setPreserveFilters } = usePreserveFilters({ type: TableType.INBOX });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const hasSignature = !!(
    mySignatureData?.mySignatureLink && mySignatureData?.mySignatureMethod
  );

  const handleRowClick = (envelope: Envelope) => {
    setPreserveFilters(true);
    router.push(ROUTES.SIGN.INBOX_INFO.ID(envelope.envelopeId));
  };

  const tableHeaders: TableHeader[] = [
    {
      id: TableHeaderId.NAME,
      label: translateText(["tableHeaders.documentName"])
    },
    {
      id: TableHeaderId.SENDER,
      label: translateText(["tableHeaders.sender"])
    },
    {
      id: TableHeaderId.RECEIVED_ON,
      label: translateText(["tableHeaders.recievedDate"])
    },
    {
      id: TableHeaderId.EXPIRES_ON,
      label: translateText(["tableHeaders.expireDate"])
    },
    { id: TableHeaderId.STATUS, label: translateText(["tableHeaders.status"]) }
  ];

  const sortOptions: SortOption[] = [
    {
      value: SortOptionId.RECEIVED_CLOSE,
      label: translateText(["dateSort.receivedClose"])
    },
    {
      value: SortOptionId.RECEIVED_FAR,
      label: translateText(["dateSort.receivedFar"])
    }
  ];

  const statusOptions: StatusOption[] = [
    {
      id: EnvelopeStatus.NEED_TO_SIGN,
      label: translateText(["documentStatus.needToSign"])
    },
    {
      id: EnvelopeStatus.DECLINED,
      label: translateText(["documentStatus.declined"])
    },
    {
      id: EnvelopeStatus.VOID,
      label: translateText(["documentStatus.voided"])
    },
    {
      id: EnvelopeStatus.COMPLETED,
      label: translateText(["documentStatus.completed"])
    },
    {
      id: EnvelopeStatus.EXPIRED,
      label: translateText(["documentStatus.expired"])
    },
    {
      id: EnvelopeStatus.WAITING,
      label: translateText(["documentStatus.waitingForOthers"])
    }
  ];

  useEffect(() => {
    if (
      !isInboxLoading &&
      !isCountLoading &&
      !isPersonalDataLoading &&
      !isMySignatureLoading &&
      !isEnvelopeLimitationLoading &&
      isInitialLoading
    ) {
      setIsInitialLoading(false);
    }
  }, [
    isInboxLoading,
    isCountLoading,
    isPersonalDataLoading,
    isMySignatureLoading,
    isEnvelopeLimitationLoading
  ]);

  const handleCreateDocumentClick = () => {
    if (envelopeLimitationData?.limitedReached) {
      setShowEnvelopeLimitModal(true);
    } else {
      router.push(ROUTES.SIGN.CREATE_DOCUMENT);
    }
  };

  useGoogleAnalyticsEvent({
    onMountEventType: GoogleAnalyticsTypes.GA4_ESIGN_INBOX_VIEWED,
    triggerOnMount: true
  });

  if (isInitialLoading) {
    return <FullScreenLoader />;
  }
  return (
    <>
      <ContentLayout
        pageHead={translateText(["pageHead"])}
        title={translateText(["title"])}
        primaryButtonText={isESignSender ? translateText(["createDoc"]) : false}
        onPrimaryButtonClick={handleCreateDocumentClick}
        customRightContent={
          isESignSender && envelopeLimitationData ? (
            <Typography
              variant="body2"
              sx={{
                color:
                  envelopeLimitationData.remainingCount === 0
                    ? theme.palette.text.darkerRedText
                    : theme.palette.primary.dark,
                fontSize: "0.875rem",
                marginRight: "1rem",
                display: "flex",
                alignItems: "center",
                order: -1
              }}
            >
              {`${envelopeLimitationData.remainingCount}/${envelopeLimitationData.allocatedCount} ${translateText(["left"])}`}
            </Typography>
          ) : undefined
        }
      >
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "2rem"
            }}
          >
            <KPI
              count={needToSignCount?.needToSignCount ?? 0}
              title={translateText(["kpiTitles.needToSign"])}
              iconName={IconName.SIGNATURE_PEN_ICON}
            />
            <InboxSignCard
              hasSignature={hasSignature}
              currentSignatureUrl={mySignatureData?.mySignatureLink}
              currentSignatureMethod={mySignatureData?.mySignatureMethod}
              currentUserName={`${personalData?.firstName || ""} ${personalData?.lastName || ""}`}
            />
          </Box>

          <EnvelopeTable
            pageTitle="inbox"
            isLoading={isInboxLoading}
            // Data
            envelopes={envelopes}
            tableHeaders={tableHeaders}
            sortOptions={sortOptions}
            statusOptions={statusOptions}
            inboxDataParams={inboxDataParams}
            // Pagination
            currentSortOption={
              inboxDataParams.sortOrder === SortOrderTypes.DESC
                ? SortOptionId.RECEIVED_CLOSE
                : SortOptionId.RECEIVED_FAR
            }
            currentPage={InboxEnvelopeData?.currentPage || 0}
            itemsPerPage={inboxDataParams.size}
            totalItems={InboxEnvelopeData?.totalItems}
            totalPages={InboxEnvelopeData?.totalPages}
            searchTerm={inboxDataParams.searchKeyword}
            // Setters
            setSearchTerm={setSearchTerm}
            setPage={setPage}
            setSize={setSize}
            setSortKey={setSortKey}
            setSortOrder={setSortOrder}
            setStatusTypes={setStatusTypes}
            onRowClick={handleRowClick}
          />
        </>
      </ContentLayout>
      <EnvelopeLimitModal />
    </>
  );
};

export default Inbox;
