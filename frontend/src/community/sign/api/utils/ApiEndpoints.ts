import { moduleAPIPath } from "~community/common/constants/configsEnterprise";

export const eSignEndpoints = {
  SEARCH_RECIPIENTS_FOR_DOCUMENTS: `${moduleAPIPath.ESIGN}/address-book/recipients/search`,
  CREATE_EXTERNAL_USER: `${moduleAPIPath.ESIGN}/address-book/add-external-user`,
  DELETE_EXTERNAL_USER: `${moduleAPIPath.ESIGN}/address-book/delete-external-user`,
  UPDATE_EXTERNAL_USER: `${moduleAPIPath.ESIGN}/address-book/edit-external-user`,
  UPLOAD_DOCUMENT_PATH: `${moduleAPIPath.ESIGN}/documents`,
  EDIT_DOCUMENT: (id: string) => `${moduleAPIPath.ESIGN}/documents/${id}`,
  DELETE_DOCUMENT: (id: string) => `${moduleAPIPath.ESIGN}/documents/${id}`,
  GET_CONTACTS: `${moduleAPIPath.ESIGN}/address-book?`,
  CREATE_ENVELOP: `${moduleAPIPath.ESIGN}/envelopes`,
  GET_ESIGN_CONFIGS: `${moduleAPIPath.ESIGN}/config`,
  EXTERNAL_GET_ESIGN_CONFIGS: `${moduleAPIPath.ESIGN}/config/external`,
  UPDATE_ESIGN_CONFIGS: `${moduleAPIPath.ESIGN}/config`,
  EXTERNAL_DOCUMENT_LINK_ACCESS: `${moduleAPIPath.ESIGN}/document-link/access`,
  INTERNAL_DOCUMENT_LINK_ACCESS: `${moduleAPIPath.ESIGN}/document-link/internal/access`,
  GET_ENVELOPE_DETAILS: `${moduleAPIPath.ESIGN}/envelopes/inbox/me`,
  GET_ENVELOPE_DETAILS_BY_USER_ID: (userId: number) =>
    `${moduleAPIPath.ESIGN}/envelopes/inbox/${userId}`,
  GET_NEED_TO_SIGN_ENVELOPES_COUNT: (userId: number) =>
    `${moduleAPIPath.ESIGN}/envelopes/need-to-sign/${userId}/count`,
  EXTERNAL_SIGN_DOCUMENT: `${moduleAPIPath.ESIGN}/documents/sign`,
  INTERNAL_SIGN_DOCUMENT: `${moduleAPIPath.ESIGN}/documents/internal/sign`,
  SIGN_FIELD: `${moduleAPIPath.ESIGN}/documents/sign-field`,
  GET_ALL_SENT_ENVELOPES: `${moduleAPIPath.ESIGN}/envelopes/sent/me`,
  GET_SENT_ENVELOPE_STATS: `${moduleAPIPath.ESIGN}/envelopes/sender/basic/analytics`,
  VOID_ENVELOPE: (envelopeId: number) =>
    `${moduleAPIPath.ESIGN}/envelopes/void/${envelopeId}`,
  GET_ENVELOPE_BY_ID: (envelopeId: number) =>
    `${moduleAPIPath.ESIGN}/envelopes/${envelopeId}`,
  SEARCH_INTERNAL_ESIGN__SENDERS: `${moduleAPIPath.ESIGN}/address-book/senders/search`,
  GET_ENVELOPE_SENDER_DETAILS_BY_ID: (envelopeId: number) =>
    `${moduleAPIPath.ESIGN}/envelopes/envelope-sender/${envelopeId}`,
  GET_INBOX_DETAILS_BY_ID: (envelopeId: number) =>
    `${moduleAPIPath.ESIGN}/envelopes/${envelopeId}`,
  NUDGE_RECIPIENT: `${moduleAPIPath.ESIGN}/recipients/nudge`,
  GET_SENT_ENVELOPE_AUDIT_LOGS: (envelopeId: number) =>
    `${moduleAPIPath.ESIGN}/audit-trial/sent/envelope/${envelopeId}`,
  GET_INBOX_ENVELOPE_AUDIT_LOGS: (envelopeId: number) =>
    `${moduleAPIPath.ESIGN}/audit-trial/inbox/envelope/${envelopeId}`,
  RESEND_LINK: `${moduleAPIPath.ESIGN}/document-link/resend`,
  TRANSFER_ENVELOPE_CUSTODY: `${moduleAPIPath.ESIGN}/envelopes/custody-transfer`,
  EXTERNAL_RECIPIENT_CONSENT: `${moduleAPIPath.ESIGN}/recipients/consent`,
  INTERNAL_RECIPIENT_CONSENT: `${moduleAPIPath.ESIGN}/recipients/internal/consent`,
  EXTERNAL_CREATE_ENVELOPE_AUDIT_LOGS: `${moduleAPIPath.ESIGN}/audit-trial/create`,
  INTERNAL_CREATE_ENVELOPE_AUDIT_LOGS: `${moduleAPIPath.ESIGN}/audit-trial/internal/create`,
  GET_MY_SIGNATURE_LINK: `${moduleAPIPath.ESIGN}/address-book/my-signature-link`,
  ADD_UPDATE_MY_SIGNATURE_LINK: `${moduleAPIPath.ESIGN}/address-book/my-signature-link`,
  EXTERNAL_DECLINE_DOCUMENT: `${moduleAPIPath.ESIGN}/envelopes/decline`,
  INTERNAL_DECLINE_DOCUMENT: `${moduleAPIPath.ESIGN}/envelopes/internal/decline`,
  TOKEN_EXCHANGE: `${moduleAPIPath.ESIGN}/document-link/token-exchange`,
  GET_ENVELOPE_LIMITATION: `${moduleAPIPath.ESIGN}/envelopes/envelope-limitation`,
  DOWNLOAD_ENVELOPE_SIGNATURE_CERTIFICATE: `${moduleAPIPath.ESIGN}/envelopes/internal/signature-certificate`,
  GET_NEXT_NEEDTOSIGN_ENVELOPES: `${moduleAPIPath.ESIGN}/envelopes/next`
};

export const cloudFrontEndpoints = {
  INTERNAL_DOCUMENT_COOKIES: `/ep/cf/cookies/internal/document`,
  EXTERNAL_DOCUMENT_COOKIES: `/ep/cf/cookies/document`,
  INTERNAL_SIGNATURE_COOKIES: `/ep/cf/cookies/internal/signature`,
  EXTERNAL_SIGNATURE_COOKIES: `/ep/cf/cookies/signature`
};
