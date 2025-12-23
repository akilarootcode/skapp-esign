package com.skapp.community.esignature.payload.email;

import com.skapp.community.common.type.EmailButtonText;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EpEsignEnvelopeRecipientEmailDynamicFields {

	private String envelopeSubject;

	private String envelopeMessage;

	private String recipientName;

	private String sender;

	private String senderEmail;

	private Long envelopId;

	private String envelopName;

	private String documentAccessUrl;

	private String documentNames;

	private String appUrl;

	private String buttonText = EmailButtonText.ESIGN_EMAIL_BUTTON_TEXT.name();

	private Long sendAt;

	private String batchId;

	private String voidReason;

	private String declinedBy;

	private String title;

}
