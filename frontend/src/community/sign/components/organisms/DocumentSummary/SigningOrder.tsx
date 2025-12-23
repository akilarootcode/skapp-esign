import { Box, Stack, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { IconName } from "~community/common/types/IconTypes";
import { DocumentUserPrivilege } from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";

interface SigningOrderProps {
  translateText: (
    suffixes: string[],
    interpolationValues?: Record<string, any>
  ) => string;
  styles: any;
}

const SigningOrder: React.FC<SigningOrderProps> = ({
  translateText,
  styles
}) => {
  const theme = useTheme();
  const { recipients, isSigningOrderEnabled } = useESignStore();

  const signingOrderItems = useMemo(() => {
    return recipients.map((recipient, index) => {
      const colorIndex = index % theme.palette.recipientsColors.length;
      return (
        <Box key={recipient.addressBookId} sx={styles.signingOrderItem}>
          <Box display="flex" alignItems="center" width="100%">
            {isSigningOrderEnabled && (
              <Box sx={styles.indexBox} flexShrink={0}>
                <Typography>{index + 1}.</Typography>
              </Box>
            )}

            <Box
              sx={{
                ...styles.emailBox,
                width: isSigningOrderEnabled ? styles.emailBox.width : "100%",
                display: "flex",
                alignItems: "center"
              }}
            >
              <Box
                sx={styles.colorCircle(
                  theme.palette.recipientsColors[colorIndex].border
                )}
                flexShrink={0}
              />
              <Box sx={{ flex: 5 }}>
                <Typography>{recipient.email}</Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 1
                }}
              >
                {recipient.userPrivileges === DocumentUserPrivilege.SIGNER ? (
                  <>
                    <Icon name={IconName.SIGN_ICON} />
                    <Typography variant="caption" color="text.secondary">
                      {translateText(["signer"])}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Icon
                      name={IconName.VIEW_ICON}
                      width="1.5rem"
                      height="1.5rem"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {translateText(["cc"])}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      );
    });
  }, [recipients, translateText, styles]);

  return (
    <Stack gap="24px" mt="24px">
      <Typography variant="h3">
        {isSigningOrderEnabled
          ? translateText(["signingOrder"])
          : translateText(["recipients"])}
      </Typography>
      {signingOrderItems}
    </Stack>
  );
};

export default SigningOrder;
