import { Box, Typography } from "@mui/material";

interface AutoFillFieldProps {
  value: string;
  zoomLevel?: number;
}

const AutoFillField = ({ value, zoomLevel = 1 }: AutoFillFieldProps) => {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        minWidth: "100%",
        width: "fit-content",
        height: "100%",
        borderRadius: "0.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 0.5rem",
        overflow: "hidden"
      }}
    >
      <Typography
        sx={{
          fontSize: `${0.75 * zoomLevel}rem`,
          width: "100%",
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textAlign: "center"
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default AutoFillField;
