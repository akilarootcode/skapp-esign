import * as pdfjsLib from "pdfjs-dist";
import pdfjsPackage from "pdfjs-dist/package.json";
import { useEffect, useRef, useState } from "react";

const pdfjsVersion = pdfjsPackage.version;
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`;

export const useS3PdfDocument = (documentUrl: string) => {
  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loadingTaskRef = useRef<pdfjsLib.PDFDocumentLoadingTask | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>("");

  useEffect(() => {
    const loadPdfDocument = async () => {
      setPdfDocument(null);
      setNumPages(null);
      setPdfBlobUrl("");

      if (!documentUrl) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch the document
        const response = await fetch(documentUrl, {
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch document: ${response.status} ${response.statusText}`
          );
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);

        // Load PDF from the blob
        const arrayBuffer = await blob.arrayBuffer();

        loadingTaskRef.current = pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/cmaps/`,
          cMapPacked: true,
          enableXfa: true,
          disableRange: false,
          disableStream: false,
          disableAutoFetch: false
        });

        const pdf = await loadingTaskRef.current.promise;

        if (pdf && pdf.numPages > 0) {
          setPdfDocument(pdf);
          setNumPages(pdf.numPages);
        } else {
          setError("The PDF document appears to be invalid or empty");
        }
      } catch (error: any) {
        setError(
          `Failed to load PDF document: ${error.message || "Unknown error"}`
        );
        setPdfBlobUrl("");
      } finally {
        setIsLoading(false);
      }
    };

    loadPdfDocument();

    return () => {
      if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy();
        loadingTaskRef.current = null;
      }
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [documentUrl]);

  return { pdfDocument, numPages, isLoading, error, pdfBlobUrl };
};
