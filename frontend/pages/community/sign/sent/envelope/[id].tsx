import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import KebabMenu from "~community/common/components/molecules/KebabMenu/KebabMenu";
import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { theme } from "~community/common/theme/theme";
import { useDownloadEnvelopeSignatureCertificate } from "~community/sign/api/EnvelopeApi";
import {
  useGetEnvelopeSenderDetailsById,
  useGetSentEnvelopeAuditLogs,
  useNudgeRecipient
} from "~community/sign/api/SentApi";
import DocumentPreview from "~community/sign/components/molecules/DocumentPreview/DocumentPreview";
import MessageInfo from "~community/sign/components/molecules/MessageInfo/MessageInfo";
import { Recipients } from "~community/sign/components/molecules/Recipients/Recipients";
import Timeline from "~community/sign/components/molecules/Timeline/Timeline";
import TransferOwnershipModal from "~community/sign/components/molecules/TransferOwnershipModal/TransferOwnershipModal";
import VoidEnvelopeModal from "~community/sign/components/molecules/VoidEnvelopeModal/VoidEnvelopeModal";
import {
  COMMON_ERROR_UNAUTHORIZED_ACCESS,
  ENVELOPE_DETAILS_HEIGHT_OFFSET
} from "~community/sign/constants";
import useDocumentViewer from "~community/sign/hooks/useDocumentViewer";
import { EnvelopeDocumentDetails } from "~community/sign/types/CommonEsignTypes";
import { SignType } from "~community/sign/types/ESignFormTypes";
import { EnvelopeStatus } from "~community/sign/types/ESignInboxTypes";
import { GetEnvelopeStatusIcon } from "~community/sign/utils/envelopeStatusUtils";
import { downloadPdfFile } from "~community/sign/utils/fileHandlingUtils";
import { getTimelineItemsFromAuditLogs } from "~community/sign/utils/timelineUtils";

const EnvelopeDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const translateText = useTranslator("eSignatureModule", "envelopeDetails");
  const { setToastMessage } = useToast();
  const { openDocument } = useDocumentViewer();

  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [isTransferOwnershipModalOpen, setIsTransferOwnershipModalOpen] =
    useState(false);

  const {
    data: senderDetails,
    isLoading: isSenderDetailsLoading,
    isError,
    error
  } = useGetEnvelopeSenderDetailsById(Number(id));
  const { data: auditLogs, isLoading: isAuditLogsLoading } =
    useGetSentEnvelopeAuditLogs(Number(id));
  const isLoading = isSenderDetailsLoading || isAuditLogsLoading;
  const timelineItems = useMemo(() => {
    if (!auditLogs) return [];
    return getTimelineItemsFromAuditLogs(auditLogs, translateText);
  }, [auditLogs, translateText]);

  const { mutate: sendNudge } = useNudgeRecipient(
    () => {
      setToastMessage({
        open: true,
        toastType: ToastType.SUCCESS,
        title: translateText(["recipients.nudgeSuccess.title"]),
        description: translateText(["recipients.nudgeSuccess.description"])
      });
    },
    () => {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["recipients.nudgeError.title"]),
        description: translateText(["recipients.nudgeError.description"])
      });
    }
  );

  const { mutate: downloadSignatureCertificate } =
    useDownloadEnvelopeSignatureCertificate(() => {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["downloadHistory.error.title"]),
        description: translateText(["downloadHistory.error.description"])
      });
    });

  const handleNudgeRecipient = (recipientId: number) => {
    sendNudge(recipientId);
  };

  const handleVoidClick = () => {
    setIsVoidModalOpen(true);
  };

  const handleVoidModalClose = () => {
    setIsVoidModalOpen(false);
  };

  const handleTransferOwnershipClick = () => {
    setIsTransferOwnershipModalOpen(true);
  };

  const handleDownloadHistoryClick = () => {
    if (!senderDetails?.subject || !id) return;

    downloadSignatureCertificate(Number(id), {
      onSuccess: (response) => {
        const filename = `${translateText(["downloadHistory.fileName"])} - ${senderDetails.subject}`;
        downloadPdfFile(response.data, filename);
      }
    });
  };

  const handleTransferOwnershipModalClose = () => {
    setIsTransferOwnershipModalOpen(false);
  };

  useEffect(() => {
    if (
      isError &&
      (error as any)?.response?.data.results[0].messageKey ===
        COMMON_ERROR_UNAUTHORIZED_ACCESS
    ) {
      router.push(ROUTES.AUTH.UNAUTHORIZED);
    }
  }, [isError, error]);

  const canVoidEnvelope = senderDetails?.status === EnvelopeStatus.WAITING;

  const isParallel = senderDetails?.signType === SignType.PARALLEL;

  const defaultMenuItems = [
    {
      id: "transfer-ownership",
      text: translateText(["kebabOptions.transferOwnership"]),
      onClickHandler: handleTransferOwnershipClick
    },
    {
      id: "download-history",
      text: translateText(["kebabOptions.downloadHistory"]),
      onClickHandler: handleDownloadHistoryClick
    }
    // Commmented out for future use

    // {
    //   id: "audit-log",
    //   text: translateText(["kebabOptions.auditlog"]),
    //   onClickHandler: () => {}
    // }
  ];

  const menuItems = canVoidEnvelope
    ? [
        {
          id: "void",
          text: translateText(["kebabOptions.void"]),
          onClickHandler: handleVoidClick
        },
        ...defaultMenuItems
      ]
    : defaultMenuItems;

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

  const documentsData = useMemo(() => {
    return (
      senderDetails?.documents?.map((doc: EnvelopeDocumentDetails) => ({
        id: doc.id.toString(),
        title: doc.name,
        pageCount: doc.pageCount || 1,
        filePath: doc.filePath
      })) || []
    );
  }, [senderDetails]);

  const handleOpenDocument = (documentId: string) => {
    openDocument(documentId, documentsData);
  };

  const statusChip = senderDetails?.status ? (
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
      {GetEnvelopeStatusIcon(senderDetails.status)}
      <Typography variant="body2" sx={{ ml: 1 }}>
        {translateText([`status.${senderDetails.status.toLowerCase()}`])}
      </Typography>
    </Box>
  ) : null;

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
          title={senderDetails?.subject}
          titleAddon={statusChip}
          isBackButtonVisible
          onBackClick={() => router.push(ROUTES.SIGN.SENT)}
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
                <Box sx={{ mb: 4, flexShrink: 0 }} role="document">
                  <Box sx={{ mt: 2, mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: "4.375rem",
                          justifyContent: "space-between"
                        }}
                      >
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {translateText(["sentBy"])}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          :
                        </Typography>
                      </Box>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ marginLeft: "1rem" }}
                      >
                        {senderDetails?.addressBook?.email}
                      </Typography>
                    </Box>

                    {senderDetails?.message?.trim() !== "" && (
                      <MessageInfo
                        label={translateText(["emailMessage"])}
                        value={senderDetails?.message}
                      />
                    )}
                  </Box>
                  {senderDetails?.recipients && (
                    <Recipients
                      recipients={senderDetails.recipients}
                      onNudgeRecipient={handleNudgeRecipient}
                      isParallel={isParallel}
                    />
                  )}
                </Box>
                <Box sx={{ flex: 1, minHeight: 0 }} role="document">
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
                tabIndex={-1}
              >
                <Timeline items={timelineItems} />
              </Box>
            </Box>
          </Box>
        </ContentLayout>
        <VoidEnvelopeModal
          isOpen={isVoidModalOpen}
          onClose={handleVoidModalClose}
          envelopeId={Number(id)}
        />
        <TransferOwnershipModal
          isOpen={isTransferOwnershipModalOpen}
          onClose={handleTransferOwnershipModalClose}
          envelopeId={Number(id)}
        />
      </Box>
    </Box>
  );
};

export default EnvelopeDetail;
