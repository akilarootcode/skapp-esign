package com.skapp.community.esignature.repository;

import com.skapp.community.esignature.model.Envelope;
import com.skapp.community.esignature.payload.request.EnvelopeInboxFilterDto;
import com.skapp.community.esignature.payload.request.EnvelopeSentFilterDto;
import com.skapp.community.esignature.repository.projection.EnvelopeNextData;
import com.skapp.community.esignature.type.EnvelopeStatus;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface EnvelopeRepository {

	long countNeedToSignEnvelopes(Long currentUserId);

	Page<Envelope> getAllUserEnvelopes(Long currentUserId, EnvelopeInboxFilterDto envelopeInboxFilterDto);

	Page<EnvelopeNextData> getCurrentUserEnvelopesByExpireDate(Long currentUserId, int page, int size);

	Page<Envelope> getAllSentEnvelopes(Long currentUserId, EnvelopeSentFilterDto envelopeSentFilterDto,
			boolean isAllSentEnvelopes);

	Map<EnvelopeStatus, Long> countEnvelopesByStatus(Long userId, boolean isAllCount);

	Envelope findByIdWithRecipientsForUpdate(Long envelopeId);

}
