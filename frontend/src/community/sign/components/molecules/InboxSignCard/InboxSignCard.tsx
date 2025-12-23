import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";



import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonSizes, ButtonStyle, ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { useSetSignatureCookies } from "~community/sign/api/CloudFrontApi";
import { useAddUpdateMySignatureLink } from "~community/sign/api/InboxApi";
import { MySignatureLinkDto } from "~community/sign/types/CommonEsignTypes";



import UserSignatureManagerModal from "./UserSignatureManagerModal";
import { Styles } from "./styles";


interface InboxSignCardProps {
  hasSignature?: boolean;
  currentSignatureUrl?: string;
  currentSignatureMethod?: string;
  currentUserName?: string;
}

const InboxSignCard: React.FC<InboxSignCardProps> = ({
  hasSignature = false,
  currentSignatureUrl,
  currentSignatureMethod,
  currentUserName
}) => {
  const theme = useTheme();
  const translateText = useTranslator("eSignatureModule", "inbox");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "inboxSignCard"
  );

  const styles = Styles(theme);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingSignature, setIsLoadingSignature] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);

  const { mutate: saveSignature, isPending: isSavingSignature } =
    useAddUpdateMySignatureLink();

  const { mutate: setSignatureCookies } = useSetSignatureCookies();
  const { setToastMessage } = useToast();

  useEffect(() => {
    const setupSignature = async () => {
      if (currentSignatureUrl && !isLoadingSignature) {
        setIsLoadingSignature(true);
        try {
          await new Promise<void>((resolve, reject) => {
            setSignatureCookies(undefined, {
              onSuccess: () => resolve(),
              onError: (error) => reject(error)
            });
          });

          const response = await fetch(currentSignatureUrl, {
            credentials: "include"
          });

          if (response.ok) {
            const blob = await response.blob();
            if (signatureUrl) {
              URL.revokeObjectURL(signatureUrl);
            }
            const imageUrl = URL.createObjectURL(blob);
            setSignatureUrl(imageUrl);
            setSignatureBlob(blob);
          } else {
            if (signatureUrl) {
              URL.revokeObjectURL(signatureUrl);
            }
            setSignatureUrl("");
            setSignatureBlob(null);
          }
        } catch {
          setSignatureUrl("");
          setSignatureBlob(null);
          setToastMessage({
            open: true,
            toastType: ToastType.ERROR,
            title: translateText(["cookies.errorSignatureTitle"]),
            description: translateText(["cookies.errorSignatureDes"]),
            isIcon: true
          });
        } finally {
          setIsLoadingSignature(false);
        }
      } else {
        setSignatureUrl("");
        setSignatureBlob(null);
      }
    };

    if (currentSignatureUrl) {
      setupSignature();
    } else {
      setSignatureUrl("");
      setSignatureBlob(null);
      setIsLoadingSignature(false);
    }
  }, [currentSignatureUrl]);

  useEffect(() => {
    return () => {
      if (signatureUrl) {
        URL.revokeObjectURL(signatureUrl);
      }
    };
  }, [signatureUrl]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSignature = (data: MySignatureLinkDto) => {
    saveSignature(data);
    handleCloseModal();
  };

  const renderSignature = () => {
    if (!currentSignatureUrl) return null;

    if (isLoadingSignature) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "2.5rem"
          }}
        >
          <CircularProgress
            size={20}
            sx={{ color: theme.palette.primary.light }}
          />
        </Box>
      );
    }

    return signatureUrl !== "" ? (
      <img
        src={signatureUrl}
        alt={translateText(["signImgAltText"])}
        style={{
          maxWidth: "100%",
          maxHeight: "2.5rem",
          objectFit: "contain"
        }}
      />
    ) : (
      <Typography variant="kpiValue">-</Typography>
    );
  };

  return (
    <Box
      sx={styles.card}
      tabIndex={0}
      role="group"
      aria-label={
        hasSignature
          ? translateAria(["viewSignatureCard"])
          : translateAria(["addSignatureCard"])
      }
    >
      <Box sx={styles.iconContainer} aria-hidden="true">
        <Icon
          name={IconName.SIGNATURE_ICON}
          width="1.5rem"
          height="1.5rem"
          fill={theme.palette.primary.dark}
        />
      </Box>

      <Box sx={styles.contentContainer}>
        {hasSignature ? (
          <Box>
            <Typography
              variant="body2"
              color={theme.palette.text.neutral}
              aria-hidden="true"
            >
              {translateText(["mySignature"])}
            </Typography>
            <Box sx={{ height: "2.5rem" }} aria-hidden="true">
              {renderSignature()}
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={styles.createSignatureLabel}
            aria-hidden="true"
          >
            {translateText(["createSign"])}
          </Typography>
        )}

        <Button
          id={hasSignature ? "update-signature-button" : "add-signature-button"}
          label={
            hasSignature ? translateText(["view"]) : translateText(["add"])
          }
          ariaLabel={translateAria([
            hasSignature ? "viewSignatureButton" : "addSignatureButton"
          ])}
          buttonStyle={
            hasSignature ? ButtonStyle.TERTIARY_OUTLINED : ButtonStyle.PRIMARY
          }
          size={ButtonSizes.SMALL}
          endIcon={
            <Icon
              name={
                hasSignature ? IconName.RIGHT_ARROW_ICON : IconName.PLUS_ICON
              }
              width="1rem"
              height="1rem"
            />
          }
          accessibility={{
            ariaHidden: true
          }}
          onClick={handleOpenModal}
          isFullWidth={false}
          disabled={isSavingSignature}
        />
      </Box>

      <UserSignatureManagerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSignatureSaved={handleSaveSignature}
        currentSignatureUrl={currentSignatureUrl}
        currentSignatureMethod={currentSignatureMethod}
        currentUserName={currentUserName}
        currentSignatureBlob={signatureBlob}
      />
    </Box>
  );
};

export default InboxSignCard;