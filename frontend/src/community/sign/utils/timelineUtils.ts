import { IconName } from "~community/common/types/IconTypes";
import { formatTimestampWithTime } from "~community/common/utils/dateTimeUtils";
import { MetadataKeys } from "~community/sign/enums/CommonDocumentsEnums";
import { EnvelopeAction } from "~community/sign/enums/CommonEnums";
import { getMetadataValue } from "~community/sign/utils/commonUtils";

export interface AuditLogEntry {
  auditId: number;
  action: string;
  actionDoneByName: string | null;
  timestamp: string;
  metadata: Array<{ name: string; value: string }>;
  isAuthorized: boolean;
  hash: string;
}

export interface TimelineItem {
  id: string;
  icon: IconName;
  title: string;
  timestamp: string;
}

export const getTimelineItemsFromAuditLogs = (
  auditLogs: AuditLogEntry[] | undefined,
  translateText: (path: string[]) => string
): TimelineItem[] => {
  if (!auditLogs) return [];

  return auditLogs.map((log: AuditLogEntry) => {
    const formattedDate = formatTimestampWithTime(log.timestamp);
    let icon = IconName.CREATE_DOCUMENT_ICON;
    let title = log.action;

    switch (log.action) {
      case EnvelopeAction.ENVELOPE_CREATED:
        icon = IconName.CREATE_DOCUMENT_ICON;
        title = `${log.actionDoneByName || ""} ${translateText(["timeline.actions.envelope_created"])}`;
        break;
      case EnvelopeAction.ENVELOPE_SENT:
        icon = IconName.SEND_ICON;
        title = `${log.actionDoneByName || ""} ${translateText(["timeline.actions.envelope_sent"])}`;
        break;
      case EnvelopeAction.ENVELOPE_VIEWED:
        icon = IconName.EYE_ICON;
        title = `${log.actionDoneByName || ""} ${translateText(["timeline.actions.envelope_viewed"])}`;
        break;
      case EnvelopeAction.ENVELOPE_SIGNED:
        icon = IconName.SIGNATURE_ICON;
        title = `${log.actionDoneByName || ""} ${translateText(["timeline.actions.envelope_signed"])}`;
        break;
      case EnvelopeAction.ENVELOPE_COMPLETED:
        icon = IconName.CHECK_CIRCLE_OUTLINE_ICON;
        title = translateText(["timeline.actions.envelope_completed"]);
        break;
      case EnvelopeAction.ENVELOPE_VOIDED:
        icon = IconName.CROSSED_CIRCLE_ICON;
        title = translateText(["timeline.actions.envelope_voided"]);
        break;
      case EnvelopeAction.ENVELOPE_DECLINED:
        icon = IconName.DECLINED_ICON;
        title = `${log.actionDoneByName || ""} ${translateText(["timeline.actions.envelope_declined"])}`;
        break;
      case EnvelopeAction.ENVELOPE_EXPIRED:
        icon = IconName.CLOCK_DENY_ICON;
        title = translateText(["timeline.actions.envelope_expired"]);
        break;
      case EnvelopeAction.DOCUMENT_DOWNLOADED:
        icon = IconName.DOWNLOAD_DOCUMENT_ICON;
        title = `${log.actionDoneByName || ""} ${translateText(["timeline.actions.envelope_downloaded"])}`;
        break;
      case EnvelopeAction.ENVELOPE_CUSTODY_TRANSFERRED:
        icon = IconName.CREATE_DOCUMENT_ICON;
        title = `${log.actionDoneByName || ""} ${translateText(["timeline.actions.envelope_ownership_transferred"])} ${getMetadataValue(log.metadata, MetadataKeys.CURRENT_OWNER)}`;
        break;
      default:
        icon = IconName.CREATE_DOCUMENT_ICON;
        title = log.action;
    }

    return {
      id: log.auditId.toString(),
      icon,
      title,
      timestamp: formattedDate
    };
  });
};
