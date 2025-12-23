import { Box, Divider, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { ErrorCode } from "react-dropzone";

import DragAndDropField from "~community/common/components/molecules/DragAndDropField/DragAndDropField";
import { MAX_FILE_SIZE_OF_FILE_FOR_ESIGN } from "~community/common/constants/stringConstantsEnterprise";
import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import {
  FileRejectionType,
  FileUploadType
} from "~community/common/types/CommonTypes";
import { FileCategories } from "~community/common/types/s3Types";
import { uploadFileToS3ByUrl } from "~community/common/utils/awsS3ServiceFunctions";
import { useUploadDocumentPath } from "~community/sign/api/DocumentApi";
import FilePreviewModal from "~community/sign/components/molecules/FilePreviewModal/FilePreviewModal";
import InteractiveFileNameHolder from "~community/sign/components/molecules/InteractiveFileNameHolder/InteractiveFileNameHolder";
import { useESignStore } from "~community/sign/store/signStore";
import { CreateDocumentFormTypes } from "~community/sign/types/ESignFormTypes";
import { createUniquePdfNameWithTimestamp } from "~community/sign/utils/fileUploadUtils";

const UploadDocumentSection = () => {
  const { setToastMessage } = useToast();
  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.uploadDoc"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "recipientDetailsSection"
  );

  const [isFileUploadPreviewModalOpen, setIsFileUploadPreviewModalOpen] =
    useState(false);
  const [fileToPreview, setFileToPreview] = useState<string>("");
  const [tempFile, setTempFile] = useState<FileUploadType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    attachments,
    setAttachments,
    customFileError,
    setCustomFileError,
    setUploadedFileUrl,
    setUploadedPdfS3Url,
    setDocumentId,
    setFileName,
    resetSignatureFields
  } = useESignStore();

  const onSuccess = () => {
    resetSignatureFields();
  };

  const { mutateAsync } = useUploadDocumentPath(onSuccess);
  const onSubmit = async () => {};
  const initialValues: CreateDocumentFormTypes = {
    fileName: "",
    file: []
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: true
  });

  const onCloseModal = () => {
    setIsFileUploadPreviewModalOpen(false);
    setFileToPreview("");
  };

  const onUploadFile = async () => {
    if (!navigator.onLine) {
      setToastMessage({
        toastType: ToastType.ERROR,
        title: translateText(["errors", "uploadFailed", "title"]),
        description: translateText(["errors", "uploadFailed", "description"]),
        open: true
      });
      return;
    }

    if (tempFile) {
      setIsLoading(true);

      const originalFile = tempFile[0].file as File;
      const uniqueFileName = createUniquePdfNameWithTimestamp(
        originalFile.name
      );

      const fileWithUniqueId = new File([originalFile], uniqueFileName, {
        type: originalFile.type
      });

      const url = await uploadFileToS3ByUrl(
        fileWithUniqueId,
        FileCategories.ESIGN_DOCUMENTS
      );

      mutateAsync({
        filePath: url,
        name: tempFile[0].name
      }).then((response) => setDocumentId(response.id));
      setUploadedPdfS3Url(url);
      setUploadedFileUrl(fileToPreview);
      setAttachments(tempFile);
      setIsLoading(false);
    }
    onCloseModal();
  };

  const createBlobUrl = (file: FileUploadType): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const pdfBlob = new Blob([file?.file as any], {
          type: "application/pdf"
        });
        if (!pdfBlob) {
          setToastMessage({
            toastType: ToastType.ERROR,
            title: translateText(["errors", "uploadFailed", "title"]),
            description: translateText([
              "errors",
              "uploadFailed",
              "description"
            ]),
            open: true
          });
        }

        const blobUrl = URL.createObjectURL(pdfBlob);
        // The setTimeout function schedules the revocation of the created blob URL after 60 seconds.
        // URL.createObjectURL generates a temporary URL for the blob, allowing it to be used within the app.
        // However, these URLs consume memory, so they should be revoked when no longer needed to free up resources.
        // This ensures that after 60 seconds, the URL is invalidated, preventing potential memory leaks.

        // The setTimeout function is commented out for now. if this leads to any bugs when file uploading, uncomment it.
        // setTimeout(() => URL.revokeObjectURL(blobUrl), 600000);
        resolve(blobUrl);
      } catch (error) {
        reject(error);
      }
    });
  };

  const onFileSelected = async (file: FileUploadType) => {
    if (file) {
      if (file?.file?.type !== "application/pdf") {
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
        return;
      }

      try {
        const blobUrl = await createBlobUrl(file);
        setFileToPreview(blobUrl);
        setCustomFileError("");
        setIsFileUploadPreviewModalOpen(true);
      } catch {
        setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["errors", "uploadFailed", "title"]),
          description: translateText(["errors", "uploadFailed", "description"]),
          open: true
        });
      }
    }
  };

  const handleFileErrors = (errors: FileRejectionType[]) => {
    if (!errors || errors.length === 0) return;

    const error = errors?.[0]?.errors?.[0]?.code;

    switch (error) {
      case ErrorCode.FileInvalidType:
        setCustomFileError(
          translateText(["errors", "fileTypeNotSupported", "validationMessage"])
        );

        break;
      case ErrorCode.FileTooLarge:
        setCustomFileError(
          translateText(["errors", "fileTooLarge", "validationMessage"])
        );

        break;

      default:
        setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["errors", "uploadFailed", "title"]),
          description: translateText(["errors", "uploadFailed", "description"]),
          open: true
        });
    }
  };

  useEffect(() => {
    if (attachments && attachments.length > 0) {
      formik.setFieldValue("fileName", attachments?.[0]?.name?.split(".")?.[0]);
      formik.setFieldValue("file", attachments?.[0]);
    }
  }, [attachments]);
  return (
    <Stack role="document" component="section">
      <Stack>
        <Typography variant="h2">{translateText(["uploadTitle"])}</Typography>
        <Divider
          sx={{
            margin: "1rem 0"
          }}
        />
      </Stack>
      {attachments.length === 0 ? (
        <Box
          component="form"
          role="presentation"
          id="upload-instructions"
          sx={{
            maxWidth: "70%",
            padding: "0rem 0rem 1.5rem 0rem"
          }}
        >
          <DragAndDropField
            setAttachmentErrors={handleFileErrors}
            setAttachments={async (attachments: FileUploadType[]) => {
              setTempFile(attachments);
              await formik.setFieldValue(
                "fileName",
                attachments?.[0]?.name?.split(".")?.[0]
              );
              setFileName(attachments?.[0]?.name?.split(".")?.[0]);
              await formik.setFieldValue("file", attachments?.[0]);
              onFileSelected(attachments[0]);
            }}
            accept={{ "application/pdf": [".pdf"] }}
            uploadableFiles={attachments}
            supportedFiles=".pdf"
            maxFileSize={1}
            isZeroFilesErrorRequired={false}
            maxSizeOfFile={MAX_FILE_SIZE_OF_FILE_FOR_ESIGN}
            customError={customFileError}
            accessibility={{
              componentName: translateAria(["uploadDocumentsDragAndDrop"]),
              ariaDescribedBy: "upload-instructions",
              ariaHidden: true
            }}
          />
        </Box>
      ) : (
        <Box
          component="div"
          sx={{
            padding: "0rem 0rem 1.5rem 0rem"
          }}
        >
          <InteractiveFileNameHolder
            attachments={attachments}
            formik={formik}
          />
        </Box>
      )}
      {isFileUploadPreviewModalOpen && fileToPreview && (
        <FilePreviewModal
          modalTitle={translateText(["uploadTitle"])}
          isOpen={isFileUploadPreviewModalOpen}
          file={fileToPreview}
          onClose={onCloseModal}
          onUpload={onUploadFile}
          isLoading={isLoading}
        />
      )}
    </Stack>
  );
};

export default UploadDocumentSection;
