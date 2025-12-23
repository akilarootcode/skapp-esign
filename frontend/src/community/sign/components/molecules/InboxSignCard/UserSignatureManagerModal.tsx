import { Box, Stack } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Modal from "~community/common/components/organisms/Modal/Modal";
import {
  ButtonSizes,
  ButtonStyle,
  ToastType
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { IconName } from "~community/common/types/IconTypes";
import { FileCategories } from "~community/common/types/s3Types";
import {
  deleteFileFromS3,
  uploadFileToS3ByUrl
} from "~community/common/utils/awsS3ServiceFunctions";
import {
  FONT_COLORS,
  FONT_STYLES,
  SignatureData
} from "~community/sign/constants";
import {
  MySignatureMethods,
  SignatureTabType
} from "~community/sign/enums/CommonEnums";
import { MySignatureLinkDto } from "~community/sign/types/CommonEsignTypes";
import {
  CurrentSignatureState,
  InitialSignatureState,
  detectSignatureChanges,
  prepareSignatureForUpload
} from "~community/sign/utils/signatureUtils";

import { DrawSignature } from "../../organisms/SignFlow/DrawSignature/DrawSignature";
import { SignatureTabs } from "../../organisms/SignFlow/SignatureTabs/SignatureTabs";
import { TypeSignature } from "../../organisms/SignFlow/TypeSignature/TypeSignature";
import { UploadSignature } from "../../organisms/SignFlow/UploadSignature/UploadSignature";

interface UserSignatureManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureSaved: (signatureData: MySignatureLinkDto) => void;
  currentSignatureUrl?: string;
  currentFontFamily?: string;
  currentFontColor?: string;
  currentSignatureMethod?: string;
  currentUserName?: string;
  currentSignatureBlob?: Blob | null;
}

