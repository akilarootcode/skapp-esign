package com.skapp.community.esignature.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.skapp.community.common.payload.response.ResponseEntityDto;
import com.skapp.community.esignature.model.AddressBook;
import com.skapp.community.esignature.model.AuditTrail;
import com.skapp.community.esignature.model.Envelope;
import com.skapp.community.esignature.model.Recipient;
import com.skapp.community.esignature.payload.request.AuditTrailDto;
import com.skapp.community.esignature.type.AuditAction;

public interface AuditTrailService {

	ResponseEntityDto createAuditTrail(AuditTrailDto auditTrailDTO, String ipAddress, boolean isDocAccess);

	ResponseEntityDto validateAuditTrailHash(Long auditTrailId);

	ResponseEntityDto validateEnvelopeAuditTrails(Long envelopeId);

	ResponseEntityDto getAuditTrailsBySentEnvelope(Long envelopeId);

	ResponseEntityDto getAuditTrailsByInboxEnvelope(Long envelopeId);

	AuditTrail processAuditTrailInfo(Envelope envelope, Recipient recipient, AuditAction action,
			AddressBook addressBook, String ipAddress, JsonNode metadata);

}
