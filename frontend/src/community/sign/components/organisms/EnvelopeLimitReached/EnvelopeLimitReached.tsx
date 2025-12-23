import { Stack, Theme, Typography, useTheme } from "@mui/material";
import Head from "next/head";
import React from "react";

import Button from "~community/common/components/atoms/Button/Button";
import LocalImage, {
  ImageName
} from "~community/common/components/molecules/LocalImage";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { IconName } from "~community/common/types/IconTypes";

import styles from "./styles";

interface EnvelopeLimitProps {
  onButtonClick?: () => void;
  pageHead: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonIcon: IconName;
}

const EnvelopeLimitReached: React.FC<EnvelopeLimitProps> = ({
  onButtonClick,
  pageHead,
  title,
  description,
  buttonLabel,
  buttonIcon
}) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { isSuperAdmin, isProTier } = useSessionData();

  return (
    <>
      <Head>
        <title>{pageHead}</title>
      </Head>
      <Stack sx={classes.root}>
        <Stack sx={classes.contentSection}>
          <LocalImage
            name={ImageName.ROCKET_NOBG}
            style={{
              objectFit: "contain",
              marginBottom: "1rem"
            }}
          />
          <Typography variant="h1" sx={classes.title}>
            {title}
          </Typography>
          <Typography variant="body1" sx={classes.description}>
            {description}
          </Typography>
          {isSuperAdmin && (
            <Button
              label={buttonLabel}
              isFullWidth={false}
              buttonStyle={
                isProTier ? ButtonStyle.PRIMARY : ButtonStyle.BLUE_OUTLINED
              }
              size={ButtonSizes.MEDIUM}
              endIcon={buttonIcon}
              onClick={onButtonClick}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default EnvelopeLimitReached;
