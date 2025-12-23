import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import {
  useSetExternalSignatureCookies,
  useSetSignatureCookies
} from "~community/sign/api/CloudFrontApi";
import { DISPLAY_FIELD_STYLES } from "~community/sign/constants";
import {
  DocumentFieldWidths,
  DocumentFieldsIdentifiers
} from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { fetchImageFromCloudFront } from "~community/sign/utils/commonUtils";
import { createActivationKeyDownHandler } from "~community/sign/utils/keyboardEventUtils";

import { styles } from "./styles";

interface SignatureFieldData {
  id: number;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fieldType: string;
  colorCodes: { background: string; border: string };
  signature?: string;
  signatureType?: "image" | "text";
  signatureStyle?: {
    font?: string;
    color?: string;
  };
}

interface SignatureDisplayProps {
  field: SignatureFieldData;
  zoomLevel: number;
  onClick: () => void;
}

const SignatureDisplay: React.FC<SignatureDisplayProps> = ({
  field,
  zoomLevel,
  onClick
}) => {
  const theme = useTheme();
  const classes = styles(theme);
  const translateText = useTranslator("eSignatureModule", "sign");
  const translateAria = useTranslator("eSignatureModuleAria", "components");
  const router = useRouter();
  const isInternalUser = router.query.isInternalUser === "true";
  const isStamp = field.fieldType === DocumentFieldsIdentifiers.STAMP;
  const isInitial = field.fieldType === DocumentFieldsIdentifiers.INITIAL;
  const isImageSignature = field.signatureType !== "text" || isStamp;
  const [shouldExpand, setShouldExpand] = useState(false);
  const [expandedWidth, setExpandedWidth] = useState<number | null>(null);
  const [isSignatureLoading, setIsSignatureLoading] = useState(false);
  const [signatureBlobUrl, setSignatureBlobUrl] = useState<string>("");

  // Use appropriate cookie hooks based on user type
  const { mutate: setInternalSignatureCookies } = useSetSignatureCookies();
  const { mutate: setExternalSignatureCookies } =
    useSetExternalSignatureCookies();

  const { signatureFields, signatureLink, setSignatureFields } =
    useESignStore();

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSignatureFromCloudFront = async () => {
      if (isImageSignature && signatureLink) {
        setIsSignatureLoading(true);
        setSignatureBlobUrl("");

        const blobUrl = await fetchImageFromCloudFront(
          signatureLink,
          isInternalUser,
          (onSuccess, onError) => {
            setInternalSignatureCookies(undefined, {
              onSuccess,
              onError
            });
          },
          (onSuccess, onError) => {
            setExternalSignatureCookies(undefined, {
              onSuccess,
              onError
            });
          }
        );

        if (blobUrl) {
          setSignatureBlobUrl(blobUrl);
        } else {
          setSignatureBlobUrl("");
        }

        setIsSignatureLoading(false);
      } else {
        setSignatureBlobUrl("");
      }
    };

    fetchSignatureFromCloudFront();
  }, [
    signatureLink,
    isImageSignature,
    isInternalUser,
    setInternalSignatureCookies,
    setExternalSignatureCookies
  ]);

  // Cleanup effect for blob URL
  useEffect(() => {
    return () => {
      if (signatureBlobUrl && signatureBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(signatureBlobUrl);
      }
    };
  }, [signatureBlobUrl]);

  useEffect(() => {
    if (isImageSignature && signatureFields) {
      const currentField = signatureFields.find((f) => f.id === field.id);
      if (currentField && currentField.width > DocumentFieldWidths.SIGN) {
        const updatedFields = signatureFields.map((storeField) => {
          if (storeField.id === field.id) {
            return {
              ...storeField,
              width: isInitial
                ? DocumentFieldWidths.INITIAL_AND_STAMP
                : DocumentFieldWidths.SIGN
            };
          }
          return storeField;
        });

        setSignatureFields(updatedFields);
        setShouldExpand(false);
        setExpandedWidth(null);
      }
    }
  }, [
    isImageSignature,
    field.id,
    signatureFields,
    setSignatureFields,
    setShouldExpand,
    setExpandedWidth,
    isInitial
  ]);

  useEffect(() => {
    if (!isImageSignature && field.signature) {
      // Create a temporary span to measure text width
      const span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.fontFamily = field.signatureStyle?.font ?? "inherit";
      span.style.fontSize = `${DISPLAY_FIELD_STYLES.SIGNATURE_FONT_SIZE_REM * zoomLevel}rem`;
      span.style.whiteSpace = "nowrap";
      span.innerText = field.signature;

      document.body.appendChild(span);
      const textWidth = span.offsetWidth;
      document.body.removeChild(span);

      const fieldWidth =
        field.width *
        zoomLevel *
        DISPLAY_FIELD_STYLES.FIELD_WIDTH_ADJUSTMENT_FACTOR;

      const baseFieldWidth = isInitial
        ? DocumentFieldWidths.INITIAL_AND_STAMP
        : DocumentFieldWidths.SIGN;

      const baseRequiredWidth = Math.max(
        textWidth /
          (DISPLAY_FIELD_STYLES.SIGNATURE_TEXT_WIDTH_RATIO * zoomLevel) +
          DISPLAY_FIELD_STYLES.SIGNATURE_TEXT_PADDING * zoomLevel,
        baseFieldWidth
      );

      if (textWidth > fieldWidth) {
        setShouldExpand(true);
        setExpandedWidth(baseRequiredWidth);

        if (
          signatureFields &&
          setSignatureFields &&
          baseRequiredWidth > field.width
        ) {
          const updatedFields = signatureFields.map((storeField) => {
            if (storeField.id === field.id) {
              return {
                ...storeField,
                width: baseRequiredWidth
              };
            }
            return storeField;
          });

          setSignatureFields(updatedFields);
        }
      } else {
        const baseFieldWidth = isInitial
          ? DocumentFieldWidths.INITIAL_AND_STAMP
          : DocumentFieldWidths.SIGN;
        const hasBeenExpanded =
          (signatureFields?.find((f) => f.id === field.id)?.width ?? 0) >
          baseFieldWidth;

        if (hasBeenExpanded && baseRequiredWidth < field.width) {
          setShouldExpand(true);
          setExpandedWidth(baseRequiredWidth);

          if (signatureFields && setSignatureFields) {
            const updatedFields = signatureFields.map((storeField) => {
              if (storeField.id === field.id) {
                return {
                  ...storeField,
                  width: baseRequiredWidth
                };
              }
              return storeField;
            });

            setSignatureFields(updatedFields);
          }
        } else {
          setShouldExpand(false);
          setExpandedWidth(null);
        }
      }
    } else {
      setShouldExpand(false);
      setExpandedWidth(null);
    }
  }, [
    field.signature,
    field.id,
    field.width,
    field.signatureStyle?.font,
    field.fieldType,
    isImageSignature,
    isInitial,
    zoomLevel,
    signatureFields,
    setSignatureFields
  ]);

  const renderImageSignature = useCallback(() => {
    if (field.fieldType === DocumentFieldsIdentifiers.STAMP) {
      return field.signature ? (
        <Image
          src={field.signature}
          alt="Signature"
          fill
          style={{ objectFit: "contain" }}
        />
      ) : (
        <CircularProgress
          sx={{
            color: theme.palette.primary.main
          }}
        />
      );
    }

    if (signatureLink === field.signature) {
      if (isSignatureLoading || !signatureBlobUrl) {
        return (
          <CircularProgress
            sx={{
              color: theme.palette.primary.main
            }}
          />
        );
      }

      return (
        <img
          src={signatureBlobUrl}
          alt="Signature"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            position: "absolute"
          }}
        />
      );
    }

    return field.signature ? (
      <Image
        src={field.signature}
        alt="Signature"
        fill
        style={{ objectFit: "contain" }}
      />
    ) : (
      <CircularProgress
        sx={{
          color: theme.palette.primary.main
        }}
      />
    );
  }, [
    field,
    signatureLink,
    signatureBlobUrl,
    isSignatureLoading,
    theme.palette.primary.main
  ]);

  const renderSignatureContent = useCallback(() => {
    if (isImageSignature) {
      return renderImageSignature();
    }

    return (
      <Typography ref={textRef} sx={classes.textSignature(field, zoomLevel)}>
        {field.signature}
      </Typography>
    );
  }, [
    isImageSignature,
    renderImageSignature,
    textRef,
    classes,
    field,
    zoomLevel
  ]);
  const handleKeyDown = createActivationKeyDownHandler(onClick);

  return (
    <Box
      sx={classes.container(field, zoomLevel, shouldExpand, expandedWidth)}
      role="region"
      aria-label={translateAria(["signatureDisplay", "signatureField"], {
        fieldType: field.fieldType
      })}
    >
      <Box sx={classes.topBorder}>
        <Box sx={classes.leftBorderPiece} />
        <Box sx={classes.rightBorderPiece} />
      </Box>
      <Box sx={classes.labelContainer(zoomLevel)}>
        <Typography variant="caption" sx={classes.label(zoomLevel)}>
          {translateText(["signedBy"])}
        </Typography>
      </Box>
      <Box
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={translateAria(["signatureDisplay", "viewEditSignature"], {
          fieldType: field.fieldType
        })}
        sx={classes.contentContainer(field, zoomLevel)}
      >
        {renderSignatureContent()}
      </Box>
    </Box>
  );
};

export default SignatureDisplay;
