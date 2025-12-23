import * as pdfjsLib from "pdfjs-dist";
import { useCallback, useRef, useState } from "react";

export interface PageCorners {
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  bottomLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export const useRenderPages = (
  pdfDocument: pdfjsLib.PDFDocumentProxy | null,
  scale: number
) => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const renderingTasks = useRef<(pdfjsLib.RenderTask | null)[]>([]);
  const [pageViewports, setPageViewports] = useState<pdfjsLib.PageViewport[]>(
    []
  );
  const [pageCorners, setPageCorners] = useState<PageCorners[]>([]);

  const calculatePageCorners = (
    viewport: pdfjsLib.PageViewport
  ): PageCorners => {
    const topLeft = { x: 0, y: 0 };
    const topRight = { x: viewport.width / scale, y: 0 };
    const bottomLeft = { x: 0, y: viewport.height / scale };
    const bottomRight = {
      x: viewport.width / scale,
      y: viewport.height / scale
    };

    return { topLeft, topRight, bottomLeft, bottomRight };
  };

  const renderPage = async (pageNumber: number) => {
    if (!pdfDocument) {
      return;
    }

    if (!canvasRefs.current[pageNumber - 1]) {
      return;
    }

    try {
      if (pageNumber < 1 || pageNumber > pdfDocument.numPages) {
        return;
      }

      const page = await pdfDocument.getPage(pageNumber);
      const canvas = canvasRefs.current[pageNumber - 1];

      if (!canvas) {
        return;
      }

      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      if (renderingTasks.current[pageNumber - 1]) {
        renderingTasks.current[pageNumber - 1]!.cancel();
      }

      const viewport = page.getViewport({ scale });

      const corners = calculatePageCorners(viewport);
      setPageCorners((prev) => {
        const newCorners = [...prev];
        newCorners[pageNumber - 1] = corners;
        return newCorners;
      });

      setPageViewports((prev) => {
        const newViewports = [...prev];
        newViewports[pageNumber - 1] = viewport;
        return newViewports;
      });

      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);

      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      const transform =
        outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        transform: transform
      };

      const renderTask = page.render(renderContext);
      renderingTasks.current[pageNumber - 1] = renderTask;

      await renderTask.promise;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name !== "RenderingCancelledException"
      ) {
        console.error(`Error rendering page ${pageNumber}:`, error);
      }
    }
  };

  const renderAllPages = useCallback(async () => {
    if (!pdfDocument) {
      return;
    }

    try {
      const promises = Array.from({ length: pdfDocument.numPages }, (_, i) =>
        renderPage(i + 1)
      );

      await Promise.all(promises);
    } catch (error) {
      console.error("Error rendering all pages:", error);
    }
  }, [pdfDocument, scale]);

  const getPageDimensions = useCallback(
    (pageNumber: number) => {
      const viewport = pageViewports[pageNumber - 1];
      if (!viewport) return { width: 0, height: 0 };

      return {
        width: viewport.width,
        height: viewport.height
      };
    },
    [pageViewports]
  );

  const getPageCorners = useCallback(
    (pageNumber: number) => {
      return pageCorners[pageNumber - 1] || null;
    },
    [pageCorners]
  );

  const cleanup = useCallback(() => {
    renderingTasks.current.forEach((task) => task?.cancel());
    renderingTasks.current = [];
  }, []);

  return {
    canvasRefs,
    renderAllPages,
    getPageDimensions,
    getPageCorners,
    pageCorners,
    cleanup
  };
};
