import { Tab, Tabs, useTheme } from "@mui/material";
import React from "react";

import { SignatureTabType } from "~community/sign/enums/CommonEnums";

interface SignatureTabsProps {
  activeTab: SignatureTabType;
  onTabChange: (
    event: React.SyntheticEvent,
    newValue: SignatureTabType
  ) => void;
}

export const SignatureTabs: React.FC<SignatureTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const theme = useTheme();

  const tabs = [
    { value: SignatureTabType.TYPE, label: "Type" },
    { value: SignatureTabType.DRAW, label: "Draw" },
    { value: SignatureTabType.UPLOAD, label: "Upload" }
  ] as const;

  const getTabStyles = (tabValue: SignatureTabType) => ({
    borderRadius: "0.25rem",
    fontFamily: theme.typography.fontFamily,
    ...(activeTab === tabValue
      ? {
          "&.Mui-selected": {
            borderColor: theme.palette.primary.dark,
            color: theme.palette.primary.dark,
            bgcolor: theme.palette.secondary.main,
            borderRadius: 0
          }
        }
      : {})
  });

  return (
    <Tabs
      value={activeTab}
      onChange={onTabChange}
      sx={{
        mb: 2,
        bgcolor: theme.palette.grey[100],
        width: "16.875rem",
        "& .MuiTabs-indicator": {
          backgroundColor: theme.palette.primary.dark
        }
      }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          value={tab.value}
          label={tab.label}
          sx={getTabStyles(tab.value)}
        />
      ))}
    </Tabs>
  );
};
