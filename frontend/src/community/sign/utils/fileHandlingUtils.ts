const triggerDownload = (blobUrl: string, fileName: string): void => {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(blobUrl);
  document.body.removeChild(a);
};

export const handleFileAction = async (filePath: string, fileName: string) => {
  const fileExtension = filePath.split(".").pop()?.toLowerCase();

  if (!fileExtension) {
    console.error("Unable to determine file type.");
    return;
  }

  if (fileExtension === "pdf") {
    try {
      const response = await fetch(filePath);

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      const blob = await response.blob();

      if (blob) {
        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000);
      } else {
        console.error("Failed to generate PDF blob.");
      }
    } catch (error) {
      console.error("Error handling PDF file:", error);
    }
  } else {
    console.warn("Unsupported file type.");
  }
};

export const downloadFileFromS3 = async (url: string, subject?: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileName =
      subject || url.split("?")[0].split("/").pop() || "Attachment";

    const blobUrl = window.URL.createObjectURL(blob);
    triggerDownload(blobUrl, fileName);
  } catch {
    console.error("Error downloading file from S3");
  }
};

export const downloadFileFromCloudFront = async (
  url: string,
  subject?: string
) => {
  try {
    const response = await fetch(url, {
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const fileName =
      subject || url.split("?")[0].split("/").pop() || "Attachment";

    const blobUrl = window.URL.createObjectURL(blob);
    triggerDownload(blobUrl, fileName);
  } catch {
    console.error("Error downloading file");
  }
};

export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteString = atob(base64.split(",")[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: mimeType });
};

export const getFileExtensionFromBlob = (blob: Blob): string => {
  const mimeType = blob.type;
  const extensionMap: { [key: string]: string } = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "application/pdf": "pdf"
  };
  return extensionMap[mimeType];
};

export const downloadPdfFile = (responseData: Blob, filename: string): void => {
  try {
    const url = window.URL.createObjectURL(responseData);

    triggerDownload(url, filename);
  } catch {
    console.error("Error downloading PDF file");
  }
};
