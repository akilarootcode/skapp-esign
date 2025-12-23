import { Box, Stack, Typography, useTheme } from "@mui/material";
import { FormikErrors, FormikState } from "formik";
import {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState
} from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import InputField from "~community/common/components/molecules/InputField/InputField";
import KebabMenu from "~community/common/components/molecules/KebabMenu/KebabMenu";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { FileUploadType } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import {
  deleteFileFromS3,
  uploadFileToS3ByUrl
} from "~community/common/utils/awsS3ServiceFunctions";
import { shouldActivateButton } from "~community/common/utils/keyboardUtils";
import { useEditDocument } from "~community/sign/api/DocumentApi";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { useESignStore } from "~community/sign/store/signStore";
import { CreateDocumentFormTypes } from "~community/sign/types/ESignFormTypes";
import { createUniquePdfNameWithTimestamp } from "~community/sign/utils/fileUploadUtils";
import { FileCategories } from "~enterprise/common/types/s3Types";

import FilePreviewModal from "../FilePreviewModal/FilePreviewModal";

const restrictedCharacters = /[\\/:*?"<>|]/g;

interface Props {
  attachments: FileUploadType[];
  formik: FormikState<CreateDocumentFormTypes> & {
    errors: FormikErrors<CreateDocumentFormTypes>;
    setFieldError: (field: string, value: string | undefined) => void;
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void;
    handleChange: (event: ChangeEvent<any>) => void;
  };
}

const InteractiveFileNameHolder = ({ attachments, formik }: Props) => {
  const [inputWidth, setInputWidth] = useState(50);
  const theme = useTheme();
  const { setToastMessage } = useToast();

  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.uploadDoc"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "interactiveFileNameHolder"
  );
  const [editableInput, setEditableInput] = useState<boolean>(false);
  const [shouldSelect, setShouldSelect] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFilePreviewModalOpen, setIsFilePreviewModalOpen] = useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const {
    setAttachments,
    documentId,
    setDocumentControllerModalType,
    setIsDocumentControllerModalOpen,
    setFileName,
    setUploadedFileUrl,
    uploadedPdfS3Url,
    setUploadedPdfS3Url,
    resetSignatureFields
  } = useESignStore();

  const onSuccess = () => {
    resetSignatureFields();
  };

  const { mutate: EditDocument } = useEditDocument(documentId || "", onSuccess);
  const handleReplaceFile = () => {
    fileInputRef.current?.click();
  };

  const { values, setFieldValue } = formik;

  const handleFileNameChange = (event: { target: { value: string } }) => {
    const newValue = event.target.value.replace(restrictedCharacters, "");
    setFieldValue("fileName", newValue);
    setFileName(newValue);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["application/pdf"];
      if (allowedTypes.includes(file.type)) {
        const fileObjectUrl = URL.createObjectURL(file);
        setFileToPreview(fileObjectUrl);
        setIsFilePreviewModalOpen(true);
      } else {
        setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["errors", "fileTypeNotSupported", "title"]),
          description: translateText([
            "errors",
            "fileTypeNotSupported",
            "description"
          ]),
          open: true
        });
      }
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (shouldActivateButton(event.key)) {
      if (!editableInput) {
        event.preventDefault();
        setEditableInput(true);
        setShouldSelect(true);
      }
    }
  };

  const handleUpdateFile = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      setIsUploading(true);
      try {
        if (uploadedPdfS3Url) {
          deleteFileFromS3(uploadedPdfS3Url);
        }

        const uniqueFileName = createUniquePdfNameWithTimestamp(file.name);

        const fileWithUniqueId = new File([file], uniqueFileName, {
          type: file.type
        });

        const s3FilePath = await uploadFileToS3ByUrl(
          fileWithUniqueId,
          FileCategories.ESIGN_DOCUMENTS
        );

        setUploadedPdfS3Url(s3FilePath);

        EditDocument({
          filePath: s3FilePath,
          name: file.name
        });

        const fileInfo = { file, name: file.name, path: s3FilePath };

        setAttachments([fileInfo]);

        const fileObjectUrl = URL.createObjectURL(file);
        setUploadedFileUrl(fileObjectUrl);

        formik.setFieldValue("fileName", file.name.split(".")[0]);
        formik.setFieldValue("file", fileInfo);

        fileInputRef.current.value = "";
      } catch (error) {
        console.error("Error uploading file:", error);
        setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["errors", "uploadFailed", "title"]),
          description: translateText(["errors", "uploadFailed", "description"]),
          open: true
        });
      } finally {
        setIsUploading(false);
        setIsFilePreviewModalOpen(false);
      }
    }
  };

  const handleRenameClick = () => {
    setIsRenaming(true);
    setEditableInput(true);
    setShouldSelect(true);
  };

  const handleInputFocus = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (shouldSelect) {
      event.target.setSelectionRange(0, event.target.value.length);
      setShouldSelect(false);
    }
  };
  const kebabMenuOptions = [
    {
      id: 1,
      text: translateText(["kebabMenuOptions.view"]),
      ariaLabel: translateAria(["kebabMenuOptions.view"], {
        fileName: values.fileName
      }),
      onClickHandler: () => {
        if (attachments?.[0]?.path) {
          const fileExtension = attachments[0].name
            .split(".")
            .pop()
            ?.toLowerCase();

          if (fileExtension === "pdf") {
            window.open(attachments[0].path, "_blank");
          }
        }
      },
      isDisabled: false
    },
    {
      id: 2,
      text: translateText(["kebabMenuOptions.replace"]),
      onClickHandler: handleReplaceFile,
      isDisabled: false,
      ariaLabel: translateAria(["kebabMenuOptions.replace"], {
        fileName: values.fileName
      })
    },
    {
      id: 3,
      text: translateText(["kebabMenuOptions.delete"]),
      onClickHandler: () => {
        setIsDocumentControllerModalOpen(true);
        setDocumentControllerModalType(
          CreateDocumentsModalTypes.DELETE_DOCUMENT
        );
      },
      isDisabled: false,
      ariaLabel: translateAria(["kebabMenuOptions.delete"], {
        fileName: values.fileName
      })
    },
    {
      id: 4,
      text: translateText(["kebabMenuOptions.rename"]),
      onClickHandler: handleRenameClick,
      isDisabled: false,
      ariaLabel: translateAria(["kebabMenuOptions.rename"], {
        fileName: values.fileName
      })
    }
  ];

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = "16px Poppins";
      const width = context.measureText(values.fileName || " ").width;
      setInputWidth(width + 5);
    }
  }, [values.fileName]);

  const handleBlur = () => {
    if (editableInput && !isRenaming) {
      attachments[0].name = `${values.fileName}.pdf`;
      setEditableInput(false);
    }
    setIsRenaming(false);
  };

  return (
    <Box
      sx={{
        border: `0.0625rem solid ${theme.palette.grey[200]}`,
        width: "max-content",
        padding: "16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "1.875rem",
        borderRadius: "0.5rem"
      }}
    >
      <Icon name={IconName.FILE_ICON} />
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center"
        }}
        tabIndex={0}
        role="group"
        onKeyDown={handleKeyDown}
        aria-label={translateAria(["fileNameContainer"])}
      >
        <InputField
          focusOnText={editableInput}
          ariaLabel={translateAria(["fileNameInput"])}
          inputName={"fileName"}
          value={values.fileName}
          isDisabled={!editableInput}
          onFocus={handleInputFocus}
          inputStyle={{
            backgroundColor: "white",
            width: `${inputWidth}px`,
            height: "auto",
            padding: "0rem !important",
            mt: "0rem !important",
            "&& .MuiInputBase-input": {
              padding: "0rem !important",
              backgroundColor: "white",
              color: "black",
              "&.Mui-disabled": {
                WebkitTextFillColor: "black !important"
              }
            },
            "&& .MuiInputBase-input.Mui-disabled": {
              color: "black !important"
            }
          }}
          onChange={handleFileNameChange}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.stopPropagation();
              attachments[0].name = `${values.fileName}.pdf`;
              setEditableInput(false);
            }
          }}
          onBlur={handleBlur}
        />
        <Typography>.pdf</Typography>
      </Stack>

      <Box>
        <KebabMenu
          id="add-team-kebab-menu"
          menuItems={kebabMenuOptions}
          icon={<Icon name={IconName.MORE_ICON} />}
          customStyles={{
            menu: { zIndex: ZIndexEnums.MODAL },
            menuIcon: { transform: "rotate(90deg)" }
          }}
          ariaLabel={translateAria(["kebabMenu"], {
            fileName: values.fileName
          })}
        />
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {isFilePreviewModalOpen && (
        <FilePreviewModal
          isOpen={isFilePreviewModalOpen}
          file={fileToPreview}
          onClose={() => setIsFilePreviewModalOpen(false)}
          onUpload={handleUpdateFile}
          isLoading={isUploading}
          modalTitle={translateText(["replaceTitle"])}
        />
      )}
    </Box>
  );
};

export default InteractiveFileNameHolder;
