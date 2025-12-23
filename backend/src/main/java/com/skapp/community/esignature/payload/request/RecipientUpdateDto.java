package com.skapp.community.esignature.payload.request;

import com.skapp.community.esignature.type.EmailReminderStatus;
import com.skapp.community.esignature.type.EmailStatus;
import com.skapp.community.esignature.type.RecipientStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipientUpdateDto {

	private RecipientStatus status;

	private String reminderBatchId;

	private EmailReminderStatus reminderStatus;

	private EmailStatus emailStatus;

}