const UserSignatureManagerModal: React.FC<UserSignatureManagerProps> = ({
  isOpen,
  onClose,
  onSignatureSaved,
  currentSignatureUrl,
  currentSignatureMethod,
  currentUserName,
  currentSignatureBlob
}) => {
  const translateText = useTranslator(
    "eSignatureModule",
    "inbox",
    "signatureModal"
  );

  const [activeTab, setActiveTab] = useState<SignatureTabType>(
    SignatureTabType.TYPE
  );
  const [typedSignature, setTypedSignature] = useState({
    name: currentUserName || "",
    font: FONT_STYLES[0].value,
    color: FONT_COLORS[0].value
  });
  const [drawnSignature, setDrawnSignature] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const hasFetchedSignatureRef = useRef<boolean>(false);

  const { setToastMessage } = useToast();

  const getCurrentSignature = useCallback((): SignatureData => {
    switch (activeTab) {
      case SignatureTabType.TYPE:
        return {
          value: typedSignature.name,
          type: "text",
          style: {
            font: typedSignature.font,
            color: typedSignature.color
          }
        };
      case SignatureTabType.DRAW:
        return {
          value: drawnSignature || "",
          type: "image"
        };
      case SignatureTabType.UPLOAD:
        return {
          value: uploadedSignature || "",
          type: "image"
        };
      default:
        return {
          value: "",
          type: "text",
          style: {
            font: FONT_STYLES[0].value,
            color: FONT_COLORS[0].value
          }
        };
    }
  }, [activeTab, typedSignature, drawnSignature, uploadedSignature]);

  const getInitialActiveTab = useCallback((): SignatureTabType => {
    if (!currentSignatureMethod) return SignatureTabType.TYPE;

    switch (currentSignatureMethod) {
      case MySignatureMethods.TYPE:
        return SignatureTabType.TYPE;
      case MySignatureMethods.DRAW:
        return SignatureTabType.DRAW;
      case MySignatureMethods.UPLOAD:
        return SignatureTabType.UPLOAD;
      default:
        return SignatureTabType.TYPE;
    }
  }, [currentSignatureMethod]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(getInitialActiveTab());
      hasFetchedSignatureRef.current = false;
    }
  }, [isOpen, getInitialActiveTab, signatureUrl]);

  useEffect(() => {
    if (isOpen && currentSignatureBlob && !hasFetchedSignatureRef.current) {
      const shouldDisplaySignature =
        (activeTab === SignatureTabType.DRAW &&
          currentSignatureMethod === MySignatureMethods.DRAW) ||
        (activeTab === SignatureTabType.UPLOAD &&
          currentSignatureMethod === MySignatureMethods.UPLOAD);

      if (shouldDisplaySignature) {
        const imageUrl = URL.createObjectURL(currentSignatureBlob);
        setSignatureUrl(imageUrl);
        hasFetchedSignatureRef.current = true;
      }
    }
  }, [isOpen, activeTab, currentSignatureMethod, currentSignatureBlob]);

  const initialState = useMemo(
    (): InitialSignatureState => ({
      activeTab: getInitialActiveTab(),
      typedSignature: {
        name: currentUserName || "",
        font: FONT_STYLES[0].value,
        color: FONT_COLORS[0].value
      },
      currentSignatureUrl,
      currentSignatureMethod
    }),
    [
      currentSignatureMethod,
      currentUserName,
      currentSignatureUrl,
      getInitialActiveTab
    ]
  );

  const hasChanges = useMemo(() => {
    const currentState: CurrentSignatureState = {
      activeTab,
      typedSignature,
      drawnSignature,
      uploadedSignature
    };

    return detectSignatureChanges(currentState, initialState);
  }, [
    activeTab,
    typedSignature,
    drawnSignature,
    uploadedSignature,
    initialState
  ]);

  useEffect(() => {
    const valid = (() => {
      switch (activeTab) {
        case SignatureTabType.TYPE:
          return !!typedSignature.name.trim();
        case SignatureTabType.DRAW:
          return !!drawnSignature;
        case SignatureTabType.UPLOAD:
          return !!uploadedSignature;
        default:
          return false;
      }
    })();
    setIsValid(valid);
  }, [typedSignature, drawnSignature, uploadedSignature, activeTab]);

  const handleSaveSignature = async () => {
    if (!isValid) return;

    try {
      setIsUploading(true);
      const currentSignature = getCurrentSignature();

      const signatureFile = await prepareSignatureForUpload(
        activeTab,
        currentSignature,
        uploadedSignature
      );

      if (signatureFile) {
        const signaturePath = await uploadFileToS3ByUrl(
          signatureFile,
          FileCategories.ESIGN_SIGNATURE_ORIGINAL
        );

        if (signaturePath) {
          let method: MySignatureMethods;
          let fontFamily: string | undefined;
          let fontColor: string | undefined;

          switch (activeTab) {
            case SignatureTabType.TYPE:
              method = MySignatureMethods.TYPE;
              fontFamily = typedSignature.font;
              fontColor = typedSignature.color;
              break;
            case SignatureTabType.DRAW:
              method = MySignatureMethods.DRAW;
              break;
            case SignatureTabType.UPLOAD:
              method = MySignatureMethods.UPLOAD;
              break;
            default:
              method = MySignatureMethods.TYPE;
          }

          if (currentSignatureUrl && currentSignatureUrl !== signaturePath) {
            await deleteFileFromS3(currentSignatureUrl);
          }

          onSignatureSaved({
            mySignatureLink: signaturePath,
            mySignatureMethod: method,
            fontFamily,
            fontColor
          });
          setToastMessage({
            open: true,
            toastType: ToastType.SUCCESS,
            title: translateText(["successTitle"]),
            description: translateText(["successMessage"])
          });
        }
      }
    } catch {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["errorTitle"]),
        description: translateText(["errorMessage"])
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case SignatureTabType.TYPE:
        return (
          <TypeSignature
            signature={typedSignature}
            onChange={setTypedSignature}
          />
        );
      case SignatureTabType.DRAW:
        return (
          <DrawSignature
            onSignatureChange={setDrawnSignature}
            currentAppliedSignature={
              currentSignatureMethod === MySignatureMethods.DRAW &&
              currentSignatureUrl
                ? signatureUrl || currentSignatureUrl
                : null
            }
          />
        );
      case SignatureTabType.UPLOAD:
        return (
          <UploadSignature
            signature={uploadedSignature}
            onSignatureChange={setUploadedSignature}
            currentAppliedSignature={
              currentSignatureMethod === MySignatureMethods.UPLOAD &&
              currentSignatureUrl
                ? signatureUrl || currentSignatureUrl
                : null
            }
          />
        );
      default:
        return null;
    }
  };

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: SignatureTabType
  ) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (!isOpen) {
      setTypedSignature({
        name: currentUserName || "",
        font: FONT_STYLES[0].value,
        color: FONT_COLORS[0].value
      });
      setDrawnSignature(null);
      setUploadedSignature(null);
      if (signatureUrl) {
        URL.revokeObjectURL(signatureUrl);
        setSignatureUrl("");
      }
      hasFetchedSignatureRef.current = false;
    }
  }, [isOpen, currentUserName, signatureUrl]);

  useEffect(() => {
    return () => {
      if (signatureUrl) {
        URL.revokeObjectURL(signatureUrl);
      }
    };
  }, [signatureUrl]);

  return (
    <Modal
      isModalOpen={isOpen}
      onCloseModal={onClose}
      title={translateText(["title"])}
      role="dialog"
    >
      <Stack spacing={2}>
        <SignatureTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <Box>{renderTabContent()}</Box>
        <Stack spacing={1} direction="column">
          <Button
            label={translateText(["save"])}
            onClick={handleSaveSignature}
            endIcon={IconName.FORWARD_ARROW}
            size={ButtonSizes.LARGE}
            disabled={!isValid || !hasChanges || isUploading}
            isLoading={isUploading}
          />
          <Button
            label={translateText(["cancel"])}
            buttonStyle={ButtonStyle.TERTIARY}
            size={ButtonSizes.LARGE}
            onClick={onClose}
            endIcon={IconName.CLOSE_ICON}
            disabled={isUploading}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

export default UserSignatureManagerModal;
