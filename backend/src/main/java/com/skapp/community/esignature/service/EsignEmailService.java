package com.skapp.community.esignature.service;

import com.skapp.community.esignature.model.Envelope;
import com.skapp.community.esignature.model.Recipient;

public interface EsignEmailService {

	void resendEnvelopeEmailToRecipient(Envelope envelope, Recipient recipient, String documentAccessUrl);

	void sendCompleteEmailsToRecipient(Envelope envelope, Recipient mailRecipient, String documentAccessUrl);

	void sendCompleteEmailToSender(Envelope envelope);

	void sendNudgeEmail(Recipient recipient, String documentLinkUrl);

	String getDocumentAccessUrlForSender(Envelope envelope);

}
