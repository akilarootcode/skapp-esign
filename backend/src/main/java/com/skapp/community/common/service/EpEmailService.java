package com.skapp.community.common.service;

public interface EpEmailService {

	String obtainSendGridBatchId();

	void cancelScheduledEmail(String batchId, String status);

}
