import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { FONT_COLORS, FONT_STYLES } from "~community/sign/constants";
import { useESignStore } from "~community/sign/store/signStore";

import { styles } from "./styles";

interface TypedSignature {
  name: string;
  font: string;
  color: string;
}

interface TypeSignatureProps {
  signature: TypedSignature;
  onChange: (signature: TypedSignature) => void;
}

export const TypeSignature: React.FC<TypeSignatureProps> = ({
  signature,
  onChange
}) => {
  const translateText = useTranslator("eSignatureModule", "sign");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "typeSignature"
  );
  const theme = useTheme();
  const classes = styles(theme);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { documentInfo } = useESignStore();
  const [signatureName, setSignatureName] = useState(signature.name || "");

  useEffect(() => {
    if (documentInfo?.name && !signatureName) {
      setSignatureName(documentInfo.name);
    }
  }, [documentInfo]);

  useEffect(() => {
    if (!signature.font && FONT_STYLES.length > 0) {
      onChange({
        ...signature,
        name: signature.name || signatureName,
        font: FONT_STYLES[0].value,
        color: signature.color || FONT_COLORS[0].value
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!fontsLoaded) {
        const timeoutId = setTimeout(() => {
          setFontsLoaded(true);
        }, 1000);

        document.fonts.ready.then(() => {
          clearTimeout(timeoutId);
          setFontsLoaded(true);
        });

        return () => clearTimeout(timeoutId);
      }
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (signatureName) {
      onChange({
        ...signature,
        name: signatureName
      });
    }
  }, [signatureName]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 100) {
      setSignatureName(value);
    }
  };

  const handleFontChange = (event: any) => {
    onChange({ ...signature, font: event.target.value });
  };

  const handleColorChange = (color: string) => {
    onChange({ ...signature, color });
  };

  const fontDropdownItems = FONT_STYLES.map((font) => ({
    label: (
      <Box sx={classes.dropdownItemContainer}>
        <Typography
          sx={classes.dropdownItemText(font.value)}
          aria-label={translateAria(["fontStyle"], {
            fontStyle: font.label
          })}
        >
          {signatureName || font.label}
        </Typography>
      </Box>
    ),
    value: font.value
  }));

  return (
    <Box sx={classes.container}>
      <InputField
        label={translateText(["name"])}
        value={signatureName}
        onChange={handleNameChange}
        inputProps={{ maxLength: 100 }}
        inputStyle={{ mb: "0.5rem" }}
        inputName="signatureName"
        required={true}
      />

      <Stack sx={classes.rowStack}>
        {" "}
        <Stack direction="row" spacing={1.5} sx={classes.colorContainer}>
          {FONT_COLORS.map((colorOption) => (
            <IconButton
              key={colorOption.value}
              onClick={() => handleColorChange(colorOption.value)}
              sx={classes.colorButton(colorOption.value)}
              aria-label={translateAria(["selectColor"], {
                colorName: colorOption.label
              })}
            >
              {signature.color === colorOption.value && (
                <Icon
                  name={IconName.CHECK_ICON}
                  width="1rem"
                  height="1rem"
                  fill={theme.palette.text.whiteText}
                />
              )}
            </IconButton>
          ))}
        </Stack>
        <Box sx={classes.dropdownBox}>
          <DropdownList
            value={signature.font}
            onChange={handleFontChange}
            inputName="font"
            itemList={fontDropdownItems}
            inputStyle={classes.dropdownStyle}
            selectStyles={classes.dropdownSelectStyles}
            ariaLabel={translateAria(["selectFont"])}
          />
        </Box>
      </Stack>

      <Box sx={classes.previewContainer}>
        <Typography sx={classes.previewText(signature, fontsLoaded)}>
          {signatureName}
        </Typography>
      </Box>
    </Box>
  );
};
