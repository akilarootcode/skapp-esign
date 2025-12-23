import { Box, Card, CircularProgress, Container, Link as MuiLink, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";



import LocalImage from "~community/common/components/molecules/LocalImage/LocalImage";
import ROUTES from "~community/common/constants/routes";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { ImageName } from "~community/common/types/ImageTypes";
import { formatISODateWithSuffix } from "~community/common/utils/dateTimeUtils";
import { useSetDocumentCookies } from "~community/sign/api/CloudFrontApi";
import { useGetNextNeedToSignEnvelopes } from "~community/sign/api/DocumentApi";
import { useGetInboxDetailsById } from "~community/sign/api/SentApi";
import { COMMON_ERROR_UNAUTHORIZED_ACCESS, NEXT_ENVELOPE_PAGE_SIZE, RECIPIENT_STATUS } from "~community/sign/constants";
import { RedirectStatus } from "~community/sign/enums/CommonEnums";



import NextEnvelopeCard from "../../molecules/NextEnvelopeCard/NextEnvelopeCard";
import NextEnvelopeCardSkeleton from "../../molecules/NextEnvelopeCard/NextEnvelopeCardSkeleton";


interface StatusPageProps {
  iconName: ImageName;
  title: string;
  description: string;
  actionButton?: ReactNode;
  children?: ReactNode;
  iconWidth?: number;
  iconHeight?: number;
}

const StatusPage: React.FC<StatusPageProps> = ({
  iconName,
  title,
  description,
  actionButton,
  children,
  iconWidth = 95,
  iconHeight = 69
}) => {
  const translateText = useTranslator("eSignatureModule", "page");
  const router = useRouter();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentEnvelopeIndex, setCurrentEnvelopeIndex] = useState(0);
  const [allSkipped, setAllSkipped] = useState(false);
  const theme = useTheme();
  const { setToastMessage } = useToast();

  const { status, isInternalUser } = router.query;
  const internalUser = isInternalUser === "true";

  // Only call the hook when status is "completed-document and internalUser is true"
  const {
    data: nextEnvelopes,
    refetch,
    isLoading
  } = useGetNextNeedToSignEnvelopes(
    currentPage,
    NEXT_ENVELOPE_PAGE_SIZE,
    status === RedirectStatus.COMPLETED_DOCUMENT && internalUser
  );

  const { mutate: setInternalDocumentCookies } = useSetDocumentCookies();

  const handleLogoLoad = () => {
    setLogoLoaded(true);
  };

  const handleSkipDocument = async () => {
    if (!nextEnvelopes?.items) return;

    const nextIndex = currentEnvelopeIndex + 1;

    if (nextIndex >= nextEnvelopes.items.length) {
      if (currentPage + 1 < nextEnvelopes.totalPages) {
        setCurrentPage((prev) => prev + 1);
        setCurrentEnvelopeIndex(0);
        await refetch();
      } else {
        setAllSkipped(true);
      }
    } else {
      setCurrentEnvelopeIndex(nextIndex);
    }
  };

  const currentEnvelope = nextEnvelopes?.items?.[currentEnvelopeIndex];
  const {
    data: inboxDetails,
    isLoading: isInboxDetailsLoading,
    isError,
    error
  } = useGetInboxDetailsById(currentEnvelope?.envelopeId);

  const shouldShowNextDocumentSection =
    status === RedirectStatus.COMPLETED_DOCUMENT &&
    internalUser &&
    (isLoading ||
      (nextEnvelopes?.items && nextEnvelopes.items.length > 0 && !allSkipped));

  const handleSignClick = () => {
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
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["signFailed.title"]),
          description: translateText(["signFailed.description"])
        });
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

  const renderContent = () => (
    <>
      <Box
        sx={{
          width: iconWidth,
          height: iconHeight,
          position: "relative",
          mb: 3
        }}
      >
        {!logoLoaded && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            <CircularProgress size={30} />
          </Box>
        )}
        <LocalImage
          name={iconName}
          fill
          priority
          style={{ objectFit: "contain" }}
          alt={translateText(["signatureImageAlt"])}
          onLoad={handleLogoLoad}
        />
      </Box>

      <Typography variant="documentStatusTitle" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Typography variant="body1" sx={{ mb: actionButton ? "1.5rem" : "1rem" }}>
        {description}
      </Typography>

      {actionButton && <Box>{actionButton}</Box>}

      {children}
    </>
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {!shouldShowNextDocumentSection ? (
        <>
          <Card
            sx={{
              width: "100%",
              maxWidth: "40rem",
              p: 6,
              borderRadius: "1rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: `0.063rem solid ${theme.palette.grey[200]}`,
              boxShadow:
                "0rem 3.9375rem 1.125rem 0rem rgba(0, 0, 0, 0.00), 0rem 2.5rem 1rem 0rem rgba(0, 0, 0, 0.01), 0rem 1.4375rem 0.875rem 0rem rgba(0, 0, 0, 0.05), 0rem 0.625rem 0.625rem 0rem rgba(0, 0, 0, 0.09), 0rem 0.1875rem 0.375rem 0rem rgba(0, 0, 0, 0.10)"
            }}
          >
            {renderContent()}
          </Card>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: "2.5rem"
            }}
          >
            <Box sx={{ width: 100, height: 30, position: "relative" }}>
              <LocalImage
                name={ImageName.SKAPP_LOGO}
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
            <Box
              sx={{
                height: "1.5rem",
                width: "1px",
                backgroundColor: theme.palette.divider,
                mr: "12px"
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {translateText(["subHeading"])}
              <Link href="https://skapp.com" passHref>
                <Typography
                  component="a"
                  variant="body2"
                  color="primary.dark"
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    display: "inline"
                  }}
                >
                  {translateText(["subHeadingLink"])}
                </Typography>
              </Link>
            </Typography>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 6,
              textAlign: "center"
            }}
          >
            {renderContent()}
          </Box>

          <Box
            sx={{
              height: "28.875rem",
              width: "2px",
              backgroundColor: theme.palette.divider
            }}
          />

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 7
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="documentStatusTitle" sx={{ mb: 2 }}>
                {translateText(["signAnotherDocument"])}
              </Typography>
              {isLoading ? (
                <NextEnvelopeCardSkeleton />
              ) : (
                currentEnvelope && (
                  <NextEnvelopeCard
                    documentName={currentEnvelope.subject}
                    senderEmail={currentEnvelope.senderEmail}
                    sentDate={formatISODateWithSuffix(currentEnvelope.sentAt)}
                    onSignClick={handleSignClick}
                  />
                )
              )}
              <MuiLink
                component="button"
                variant="caption"
                underline="always"
                color={theme.palette.primary.dark}
                sx={{
                  mt: 1,
                  display: "flex"
                }}
                onClick={handleSkipDocument}
              >
                {translateText(["skipButton"])}
              </MuiLink>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default StatusPage;