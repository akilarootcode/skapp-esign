import { Box, Skeleton, useTheme } from "@mui/material";
import React from "react";

import { Styles } from "./styles";

const NextEnvelopeCardSkeleton: React.FC = () => {
  const theme = useTheme();
  const styles = Styles(theme);

  return (
    <Box sx={styles.envelopeCardWrapper}>
      <Skeleton variant="rectangular" width="2rem" height="2rem" />
      <Box sx={styles.contentSection}>
        <Skeleton variant="text" width="70%" height="1.875rem" />
        <Skeleton variant="text" width="85%" height="1.25rem" />
        <Skeleton variant="text" width="60%" height="1.25rem" />
      </Box>
      <Box sx={styles.buttonSection}>
        <Skeleton
          variant="rectangular"
          width="4rem"
          height="2rem"
          sx={{ borderRadius: "0.25rem" }}
        />
      </Box>
    </Box>
  );
};

export default NextEnvelopeCardSkeleton;
