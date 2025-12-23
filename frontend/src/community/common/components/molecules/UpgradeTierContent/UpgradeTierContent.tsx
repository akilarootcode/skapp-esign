import { Box, Stack, Theme, Typography, useTheme } from "@mui/material";
import Image from "next/image";
import { MouseEvent } from "react";

import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import useSessionData from "~community/common/hooks/useSessionData";
import { IconName } from "~community/common/types/IconTypes";
import Rocket from "~public/image/rocket.png";

import styles from "./styles";

interface Props {
  title: string;
  description: string;
  btnLabel: string;
  onBtnClick: (event: MouseEvent<HTMLElement>) => void;
  onClose?: () => void;
  buttonStyle?: ButtonStyle;
}

const UpgradeTierContent = ({
  title,
  description,
  btnLabel,
  onBtnClick,
  onClose,
  buttonStyle = ButtonStyle.BLUE_OUTLINED
}: Props) => {
  const theme: Theme = useTheme();
  const classes = styles(theme);

  const { isSuperAdmin } = useSessionData();

  return (
    <Stack sx={classes.modal}>
      {onClose && (
        <Box sx={classes.iconWrapper} onClick={() => onClose?.()}>
          <Icon name={IconName.CLOSE_ICON} fill={theme.palette.primary.dark} />
        </Box>
      )}
      <Image
        src={Rocket}
        alt="Onboarding Splash"
        layout="responsive"
        width={100}
        objectFit="contain"
      />
      <Stack sx={classes.content}>
        <Typography variant="h3" align="center">
          {title}
        </Typography>
        <Typography variant="caption" align="center">
          {description}
        </Typography>
        {isSuperAdmin && (
          <Button
            label={btnLabel}
            endIcon={IconName.RIGHT_ARROW_ICON}
            buttonStyle={buttonStyle}
            size={ButtonSizes.MEDIUM}
            onClick={onBtnClick}
          />
        )}
      </Stack>
    </Stack>
  );
};

export default UpgradeTierContent;
