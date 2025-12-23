import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

import { Styles } from "./styles";

interface NeedToSignCardProps {
  title: String;
  count: number;
  iconName: IconName;
}

const KPI: React.FC<NeedToSignCardProps> = ({ count, title, iconName }) => {
  const theme = useTheme();
  const styles = Styles(theme);
  const translateAria = useTranslator("eSignatureModuleAria", "components");

  return (
    <Box
      sx={styles.card}
      tabIndex={0}
      role="region"
      aria-label={translateAria(["kpi", "documentCard"], {
        title: title,
        count: count.toString()
      })}
    >
      <Box sx={styles.iconContainer} aria-hidden="true">
        <Icon
          name={iconName}
          width="1.5rem"
          height="1.5rem"
          fill={theme.palette.primary.dark}
        />
      </Box>
      <Box sx={styles.contentContainer} aria-hidden="true">
        <Typography variant="body2" color={theme.palette.text.neutral}>
          {title}
        </Typography>
        <Typography variant="kpiValue">{count === 0 ? "-" : count}</Typography>
      </Box>
    </Box>
  );
};

export default KPI;
