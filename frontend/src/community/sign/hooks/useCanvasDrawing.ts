import React, { RefObject, useState } from "react";

import { theme } from "~community/common/theme/theme";

export const useCanvasDrawing = (
  canvasRef: RefObject<HTMLCanvasElement>,
  onSignatureChange: (signature: string | null) => void
) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const getContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = theme.palette.text.primary;

    return ctx;
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getContext();
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const ctx = getContext();
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    onSignatureChange(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return {
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas
  };
};
