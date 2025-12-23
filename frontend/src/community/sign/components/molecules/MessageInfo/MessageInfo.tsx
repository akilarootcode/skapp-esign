import { Box, Link, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";

interface MessageInfoProps {
  label: string;
  value?: string;
  marginTop?: number | string;
  marginBottom?: number | string;
  maxLines?: number;
}

const MessageInfo = ({
  label,
  value,
  marginTop = 2,
  marginBottom,
  maxLines = 3
}: MessageInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const translateText = useTranslator("eSignatureModule", "create");
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current && value) {
        const originalDisplay = textRef.current.style.display;
        const originalWebkitLineClamp = textRef.current.style.webkitLineClamp;

        textRef.current.style.webkitLineClamp = "unset";
        textRef.current.style.display = "block";

        const lineHeight =
          parseInt(getComputedStyle(textRef.current).lineHeight) || 20;
        const maxHeight = lineHeight * maxLines;
        const actualHeight = textRef.current.scrollHeight;

        textRef.current.style.display = originalDisplay;
        textRef.current.style.webkitLineClamp = originalWebkitLineClamp;

        setNeedsTruncation(actualHeight > maxHeight);
      }
    };

    const timer = setTimeout(checkTruncation, 0);

    window.addEventListener("resize", checkTruncation);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [value, maxLines, isExpanded]);

  const handleToggleExpand = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  };

  if (!value) return null;
  return (
    <Box
      sx={{
        mt: marginTop,
        mb: marginBottom,
        flexShrink: 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "nowrap"
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: "4.375rem",
          justifyContent: "space-between"
        }}
      >
        <Typography component="span" variant="body2" color="text.primary">
          {label}
        </Typography>
        <Typography component="span" variant="body2" color="text.primary">
          :
        </Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          marginLeft: 1
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline" }}>
          <Typography
            ref={textRef}
            component="span"
            variant="body2"
            color="text.secondary"
            sx={{
              display:
                needsTruncation && !isExpanded ? "-webkit-box" : "inline",
              overflow: "hidden",
              textOverflow: isExpanded ? "clip" : "ellipsis",
              WebkitLineClamp: isExpanded ? "unset" : maxLines,
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
              flexGrow: 1,
              minWidth: 0
            }}
          >
            {value}
          </Typography>
          {needsTruncation && (
            <Link
              href="#"
              onClick={handleToggleExpand}
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-block",
                color: theme.palette.primary.dark,
                flexShrink: 0
              }}
              aria-expanded={isExpanded}
              aria-controls="message-content"
            >
              {isExpanded
                ? translateText(["showLess"])
                : translateText(["showMore"])}
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MessageInfo;
