import { Box, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";
import { useCanvasDrawing } from "~community/sign/hooks/useCanvasDrawing";

interface DrawSignatureProps {
  onSignatureChange: (signature: string | null) => void;
  currentAppliedSignature?: string | null;
}

export const DrawSignature: React.FC<DrawSignatureProps> = ({
  onSignatureChange,
  currentAppliedSignature
}) => {
  const translateText = useTranslator("eSignatureModule", "sign");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "drawSignature"
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  const { startDrawing, draw, stopDrawing, clearCanvas } = useCanvasDrawing(
    canvasRef,
    onSignatureChange
  );

  const handleStartDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    onSignatureChange(null);
    setHasStartedDrawing(true);
    setIsMouseDown(true);
    setIsCleared(true);
    startDrawing(e);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMouseDown) {
      draw(e);
    }
  };

  const handleStopDrawing = (_e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isMouseDown) {
      stopDrawing();
      setIsCleared(false);
    }
    setIsMouseDown(false);
  };

  const handleClear = () => {
    clearCanvas();
    onSignatureChange(null);
    setHasStartedDrawing(false);
    setIsCleared(true);
  };

  const showCanvas =
    isMouseDown || hasStartedDrawing || isCleared || !currentAppliedSignature;
  const displaySignature =
    !isCleared && !hasStartedDrawing && !isMouseDown
      ? currentAppliedSignature
      : null;

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          backgroundColor: theme.palette.grey[100],
          borderRadius: "0.5rem",
          mb: 2,
          height: 200
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "15%",
            width: "70%",
            height: "0.063rem",
            backgroundColor: theme.palette.grey[500],
            pointerEvents: "none"
          }}
        />

        {showCanvas ? (
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            onMouseDown={handleStartDrawing}
            onMouseMove={handleDraw}
            onMouseUp={handleStopDrawing}
            onMouseLeave={handleStopDrawing}
            style={{
              width: "100%",
              height: "100%",
              cursor: "crosshair",
              position: "relative"
            }}
            aria-label={translateAria(["drawHere"])}
            tabIndex={0}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%"
            }}
          >
            <img
              src={displaySignature || ""}
              alt="Your signature"
              style={{
                maxWidth: "100%",
                maxHeight: "10rem",
                objectFit: "contain"
              }}
            />
          </Box>
        )}

        {showCanvas && !hasStartedDrawing && (
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: theme.palette.grey[500],
              pointerEvents: "none",
              fontSize: "1.5rem"
            }}
          >
            {translateText(["drawSignature"])}
          </Typography>
        )}

        {(hasStartedDrawing || (!isCleared && currentAppliedSignature)) && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8
            }}
          >
            <Button
              label="Clear"
              buttonStyle={ButtonStyle.TERTIARY_OUTLINED}
              size={ButtonSizes.SMALL}
              isFullWidth={false}
              onClick={handleClear}
              styles={{
                minWidth: "auto",
                p: 0.5
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
