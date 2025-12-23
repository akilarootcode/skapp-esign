import { useEffect, useRef, useState } from "react";

import { ToastType } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { useToast } from "~community/common/providers/ToastProvider";

export const usePdfViewerControls = (initialZoomLevel = 1.25) => {
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const translateText = useTranslator("eSignatureModule", "sign");
  const { setToastMessage } = useToast();

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => Math.min(prevZoomLevel + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(prevZoomLevel - 0.25, 0.25));
  };

  const handleToggleFullscreen = () => {
    if (!scrollContainerRef.current) return;
    if (!document.fullscreenElement) {
      scrollContainerRef.current.requestFullscreen().catch(() => {
        setToastMessage({
          toastType: ToastType.ERROR,
          title: translateText(["toast.generalErrorTitle"]),
          description: translateText(["toast.generalErrorDesc"]),
          open: true
        });
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleToggleThumbnails = () => {
    setShowThumbnails((prev) => !prev);
  };

  return {
    zoomLevel,
    isFullscreen,
    showThumbnails,
    scrollContainerRef,
    handleZoomIn,
    handleZoomOut,
    handleToggleFullscreen,
    handleToggleThumbnails
  };
};
