import { Box, Paper } from "@mui/material";
import React from "react";

interface PdfPageProps {
  index: number;
  canvasRef: (el: HTMLCanvasElement | null) => void;
  pageRef: (el: HTMLDivElement | null) => void;
  dimensions?: { width: number; height: number };
  children?: React.ReactNode;
  isHighlighted?: boolean;
}

const PdfPage: React.FC<PdfPageProps> = ({
  index,
  canvasRef,
  pageRef,
  dimensions,
  children,
  isHighlighted = false
}) => {
  return (
    <Box
      key={index}
      ref={pageRef}
      position="relative"
      sx={{
        width: dimensions?.width || "auto",
        height: dimensions?.height || "auto"
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "fit-content",
          height: "fit-content",
          overflow: "hidden",
          border: isHighlighted ? "3px solid" : "none",
          borderColor: isHighlighted ? "primary.main" : "transparent",
          transition: "border 0.3s ease-in-out",
          boxShadow: isHighlighted
            ? "0 0 12px rgba(25, 118, 210, 0.5)"
            : undefined
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            transformOrigin: "center center",
            maxWidth: "100%",
            height: "auto"
          }}
        />
      </Paper>
      {children}
    </Box>
  );
};

export default PdfPage;
