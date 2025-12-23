import { Stack, Theme, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import LocalImage, {
  ImageName
} from "~community/common/components/molecules/LocalImage";
import { SkappModuleLinkEnum } from "~community/common/enums/CommonEnums";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { SKAPP_INFO_FEATURES } from "~community/sign/constants";

import styles from "./styles";

const SkappInfo = () => {
  const router = useRouter();

  const translateText = useTranslator("eSignatureModule", "info");

  const theme: Theme = useTheme();
  const classes = styles(theme);

  return (
    <Stack sx={classes.root}>
      <Stack sx={classes.leftSection}>
        <LocalImage
          name={ImageName.DOCUMENT_SIGNED}
          style={{
            objectFit: "contain",
            width: "7.25rem",
            padding: "0.75rem",
            marginBottom: "0.375rem"
          }}
        />

        <Typography variant="onboardingHeader">
          {translateText(["title"])}
        </Typography>

        <Typography variant="body1">
          {translateText(["description"])}
        </Typography>

        <Button
          label={translateText(["learnMore"])}
          isFullWidth={false}
          buttonStyle={ButtonStyle.TERTIARY}
          size={ButtonSizes.SMALL}
          endIcon={IconName.RIGHT_ARROW_ICON}
          onClick={() => router.push(SkappModuleLinkEnum.ESIGNATURE)}
        />
      </Stack>
      <Stack sx={classes.rightSection}>
        <Stack sx={classes.logoRow}>
          <LocalImage
            name={ImageName.SKAPP_LOGO}
            style={{
              objectFit: "contain",
              width: "4.5rem",
              height: "1.8125rem"
            }}
          />
          <Typography variant="caption" color="grey.400">
            {translateText(["alsoOffers"])}
          </Typography>
        </Stack>
        <Stack sx={classes.featuresRow}>
          {SKAPP_INFO_FEATURES.map((feature) => (
            <Stack key={feature.label} sx={classes.featureItem}>
              <Icon name={feature.icon} />
              <Typography
                variant="caption"
                align="center"
                color="text.secondary"
              >
                {translateText([feature.label])}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SkappInfo;
