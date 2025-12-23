import { Box, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";



import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { SortOrderTypes } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { useGetEnvelopeLimitation } from "~community/sign/api/EnvelopeLimitationApi";
import { useGetAllSentEnvelopes, useGetSentEnvelopeStats } from "~community/sign/api/SentApi";
import EnvelopeLimitModal from "~community/sign/components/molecules/EnvelopeLimitModal/EnvelopeLimitModal";
import EnvelopeTable from "~community/sign/components/molecules/EnvelopeTable/EnvelopeTable";
import KPI from "~community/sign/components/molecules/KPI/KPI";
import { useESignStore } from "~community/sign/store/signStore";
import { Envelope } from "~community/sign/types/CommonEsignTypes";
import { EnvelopeStatus, SortOption, SortOptionId, StatusOption, TableHeader, TableHeaderId, TableType } from "~community/sign/types/ESignInboxTypes";
import { usePreserveFilters } from "~community/sign/utils/EnvelopeTableUtils";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";


const Sent = () => {
  const translateText = useTranslator("eSignatureModule", "sent");
  const router = useRouter();
  const theme = useTheme();
  const { isESignSender } = useSessionData();
  const {
    sentDataParams,
    setSentPage,
    setSentSize,
    setSentSortKey,
    setSentSortOrder,
    setSentStatusTypes,
    setSentSearchTerm,
    setShowEnvelopeLimitModal
  } = useESignStore();

  const {
    data: envelopeLimitationData,
    isLoading: isEnvelopeLimitationLoading
  } = useGetEnvelopeLimitation();
  const { data: SentEnvelopeData, isLoading: isSentEnvelopesLoading } =
    useGetAllSentEnvelopes(sentDataParams);
  const { data: sentEnvelopeStats, isLoading: isStatsLoading } =
    useGetSentEnvelopeStats();
  const { setPreserveFilters } = usePreserveFilters({ type: TableType.SENT });
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const envelopes: Envelope[] = SentEnvelopeData?.items || [];

  const tableHeaders: TableHeader[] = [
    {
      id: TableHeaderId.NAME,
      label: translateText(["tableHeaders.documentName"])
    },
    {
      id: TableHeaderId.SENDER,
      label: translateText(["tableHeaders.recipients"])
    },
    {
      id: TableHeaderId.RECEIVED_ON,
      label: translateText(["tableHeaders.createdDate"])
    },
    {
      id: TableHeaderId.EXPIRES_ON,
      label: translateText(["tableHeaders.expireDate"])
    },
    { id: TableHeaderId.STATUS, label: translateText(["tableHeaders.status"]) }
  ];

  const sortOptions: SortOption[] = [
    {
      value: SortOptionId.CREATED_CLOSE,
      label: translateText(["dateSort.createdClose"])
    },
    {
      value: SortOptionId.CREATED_FAR,
      label: translateText(["dateSort.createdFar"])
    }
  ];

  const statusOptions: StatusOption[] = [
    {
      id: EnvelopeStatus.WAITING,
      label: translateText(["documentStatus.waitingForOthers"])
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
      id: EnvelopeStatus.DECLINED,
      label: translateText(["documentStatus.declined"])
    },
    {
      id: EnvelopeStatus.VOIDED,
      label: translateText(["documentStatus.voided"])
    }
  ];

  const handleRowClick = (envelope: Envelope) => {
    setPreserveFilters(true);
    router.push(ROUTES.SIGN.SENT_INFO.ID(envelope.envelopeId));
  };

  const hasSearchOrFilter =
    (sentDataParams.searchKeyword &&
      sentDataParams.searchKeyword.trim() !== "") ||
    (sentDataParams.statusTypes && sentDataParams.statusTypes.trim() !== "");
  const showHeaderButton =
    SentEnvelopeData?.totalItems > 0 || hasSearchOrFilter;

  const handleCreateDocumentClick = () => {
    if (envelopeLimitationData?.limitedReached) {
      setShowEnvelopeLimitModal(true);
    } else {
      router.push(ROUTES.SIGN.CREATE_DOCUMENT);
    }
  };

  useEffect(() => {
    if (
      !isSentEnvelopesLoading &&
      !isStatsLoading &&
      !isEnvelopeLimitationLoading &&
      isInitialLoading
    ) {
      setIsInitialLoading(false);
    }
  }, [isSentEnvelopesLoading, isStatsLoading, isEnvelopeLimitationLoading]);

  useGoogleAnalyticsEvent({
    onMountEventType: GoogleAnalyticsTypes.GA4_ESIGN_SENT_VIEWED,
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
        primaryButtonText={
          showHeaderButton && isESignSender
            ? translateText(["createDoc"])
            : false
        }
        onPrimaryButtonClick={handleCreateDocumentClick}
        customRightContent={
          showHeaderButton && isESignSender && envelopeLimitationData ? (
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
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "2rem"
            }}
          >
            <KPI
              count={sentEnvelopeStats?.WAITING}
              title={translateText(["kpiTitles.waiting"])}
              iconName={IconName.DOTTED_CLOCK_ICON}
            />
            <KPI
              count={sentEnvelopeStats?.COMPLETED}
              title={translateText(["kpiTitles.completed"])}
              iconName={IconName.CHECK_CIRCLE_OUTLINE_ICON}
            />
          </Box>

          <EnvelopeTable
            pageTitle="sent"
            onRowClick={handleRowClick}
            showEmptyTableCreateButton={!showHeaderButton}
            isLoading={isSentEnvelopesLoading}
            // Data
            isInboxTable={false}
            envelopes={envelopes}
            tableHeaders={tableHeaders}
            sortOptions={sortOptions}
            statusOptions={statusOptions}
            sentDataParams={sentDataParams}
            // Pagination
            currentSortOption={
              sentDataParams.sortOrder === SortOrderTypes.DESC
                ? SortOptionId.CREATED_CLOSE
                : SortOptionId.CREATED_FAR
            }
            currentPage={SentEnvelopeData?.currentPage || 0}
            itemsPerPage={sentDataParams.size}
            totalItems={SentEnvelopeData?.totalItems}
            totalPages={SentEnvelopeData?.totalPages}
            searchTerm={sentDataParams.searchKeyword}
            // Setters
            setSearchTerm={setSentSearchTerm}
            setPage={setSentPage}
            setSize={setSentSize}
            setSortKey={setSentSortKey}
            setSortOrder={setSentSortOrder}
            setStatusTypes={setSentStatusTypes}
          />
        </>
      </ContentLayout>
      {/* Envelope Limit Modal */}
      <EnvelopeLimitModal />
    </>
  );
};

export default Sent;