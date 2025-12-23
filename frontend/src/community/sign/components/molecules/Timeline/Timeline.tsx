import { Box } from "@mui/material";
import React, { Fragment } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { theme } from "~community/common/theme/theme";
import { IconName } from "~community/common/types/IconTypes";

import {
  IconColumn,
  IconWrapper,
  TimelineContainer,
  TimelineHeader,
  TimelineItemTimestamp,
  TimelineItemTitle,
  TimelineItemWrapper,
  TimelineLine,
  TimelineRow
} from "./styles";

interface TimelineItem {
  id: string;
  icon: IconName;
  title: string;
  timestamp: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const translateText = useTranslator("eSignatureModule", "envelopeDetails");
  const translateAria = useTranslator("eSignatureModuleAria", "components");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }}
    >
      <TimelineHeader
        id="timeline-description"
        aria-label={translateAria(["timeline", "header"])}
      >
        {translateText(["timeline.header"])}
      </TimelineHeader>
      <TimelineContainer
        role="document"
        tabIndex={0}
        aria-describedby="timeline-description"
      >
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          return (
            <Fragment key={item.id}>
              <TimelineRow>
                <IconColumn>
                  <IconWrapper>
                    <Icon
                      name={item.icon}
                      fill={theme.palette.primary.dark}
                      width="1.5rem"
                      height="1.5rem"
                    />
                  </IconWrapper>
                  {!isLastItem && <TimelineLine />}
                </IconColumn>
                <TimelineItemWrapper
                  elevation={0}
                  role="region"
                  tabIndex={0}
                  aria-label={translateAria(["timeline.item"], {
                    title: item.title,
                    timestamp: item.timestamp
                  })}
                >
                  <TimelineItemTitle aria-hidden={true}>
                    {item.title}
                  </TimelineItemTitle>
                  <TimelineItemTimestamp aria-hidden={true}>
                    <Icon
                      name={IconName.CLOCK_ICON}
                      fill={theme.palette.text.secondary}
                    />
                    {item.timestamp}
                  </TimelineItemTimestamp>
                </TimelineItemWrapper>
              </TimelineRow>
            </Fragment>
          );
        })}
      </TimelineContainer>
    </Box>
  );
};

export default Timeline;
