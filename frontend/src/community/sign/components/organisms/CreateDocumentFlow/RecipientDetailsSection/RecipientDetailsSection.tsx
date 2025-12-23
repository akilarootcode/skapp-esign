import { Divider, Stack, Typography, useTheme } from "@mui/material";



import SwitchRow from "~community/common/components/atoms/SwitchRow/SwitchRow";
import { useTranslator } from "~community/common/hooks/useTranslator";
import RecipientRows from "~community/sign/components/molecules/RecipientRows/RecipientRows";
import { useESignStore } from "~community/sign/store/signStore";


const RecipientDetailsSection = () => {
  const theme = useTheme();

  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.recipientDetails"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "recipientDetailsSection"
  );
  const { isSigningOrderEnabled, setIsSigningOrderEnabled } = useESignStore();
  return (
    <Stack component="section">
      <Stack component="div">
        <Typography variant="h2">{translateText(["title"])}</Typography>
        <Divider
          sx={{
            margin: "1rem 0"
          }}
        />
      </Stack>{" "}
      <Stack
        component="div"
        direction="row"
        spacing={2}
        marginBottom={2}
        alignItems="center"
      >
        <SwitchRow
          checked={isSigningOrderEnabled}
          onChange={(checked) => setIsSigningOrderEnabled(checked)}
          labelId="enable-signing-order-switch"
          wrapperStyles={{ width: "auto" }}
          arialabelUnchecked={translateAria(["signingOrderEnabledSwitch"])}
          arialabelChecked={translateAria(["signingOrderEnabledSwitch"])}
        />
        <Typography variant="body1">
          {translateText(["setSigningOrder"])}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        marginBottom="1.5rem"
        color={theme.palette.text.secondary}
      >
        {translateText(["subTitle"])}
      </Typography>
      <RecipientRows />
    </Stack>
  );
};

export default RecipientDetailsSection;