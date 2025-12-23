import {
  GetAllInboxParams,
  GetAllSentParams
} from "~community/sign/types/ESignInboxTypes";

export const eSignQueryKeys = {
  getRecipientsForDocuments: function (searchTerm?: string) {
    return ["search-recipients", searchTerm];
  },
  contactDataTable: function (params?: {
    page?: number;
    sortKey?: string;
    sortOrder?: string;
  }) {
    return ["contact-table-data", params].filter((val) => val !== undefined);
  },
  getESignConfigs: ["eSign-configs"],
  getAllInboxEnvelopes: function (params: GetAllInboxParams) {
    return ["get-all-inbox-envelopes", params].filter(
      (val) => val !== undefined
    );
  },
  getAllInboxEnvelopesByUserId: function (
    params: GetAllInboxParams,
    userId: number
  ) {
    return ["get-all-inbox-envelopes-by-user-id", userId, params].filter(
      (val) => val !== undefined
    );
  },
  getAllSentEnvelopes: function (params: GetAllSentParams) {
    return ["get-all-sent-envelopes", params].filter(
      (val) => val !== undefined
    );
  },
  getNeedToSignCount: function (userId: number) {
    return ["get-need-to-sign-envelopes-count", userId];
  },
  getSentEnvelopeStats: ["get-sent-envelope-stats"],
  voidEnvelope: function (envelopeId: number) {
    return ["void-envelope", envelopeId];
  },
  getEnvelopeByID: function (envelopeId: number) {
    return ["get-specific-envelope", envelopeId];
  },
  getEnvelopeSenderDetailsById: function (envelopeId: number) {
    return ["get-envelope-sender-details", envelopeId];
  },
  getUseGetInboxDetailsById: function (envelopeId: number) {
    return ["get-inbox-details", envelopeId];
  },
  getEnvelopeAuditLogs: function (envelopeId: number) {
    return ["get-envelope-audit-logs", envelopeId];
  },
  searchInternalEsignSenders: function (params: string) {
    return ["search-internal-esign-senders", params];
  },
  transferEnvelopeCustody: function (envelopeId: number) {
    return ["transfer-envelope-custody", envelopeId];
  },
  getMySignatureLink: ["get-my-signature-link"],
  getInboxEnvelopeAuditLogs: function (envelopeId: number) {
    return ["get-inbox-envelope-audit-logs", envelopeId];
  },
  getEnvelopeLimitation: ["get-envelope-limitation"],
  getNextNeedToSignEnvelopes: function (page?: number, size?: number) {
    return ["get-next-need-to-sign-envelopes", page, size].filter(
      (val) => val !== undefined
    );
  }
};
