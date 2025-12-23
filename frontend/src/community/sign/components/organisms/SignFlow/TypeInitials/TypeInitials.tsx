import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import DropdownList from "~community/common/components/molecules/DropdownList/DropdownList";
import InputField from "~community/common/components/molecules/InputField/InputField";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { DropdownListType } from "~community/common/types/CommonTypes";
import { IconName } from "~community/common/types/IconTypes";
import { FONT_COLORS, FONT_STYLES } from "~community/sign/constants";
import { useESignStore } from "~community/sign/store/signStore";

import { styles } from "./styles";

interface TypedInitials {
  name: string;
  font: string;
  color: string;
}

interface TypeInitialsProps {
  initials: TypedInitials;
  onChange: (initials: TypedInitials) => void;
}

export const TypeInitials: React.FC<TypeInitialsProps> = ({
  initials,
  onChange
}) => {
  const { documentInfo } = useESignStore();
  const translateText = useTranslator("eSignatureModule", "sign");
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "typeInitials"
  );
  const theme = useTheme();
  const classes = styles(theme);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fullName, setFullName] = useState("");
  const [generatedInitials, setGeneratedInitials] = useState("");
  const [fontDropdownItems, setFontDropdownItems] = useState<
    DropdownListType[]
  >([]);

  useEffect(() => {
    if (documentInfo?.name && !fullName) {
      setFullName(documentInfo.name);
    }
  }, [documentInfo]);

  useEffect(() => {
    if (!initials.font && FONT_STYLES.length > 0) {
      onChange({
        ...initials,
        name: initials.name || documentInfo.name,
        font: FONT_STYLES[0].value,
        color: initials.color || FONT_COLORS[0].value
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (fullName) {
      const generatedInitialsText = generateInitialsFromName(fullName);
      setGeneratedInitials(generatedInitialsText);
      onChange({
        ...initials,
        name: generatedInitialsText
      });
    } else {
      setGeneratedInitials("");
      onChange({
        ...initials,
        name: ""
      });
    }
  }, [fullName]);

  const generateInitialsFromName = (name: string): string => {
    if (!name || name.trim() === "") return "";

    const words = name.split(" ").filter((word) => word.trim() !== "");

    if (words.length === 0) return "";

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return words.map((word) => word[0].toUpperCase()).join("");
  };

  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFullName(value);
  };

  const handleFontChange = (event: any) => {
    onChange({ ...initials, font: event.target.value });
  };

  const handleColorChange = (color: string) => {
    onChange({ ...initials, color });
  };

  useEffect(() => {
    const items = FONT_STYLES.map((font) => ({
      label: (
        <Box sx={classes.dropdownItemContainer}>
          <Typography sx={classes.dropdownItemText(font.value)}>
            {generatedInitials || font.label}
          </Typography>
        </Box>
      ),
      value: font.value
    }));

    setFontDropdownItems(items);
  }, [generatedInitials, FONT_STYLES]);

  return (
    <Box sx={classes.container}>
      <InputField
        label={translateText(["name"])}
        value={fullName}
        onChange={handleFullNameChange}
        inputProps={{ maxLength: 100 }}
        inputStyle={{ mb: 2 }}
        inputName="name"
        required={true}
      />

      <Stack direction="row" spacing={2} mb={2} alignItems="center">
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
              {initials.color === colorOption.value && (
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
        <Box sx={classes.dropdownContainer}>
          <DropdownList
            value={initials.font}
            onChange={handleFontChange}
            inputName="font"
            itemList={fontDropdownItems}
            inputStyle={classes.dropdownStyle}
            selectStyles={classes.dropdownSelectStyles}
          />
        </Box>
      </Stack>

      <Box sx={classes.previewContainer}>
        <Typography sx={classes.previewText(initials, fontsLoaded)}>
          {generatedInitials}
        </Typography>
      </Box>
    </Box>
  );
};
