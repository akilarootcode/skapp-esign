import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import KebabMenu from "~community/common/components/molecules/KebabMenu/KebabMenu";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { theme } from "~community/common/theme/theme";
import { useSetDocumentCookies } from "~community/sign/api/CloudFrontApi";
import { useDownloadEnvelopeSignatureCertificate } from "~community/sign/api/EnvelopeApi";
import { useGetInboxEnvelopeAuditLogs } from "~community/sign/api/InboxApi";
import { useGetInboxDetailsById } from "~community/sign/api/SentApi";
import DocumentPreview from "~community/sign/components/molecules/DocumentPreview/DocumentPreview";
import MessageInfo from "~community/sign/components/molecules/MessageInfo/MessageInfo";
import { Recipients } from "~community/sign/components/molecules/Recipients/Recipients";
import Timeline from "~community/sign/components/molecules/Timeline/Timeline";
import {
  COMMON_ERROR_UNAUTHORIZED_ACCESS,
  ENVELOPE_DETAILS_HEIGHT_OFFSET,
  RECIPIENT_STATUS
} from "~community/sign/constants";
import { RedirectStatus } from "~community/sign/enums/CommonEnums";
import useDocumentViewer from "~community/sign/hooks/useDocumentViewer";
import { EnvelopeDocumentDetails } from "~community/sign/types/CommonEsignTypes";
import { SignType } from "~community/sign/types/ESignFormTypes";
import { GetEnvelopeStatusIcon } from "~community/sign/utils/envelopeStatusUtils";
import { downloadPdfFile } from "~community/sign/utils/fileHandlingUtils";
import { getTimelineItemsFromAuditLogs } from "~community/sign/utils/timelineUtils";

const EnvelopeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const translateText = useTranslator("eSignatureModule", "envelopeDetails");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "pages",
    "envelopeDetails"
  );
  const { openDocument } = useDocumentViewer();
  const { setToastMessage } = useToast();

  const { mutate: setInternalDocumentCookies } = useSetDocumentCookies();

  const {
    data: inboxDetails,
    isLoading: isInboxDetailsLoading,
    isError,
    error
  } = useGetInboxDetailsById(Number(id));
  const { data: auditLogs, isLoading: isAuditLogsLoading } =
    useGetInboxEnvelopeAuditLogs(Number(id));

  const { mutate: downloadSignatureCertificate } =
    useDownloadEnvelopeSignatureCertificate(() => {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["downloadHistory.error.title"]),
        description: translateText(["downloadHistory.error.description"])
      });
    });

  const isLoading = isInboxDetailsLoading || isAuditLogsLoading;
  const timelineItems = useMemo(() => {
    if (!auditLogs) return [];
    return getTimelineItemsFromAuditLogs(auditLogs, translateText);
  }, [auditLogs, translateText]);

  const documentsData = useMemo(() => {
    return (
      inboxDetails?.documents?.map((doc: EnvelopeDocumentDetails) => ({
        id: doc.id.toString(),
        title: doc.name,
        pageCount: doc.pageCount || 1,
        filePath: doc.filePath,
        envelopeStatus: inboxDetails.status
      })) || []
    );
  }, [inboxDetails]);

  const handleOpenDocument = (documentId: string) => {
    openDocument(documentId, documentsData);
  };

  const handleDownloadHistoryClick = () => {
    if (!inboxDetails?.subject || !id) return;
    downloadSignatureCertificate(Number(id), {
      onSuccess: (response) => {
        const filename = `${translateText(["downloadHistory.fileName"])} - ${inboxDetails.subject}`;
        downloadPdfFile(response.data, filename);
      }
    });
  };

  useEffect(() => {
    if (
      isError &&
      (error as any)?.response?.data.results[0].messageKey ===
        COMMON_ERROR_UNAUTHORIZED_ACCESS
    ) {
      router.push(ROUTES.AUTH.UNAUTHORIZED);
    }
  }, [isError, error, router]);

  const menuItems = [
    {
      id: "download-history",
      text: translateText(["kebabOptions.downloadHistory"]),
      onClickHandler: handleDownloadHistoryClick
    }
  ];

  const kebabMenuComponent = (
    <KebabMenu
      id="envelope-detail-menu"
      menuItems={menuItems}
      ariaLabel={translateText(["areaLabels.kebabMenu"])}
      menuAlign={{
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "right" }
      }}
      customStyles={{
        wrapper: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }
      }}
    />
  );

  const isParallel = inboxDetails?.signType === SignType.PARALLEL;

  const statusChip = inboxDetails?.status ? (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.text.secondary,
        height: "auto",
        width: "9.25rem",
        borderRadius: "4rem",
        py: "0.75rem",
        px: "1.25rem"
      }}
    >
      {GetEnvelopeStatusIcon(inboxDetails.status)}
      <Typography variant="body2" sx={{ ml: 1 }}>
        {translateText([`status.${inboxDetails.status.toLowerCase()}`])}
      </Typography>
    </Box>
  ) : null;

  const handleSignClick = () => {
    if (inboxDetails?.envelopeAccessLink) {
      window.location.href = inboxDetails.envelopeAccessLink;
    } else {
      // Set CloudFront cookies before navigation for internal users
      setInternalDocumentCookies(undefined, {
        onSuccess: () => {
          const recipientId = inboxDetails?.recipients?.find(
            (recipient: { status: string; addressBook: { id: number } }) =>
              recipient.status === RECIPIENT_STATUS.NEED_TO_SIGN &&
              recipient.addressBook?.id === inboxDetails?.addressBook?.id
          )?.id;

          router.push({
            pathname: ROUTES.SIGN.SIGN,
            query: {
              isInternalUser: true,
              envelopeId: inboxDetails?.id,
              documentId: inboxDetails?.documents[0]?.id,
              recipientId: recipientId
            }
          });
        },
        onError: () => {
          router.push({
            pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
            query: {
              status: RedirectStatus.DOCUMENT_NOT_FOUND,
              isInternalUser: true
            }
          });
        }
      });
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Box component="main">
      <Box
        role="document"
        tabIndex={0}
        id="content-without-drawer-main-content"
      >
        <ContentLayout
          pageHead={translateText(["pageHead"])}
          title={inboxDetails?.subject}
          titleAddon={statusChip}
          isBackButtonVisible
          onBackClick={() => router.push(ROUTES.SIGN.INBOX)}
          isDividerVisible={false}
          customRightContent={kebabMenuComponent}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flex: 1,
                height: `calc(100vh - ${ENVELOPE_DETAILS_HEIGHT_OFFSET}px)`
              }}
            >
              <Box
                sx={{
                  flex: "1 1 65%",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  overflow: "auto",
                  height: "100%",
                  "&::-webkit-scrollbar": {
                    display: "none"
                  }
                }}
              >
                <Box
                  sx={{ mb: 4 }}
                  tabIndex={0}
                  role="region"
                  aria-label={translateAria(["detailsSection"])}
                >
                  <Box sx={{ mt: 2, mb: 3 }} aria-hidden={true}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ marginRight: "0.75rem" }}
                    >
                      {translateText(["from"])}
                      <span style={{ marginLeft: "1.9375rem" }}>:</span>
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {inboxDetails?.senderAddressBook?.email}
                    </Typography>
                    {inboxDetails?.message?.trim() !== "" && (
                      <MessageInfo
                        label={translateText(["emailMessage"])}
                        value={inboxDetails?.message}
                      />
                    )}
                  </Box>
                  {inboxDetails?.recipients && (
                    <Recipients
                      recipients={inboxDetails.recipients}
                      showNudgeIcon={false}
                      showSignButton={true}
                      onSignClick={handleSignClick}
                      loggedUserAddressBookId={inboxDetails?.addressBook?.id}
                      isParallel={isParallel}
                    />
                  )}
                </Box>
                <Box sx={{ flex: 1, minHeight: 0 }} tabIndex={0}>
                  <DocumentPreview
                    documents={documentsData}
                    openDocument={handleOpenDocument}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  flex: "1 1 35%",
                  minWidth: 0,
                  maxWidth: "25rem",
                  height: "100%"
                }}
              >
                <Timeline items={timelineItems} />
              </Box>
            </Box>
          </Box>
        </ContentLayout>
      </Box>
    </Box>
  );
};

export default EnvelopeDetail;
