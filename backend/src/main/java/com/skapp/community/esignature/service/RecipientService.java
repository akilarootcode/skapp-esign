package com.skapp.community.esignature.service;

import com.skapp.community.common.payload.response.ResponseEntityDto;
import com.skapp.community.esignature.model.Document;
import com.skapp.community.esignature.model.DocumentLink;
import com.skapp.community.esignature.model.Envelope;
import com.skapp.community.esignature.model.Recipient;
import com.skapp.community.esignature.payload.request.RecipientUpdateDto;
import com.skapp.community.esignature.type.SignType;

import java.util.List;
import java.util.Optional;

public interface RecipientService {

	DocumentLinksAndRecipientsData notifyDocumentFirstRecipients(List<Recipient> recipients, SignType signType);

	List<Recipient> sendEmailToNextRecipients(List<Recipient> nextRecipientList, Document document);

	List<Recipient> getNextSignRecipientData(Optional<Long> recipientId, Long envelopeId);

	void sendDocumentCompletedEmailNotifications(Envelope envelope);

	ResponseEntityDto updateRecipient(Long recipientId, RecipientUpdateDto recipientUpdateDto);

	ResponseEntityDto cancelEmailReminders(Long recipientId, Long envelopeId);

	ResponseEntityDto sendEmailWhenDocumentIsVoidedOrDeclined(Long envelopeId);

	ResponseEntityDto updateRecipientConsent(boolean isConsent);

	ResponseEntityDto sendNudgeEmail(Long recipientId);

	ResponseEntityDto voidAllRecipientsByEnvelopeId(Long envelopeId);

	ResponseEntityDto updateInternalRecipientConsent(Long recipientId, boolean isConsent);

	record DocumentLinksAndRecipientsData(List<DocumentLink> documentLinkList, List<Recipient> recipientList) {
	}

}
