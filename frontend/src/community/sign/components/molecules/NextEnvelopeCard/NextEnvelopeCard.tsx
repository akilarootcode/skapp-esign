import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import { ButtonSizes } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";

import { Styles } from "./styles";

interface NextEnvelopeCardProps {
  documentName: string;
  senderEmail: string;
  sentDate: string;
  onSignClick: () => void;
}

const NextEnvelopeCard: React.FC<NextEnvelopeCardProps> = ({
  documentName,
  senderEmail,
  sentDate,
  onSignClick
}) => {
  const theme = useTheme();
  const styles = Styles(theme);
  const translateText = useTranslator(
    "eSignatureModule",
    "page",
    "signNextCard"
  );

  return (
    <Box sx={styles.envelopeCardWrapper}>
      <Icon name={IconName.FILE_ICON} width="2rem" height="2rem" />
      <Box sx={styles.contentSection}>
        <Typography variant="label">{documentName}</Typography>
        <Typography variant="body2" color={theme.palette.text.neutral}>
          {translateText(["sentBy"])} : {senderEmail}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.neutral}>
          {translateText(["sentOn"])} : {sentDate}
        </Typography>
      </Box>
      <Box sx={styles.buttonSection}>
        <Button
          size={ButtonSizes.SMALL}
          isFullWidth={false}
          label={translateText(["signButton"])}
          onClick={onSignClick}
        />
      </Box>
    </Box>
  );
};

export default NextEnvelopeCard;
