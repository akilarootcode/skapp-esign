package com.skapp.community.common.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import com.skapp.community.common.constant.ApiUriConstants;
import com.skapp.community.common.constant.CommonConstants;
import com.skapp.community.common.constant.CommonMessageConstant;
import com.skapp.community.common.exception.ModuleException;
import com.skapp.community.common.exception.TooManyRequestsException;
import com.skapp.community.common.service.AsyncEmailSender;
import com.skapp.community.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AsyncEmailSenderImpl implements AsyncEmailSender {

	@Value("${sendgrid.api.key}")
	private String sendGridApiKey;

	@Value("${organization.email}")
	private String organizationEmail;

	@Override
	public void sendMail(String to, String subject, String htmlBody, Map<String, String> placeholders) {
		try {
			Mail mail = buildMail(to, subject, htmlBody, placeholders);
			SendGrid sendGrid = new SendGrid(sendGridApiKey);
			Request request = new Request();
			request.setMethod(Method.POST);
			request.setEndpoint(ApiUriConstants.SENDGRID_POST_API);
			request.setBody(mail.build());

			Response response = sendGrid.api(request);

			if (response.getStatusCode() == 429) {
				throw new TooManyRequestsException(CommonMessageConstant.COMMON_ERROR_TOO_MANY_REQUESTS_EXCEPTION);
			}
		}
		catch (IOException e) {
			log.error("Error sending email to {}: {}", to, e.getMessage());
		}
	}

	private Mail buildMail(String to, String subject, String htmlBody, Map<String, String> placeholders) {
		String senderName = CommonConstants.APPLICATION_NAME;
		if (placeholders != null) {
			String module = placeholders.get(CommonConstants.MODULE);
			if (CommonConstants.ESIGNATURE.equalsIgnoreCase(module)) {
				String sender = placeholders.getOrDefault(CommonConstants.SENDER, "");
				if (!StringUtils.isNullOrBlank(sender)) {
					senderName = sender + CommonConstants.VIA + CommonConstants.APPLICATION_NAME;
				}
			}
		}
		Email from = new Email(organizationEmail, senderName);
		Email toEmail = new Email(to);
		Content content = new Content("text/html", htmlBody);

		Mail mail = new Mail();
		mail.setFrom(from);
		mail.setSubject(Objects.requireNonNull(placeholders).containsKey("envelopeSubject")
				&& !placeholders.get("envelopeSubject").equalsIgnoreCase("null")
						? subject + " " + placeholders.get("envelopeSubject") : subject);
		mail.addContent(content);

		if (placeholders.containsKey("sendAt") && !placeholders.get("sendAt").equalsIgnoreCase("null")) {
			mail.setSendAt(Long.parseLong(placeholders.get("sendAt")));
			mail.setBatchId(placeholders.get("batchId"));
		}

		Personalization personalization = new Personalization();
		personalization.addTo(toEmail);

		mail.addPersonalization(personalization);

		return mail;
	}

	@Override
	public String getSendGridEmailBatchId() {
		String batchId;
		try {
			SendGrid sendGrid = new SendGrid(sendGridApiKey);
			Request request = new Request();
			request.setMethod(Method.POST);
			request.setEndpoint(ApiUriConstants.SENDGRID_CREATE_BACTH_ID_API);

			Response response = sendGrid.api(request);

			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode jsonNode = objectMapper.readTree(response.getBody());

			batchId = jsonNode.has("batch_id") ? jsonNode.get("batch_id").asText() : null;

		}
		catch (IOException e) {
			throw new ModuleException(CommonMessageConstant.EP_COMMON_ERROR_EMAIL_BATCH_ID_NOT_OBTAINED);
		}

		return batchId;
	}

	@Override
	public void cancelScheduledEmails(String batchId, String status) {
		if (batchId == null) {
			throw new ModuleException(
					CommonMessageConstant.EP_COMMON_ERROR_EMAIL_CANCEL_SCHEDULED_BATCH_ID_NOT_PRESENT);
		}

		if (status == null) {
			throw new ModuleException(CommonMessageConstant.EP_COMMON_ERROR_EMAIL_CANCEL_SCHEDULED_STATUS_NOT_PRESENT);
		}

		try {

			SendGrid sendGrid = new SendGrid(sendGridApiKey);
			Request request = new Request();
			request.setMethod(Method.POST);
			request.setEndpoint(ApiUriConstants.SENDGRID_CANCEL_SCHEDULED_EMAIL);
			String requestBody = String.format("{\"batch_id\": \"%s\", \"status\": \"%s\"}", batchId, status);
			request.setBody(requestBody);

			sendGrid.api(request);
		}
		catch (IOException e) {
			throw new ModuleException(CommonMessageConstant.EP_COMMON_ERROR_EMAIL_CANCEL_SCHEDULED_FAILED);
		}
	}

}
