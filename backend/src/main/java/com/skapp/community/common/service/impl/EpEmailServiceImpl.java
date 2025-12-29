package com.skapp.community.common.service.impl;

import com.skapp.community.common.model.Organization;
import com.skapp.community.common.payload.email.EmailTemplateMetadata;
import com.skapp.community.common.repository.OrganizationDao;
import com.skapp.community.common.service.AsyncEmailSender;
import com.skapp.community.common.service.EpEmailService;
import com.skapp.community.common.type.EmailBodyTemplates;
import com.skapp.community.common.type.EmailTemplates;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Primary
@Slf4j
public class EpEmailServiceImpl extends EmailServiceImpl implements EpEmailService {

	private static final String EMAIL_LANGUAGE = "en";

	private final OrganizationDao organizationDao;

	private final AsyncEmailSender asyncEmailSender;

	public EpEmailServiceImpl(AsyncEmailSender asyncEmailSender, OrganizationDao organizationDao) {
		super(asyncEmailSender);
		this.organizationDao = organizationDao;
		this.asyncEmailSender = asyncEmailSender;
	}

	@Override
	public void loadTemplateDetails() {
		if (templateDetailsMap == null) {
			templateDetailsMap = new HashMap<>();

			addTemplatesFromPath("community/templates/email/email-templates.yml");
			addTemplatesFromPath("enterprise/templates/email/email-templates.yml");
		}

	}

	@Override
	protected void getEnumTranslationsStream() {
		if (enumTranslationsMap == null) {
			enumTranslationsMap = new HashMap<>();

			loadEnumTranslationsFromPath("community/templates/common/enum-translations.yml");
			loadEnumTranslationsFromPath("enterprise/templates/common/enum-translations.yml");

			log.info("Enum translations loaded. Map size: {}", enumTranslationsMap.size());
			if (!enumTranslationsMap.isEmpty()) {
				log.info("Sample enum translations: {}", enumTranslationsMap);
			}
		}
	}

	@Override
	protected String buildTemplatePath(String module, String templateId) {
		return findExistingPath(
				String.format("community/templates/email/%s/%s/%s.html", EMAIL_LANGUAGE, module, templateId),
				String.format("enterprise/templates/email/%s/%s/%s.html", EMAIL_LANGUAGE, module, templateId));
	}

	@Override
	protected String buildMainTemplatePath(EmailTemplates emailMainTemplate) {
		return findExistingPath(
				String.format("community/templates/email/%s/%s.html", EMAIL_LANGUAGE,
						emailMainTemplate.getTemplateId()),
				String.format("enterprise/templates/email/%s/%s.html", EMAIL_LANGUAGE,
						emailMainTemplate.getTemplateId()));
	}

	@Override
	protected void setTemplatePlaceholderData(EmailTemplates emailTemplate, Map<String, String> placeholders,
			EmailTemplateMetadata templateDetails, String module) {
		super.setTemplatePlaceholderData(emailTemplate, placeholders, templateDetails, module);
		placeholders.put("module", module);
		if (emailTemplate != EmailBodyTemplates.COMMON_MODULE_EMAIL_VERIFY
				&& emailTemplate != EmailBodyTemplates.COMMON_MODULE_GOOGLE_SSO_CREATION_TENANT_URL
				&& emailTemplate != EmailBodyTemplates.COMMON_MODULE_MICROSOFT_SSO_CREATION_TENANT_URL
				&& emailTemplate != EmailBodyTemplates.COMMON_MODULE_CREDENTIAL_BASED_CREATION_TENANT_URL
				&& emailTemplate != EmailBodyTemplates.DASHBOARD_MODULE_NEW_ORGANIZATION_CREATED
				&& emailTemplate != EmailBodyTemplates.DASHBOARD_MODULE_NEW_ORGANIZATION_STARTED_CORE_FREE_TRIAL
				&& emailTemplate != EmailBodyTemplates.DASHBOARD_MODULE_TRIAL_ORGANIZATION_CONVERTED_TO_CORE
				&& emailTemplate != EmailBodyTemplates.DASHBOARD_MODULE_ORGANIZATION_CANCELLED_CORE
				&& emailTemplate != EmailBodyTemplates.GUEST_MODULE_INVITATION) {
			Optional<Organization> organization = organizationDao.findTopByOrderByOrganizationIdDesc();
			organization.ifPresent(value -> {
				placeholders.put("appUrl", value.getAppUrl());
				placeholders.put("organizationName", value.getOrganizationName());
			});
		}

		if (emailTemplate == EmailBodyTemplates.GUEST_MODULE_INVITATION) {
			Optional<Organization> organization = organizationDao.findTopByOrderByOrganizationIdDesc();
			organization.ifPresent(value -> placeholders.put("organizationName", value.getOrganizationName()));
		}
	}

	@Override
	public String obtainSendGridBatchId() {
		return asyncEmailSender.getSendGridEmailBatchId();
	}

	@Override
	public void cancelScheduledEmail(String batchId, String status) {
		asyncEmailSender.cancelScheduledEmails(batchId, status);
	}

}
