import { useState } from "react";

import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";
import { useSetDocumentCookies } from "~community/sign/api/CloudFrontApi";

interface Document {
  id: string;
  title: string;
  filePath?: string;
  pageCount?: number;
}

const useDocumentViewer = () => {
  const { setToastMessage } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const translateText = useTranslator("eSignatureModule", "sign", "toast");

  const { mutate: setDocumentCookies } = useSetDocumentCookies();

  const openDocument = async (documentId: string, documents: Document[]) => {
    setIsLoading(true);
    try {
      const document = documents.find((doc) => doc.id === documentId);

      if (!document || !document.filePath) {
        setToastMessage({
          open: true,
          toastType: ToastType.ERROR,
          title: translateText(["generalErrorTitle"]),
          description: translateText(["generalPdfLoadErrorDes"])
        });
        return;
      }

      setDocumentCookies(undefined, {
        onSuccess: () => {
          window.open(document.filePath, "_blank");
        },
        onError: () => {
          setToastMessage({
            open: true,
            toastType: ToastType.ERROR,
            title: translateText(["generalErrorTitle"]),
            description: translateText(["generalPdfLoadErrorDes"])
          });
        }
      });
    } catch (error) {
      setToastMessage({
        open: true,
        toastType: ToastType.ERROR,
        title: translateText(["generalErrorTitle"]),
        description: translateText(["generalPdfLoadErrorDes"])
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    openDocument,
    isLoading
  };
};

export default useDocumentViewer;
