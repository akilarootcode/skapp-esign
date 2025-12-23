package com.skapp.community.esignature.service;

import com.skapp.community.common.payload.response.ResponseEntityDto;
import com.skapp.community.esignature.model.Document;
import com.skapp.community.esignature.model.DocumentLink;
import com.skapp.community.esignature.model.Envelope;
import com.skapp.community.esignature.model.Recipient;
import com.skapp.community.esignature.payload.request.DocumentAccessUrlDto;
import com.skapp.community.esignature.payload.request.ResendAccessUrlDto;
import com.skapp.community.esignature.payload.response.DocumentLinkResponseDto;
import com.skapp.community.esignature.type.DocumentPermissionType;

public interface DocumentLinkService {

	DocumentLinkResponseDto generateDocumentAccessUrl(DocumentAccessUrlDto documentAccessUrlDto);

	void validatePermissionForGenerateAccessUrl(Envelope envelope, Recipient recipient,
			DocumentPermissionType requestedPermission);

	void resendDocumentAccessURL(ResendAccessUrlDto resendAccessUrlDto);

	DocumentLinkData createDocumentLinkData(DocumentAccessUrlDto documentAccessUrlDto, Recipient recipient,
			Document document, Envelope envelope);

	ResponseEntityDto getRecipientDocumentData(Long documentId, Long recipientId, boolean isDocAccess);

	String getDocumentAccessUrlForNudge(Envelope envelope, Recipient recipient);

	DocumentLink getDocumentLinkFromToken();

	void validateTokenFlows(boolean isDocAccess, Recipient recipient, Long documentId);

	ResponseEntityDto getTokenFromUuid(String uuid, String state);

	ResponseEntityDto getTokenResendStatus(String token);

	record DocumentLinkData(DocumentLink documentLink, String accessUrl) {
	}

}
