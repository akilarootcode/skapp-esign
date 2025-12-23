import { Box } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import FullScreenLoader from "~community/common/components/molecules/FullScreenLoader/FullScreenLoader";
import ROUTES from "~community/common/constants/routes";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { ImageName } from "~community/common/types/ImageTypes";
import {
  useSetDocumentCookies,
  useSetExternalDocumentCookies
} from "~community/sign/api/CloudFrontApi";
import { useCreateAuditLog } from "~community/sign/api/EnvelopeApi";
import {
  useResendDocumentLink,
  useTokenExchange
} from "~community/sign/api/SignApi";
import StatusPage from "~community/sign/components/organisms/StatusPage/StatusPage";
import {
  EnvelopeAction,
  RedirectStatus
} from "~community/sign/enums/CommonEnums";
import { usePdfSignatureHandlers } from "~community/sign/hooks/usePdfSignatureHandlers";
import { useESignStore } from "~community/sign/store/signStore";

interface StatusConfig {
  iconName: ImageName;
  titleKey: string;
  descriptionKey: string;
  showSaveButton?: boolean;
  showSendNewLinkButton?: boolean;
  iconWidth?: number;
  iconHeight?: number;
}

const Document: NextPage = () => {
  const router = useRouter();
  const translateText = useTranslator("eSignatureModule", "page");

  const [isLoading, setIsLoading] = useState(true);
  const [statusConfig, setStatusConfig] = useState<StatusConfig | null>(null);
  const { mutate: createAuditLog } = useCreateAuditLog();
  const { status, uuid, state, envelopeId } = router.query;

  const { setESignToken, eSignToken, documentInfo } = useESignStore();

  const isInternalUser = router.query.isInternalUser === "true";

  const { mutate: setInternalDocumentCookies } = useSetDocumentCookies();
  const { mutate: setExternalDocumentCookies } =
    useSetExternalDocumentCookies();

  const { handleDownload } = usePdfSignatureHandlers(
    documentInfo.documentLinkResponseDto?.url,
    isInternalUser
  );

  useEffect(() => {
    const setCookies = isInternalUser
      ? setInternalDocumentCookies
      : setExternalDocumentCookies;

    setCookies();
  }, [isInternalUser, setInternalDocumentCookies, setExternalDocumentCookies]);

  const { mutate: resendLink } = useResendDocumentLink(
    () => {
      router.push({
        pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
        query: { ...router.query, status: RedirectStatus.UPDATED_LINK }
      });
    },
    () => {
      router.push({
        pathname: ROUTES.SIGN.DOCUMENT_ACCESS,
        query: { ...router.query, status: RedirectStatus.DOCUMENT_NOT_FOUND }
      });
    }
  );

  const { mutate: tokenExchange } = useTokenExchange(
    (tokenData) => {
      if (tokenData) {
        const token = tokenData.token;
        setESignToken(token);

        router.push({
          pathname: ROUTES.SIGN.SIGN,
          query: {
            uuid: uuid,
            state: state
          }
        });

        setIsLoading(false);
      } else {
        setStatusConfig({
          iconName: ImageName.DOCUMENT_NOT_FOUND,
          titleKey: "documentNotFoundLink.title",
          descriptionKey: "documentNotFoundLink.description"
        });
        setIsLoading(false);
      }
    },
    () => {
      setStatusConfig({
        iconName: ImageName.DOCUMENT_NOT_FOUND,
        titleKey: "documentNotFoundLink.title",
        descriptionKey: "documentNotFoundLink.description"
      });
      setIsLoading(false);
    }
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (status) {
      return;
    }

    if (!uuid && !state) {
      if (eSignToken) {
        router.push({
          pathname: ROUTES.SIGN.SIGN
        });
        return;
      }
    }

    if (!uuid || !state) {
      return;
    }

    const exchangeAttempted = { current: false };

    if (!exchangeAttempted.current) {
      exchangeAttempted.current = true;
      const encodedUuid = encodeURIComponent(uuid?.toString() || "");
      const encodedState = encodeURIComponent(state?.toString() || "");

      tokenExchange({ uuid: encodedUuid, state: encodedState });
    }
  }, [router.isReady, uuid, state]);

  useEffect(() => {
    const statusMap: Record<RedirectStatus, StatusConfig | null> = {
      [RedirectStatus.SIGN]: null,
      [RedirectStatus.ALL_DONE]: {
        iconName: ImageName.DOCUMENT_SIGNED,
        titleKey: "allDone.title",
        descriptionKey: "allDone.description",
        showSaveButton: true
      },
      [RedirectStatus.COMPLETED_DOCUMENT]: {
        iconName: ImageName.DOCUMENT_SIGNED,
        titleKey: "completedDocument.title",
        descriptionKey: "completedDocument.description",
        showSaveButton: true
      },
      [RedirectStatus.DECLINED_DOCUMENT]: {
        iconName: ImageName.DOCUMENT_DECLINED,
        titleKey: "declinedDocument.title",
        descriptionKey: "declinedDocument.description",
        iconWidth: 150,
        iconHeight: 187
      },
      [RedirectStatus.EXPIRED_LINK]: {
        iconName: ImageName.DOCUMENT_LINK_EXPIRED,
        titleKey: "expiredLink.title",
        descriptionKey: "expiredLink.description",
        showSendNewLinkButton: true,
        iconWidth: 150,
        iconHeight: 187
      },
      [RedirectStatus.SESSION_EXPIRED]: {
        iconName: ImageName.DOCUMENT_EXPIRED,
        titleKey: "sessionExpired.title",
        descriptionKey: "sessionExpired.description",
        iconWidth: 150,
        iconHeight: 187
      },
      [RedirectStatus.UPDATED_LINK]: {
        iconName: ImageName.PAPER_PLANE,
        titleKey: "updatedLink.title",
        descriptionKey: "updatedLink.description",
        iconWidth: 72,
        iconHeight: 72
      },
      [RedirectStatus.DOCUMENT_NOT_FOUND]: {
        iconName: ImageName.DOCUMENT_NOT_FOUND,
        titleKey: "documentNotFound.title",
        descriptionKey: "documentNotFound.description",
        iconWidth: 150,
        iconHeight: 187
      }
    };

    if (!router.isReady) {
      return;
    }

    if (
      status &&
      status.toString() !== RedirectStatus.SIGN &&
      status.toString() in statusMap
    ) {
      const config = statusMap[status.toString() as RedirectStatus];
      if (config) {
        setStatusConfig(config);
        setIsLoading(false);
      } else {
        setStatusConfig({
          iconName: ImageName.DOCUMENT_NOT_FOUND,
          titleKey: "documentNotFound.title",
          descriptionKey: "documentNotFound.description",
          iconWidth: 150,
          iconHeight: 187
        });
        setIsLoading(false);
      }
      return;
    }

    // Handle invalid status
    if (status && !(status.toString() in statusMap)) {
      setStatusConfig({
        iconName: ImageName.DOCUMENT_NOT_FOUND,
        titleKey: "documentNotFoundLink.title",
        descriptionKey: "documentNotFoundLink.description",
        iconWidth: 150,
        iconHeight: 187
      });
      setIsLoading(false);
    }
  }, [router.isReady, status, router]);

  const handleResendLink = () => {
    if (eSignToken) {
      resendLink({ token: eSignToken });
    }
  };

  const handleDownloadWithAudit = () => {
    handleDownload(() => {
      createAuditLog({
        auditTrailDto: {
          envelopeId: documentInfo.envelopeId,
          action: EnvelopeAction.DOCUMENT_DOWNLOADED,
          recipientId: Number(documentInfo.recipientResponseDto.id)
        },
        isInternalUser: isInternalUser
      });
    }, documentInfo.subject);
  };

  const saveButton = (
    <Button
      label={translateText(["button.saveCopyBtn"])}
      buttonStyle={ButtonStyle.TERTIARY}
      size={ButtonSizes.MEDIUM}
      endIcon={IconName.DOWNLOAD_ICON}
      isStrokeAvailable={true}
      isFullWidth={false}
      styles={{
        height: "2.8125rem",
        padding: "0.75rem 1.25rem"
      }}
      onClick={handleDownloadWithAudit}
    />
  );

  const sendNewLinkButton = (
    <Button
      label={translateText(["button.sendLinkBtn"])}
      buttonStyle={ButtonStyle.PRIMARY}
      size={ButtonSizes.MEDIUM}
      endIcon={IconName.RIGHT_ARROW_ICON}
      isFullWidth={false}
      styles={{
        height: "2.8125rem",
        padding: "0.75rem 1.25rem"
      }}
      onClick={handleResendLink}
    />
  );

  const backToHomeButton = (
    <Button
      label={translateText(["button.backToHomeBtn"])}
      buttonStyle={ButtonStyle.PRIMARY}
      size={ButtonSizes.MEDIUM}
      startIcon={IconName.LEFT_ARROW_ICON}
      isFullWidth={false}
      styles={{
        height: "2.8125rem",
        padding: "0.75rem 1.25rem"
      }}
      onClick={() => {
        router.push(ROUTES.SIGN.INBOX);
      }}
    />
  );

  const getActionButton = (config: StatusConfig) => {
    if (isInternalUser) {
      let actionBtn;

      switch (true) {
        case config.showSaveButton:
          actionBtn = saveButton;
          break;
        case config.showSendNewLinkButton:
          actionBtn = sendNewLinkButton;
          break;
        default:
          actionBtn = null;
      }

      if (actionBtn) {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "1.5rem",
              alignItems: "center"
            }}
          >
            {backToHomeButton}
            {actionBtn}
          </Box>
        );
      }

      return backToHomeButton;
    } else {
      switch (true) {
        case config.showSaveButton:
          return saveButton;
        case config.showSendNewLinkButton:
          return sendNewLinkButton;
        default:
          return undefined;
      }
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (statusConfig) {
    return (
      <StatusPage
        iconName={statusConfig.iconName}
        title={translateText([statusConfig.titleKey])}
        description={translateText([statusConfig.descriptionKey])}
        actionButton={getActionButton(statusConfig)}
        iconWidth={statusConfig.iconWidth}
        iconHeight={statusConfig.iconHeight}
      />
    );
  }

  return null;
};

export default Document;
