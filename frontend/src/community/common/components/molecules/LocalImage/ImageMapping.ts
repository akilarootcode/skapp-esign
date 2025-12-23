import { StaticImageData } from "next/image";

import RocketNoBG from "~community/common/assets/images/RocketNoBG.png";
import DocumentError from "~community/common/assets/images/document-error.png";
import DocumentExpired from "~community/common/assets/images/document-expired.png";
import DocumentNotFound from "~community/common/assets/images/document-not-found.png";
import DocumentSigned from "~community/common/assets/images/document-signed.png";
import DocumentDeclined from "~community/common/assets/images/document-x.png";
import DocumentLinkExpired from "~community/common/assets/images/link-expired.png";
import MailBox from "~community/common/assets/images/mailbox.png";
import PaperPlane from "~community/common/assets/images/paper-plane.png";
import SkappLogo from "~community/common/assets/images/skapp-logo.png";
import UpgradeInvoiceLogo from "~community/common/assets/images/upgrade-invoice-logo.png";

import { ImageName } from "../../../types/ImageTypes";

export const ImageMapping: Record<ImageName, StaticImageData> = {
  [ImageName.MAIL_BOX]: MailBox,
  [ImageName.DOCUMENT_SIGNED]: DocumentSigned,
  [ImageName.DOCUMENT_DECLINED]: DocumentDeclined,
  [ImageName.DOCUMENT_ERROR]: DocumentError,
  [ImageName.DOCUMENT_EXPIRED]: DocumentExpired,
  [ImageName.DOCUMENT_NOT_FOUND]: DocumentNotFound,
  [ImageName.DOCUMENT_LINK_EXPIRED]: DocumentLinkExpired,
  [ImageName.PAPER_PLANE]: PaperPlane,
  [ImageName.SKAPP_LOGO]: SkappLogo,
  [ImageName.ROCKET_NOBG]: RocketNoBG,
  [ImageName.UPGRADE_INVOICE_LOGO]: UpgradeInvoiceLogo
  // Add more images here as needed
};
