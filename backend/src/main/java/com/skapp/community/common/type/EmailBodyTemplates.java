package com.skapp.community.common.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum EmailBodyTemplates implements EmailTemplates {

	// People Module Templates
	PEOPLE_MODULE_USER_INVITATION_V1("people-module-user-invitation"),
	PEOPLE_MODULE_USER_INVITATION_GOOGLE_SSO("people-module-user-invitation-google-sso"),
	PEOPLE_MODULE_USER_INVITATION_MICROSOFT_SSO("people-module-user-invitation-microsoft-sso"),
	PEOPLE_MODULE_USER_TERMINATION_V1("people-module-user-termination"),

	// Holiday Templates
	PEOPLE_MODULE_NEW_HOLIDAY_DECLARED("people-module-new-holiday-declared-employee"),
	PEOPLE_MODULE_HOLIDAY_SINGLE_DAY_PENDING_LEAVE_REQUEST_CANCELED_EMPLOYEE(
			"people-module-holiday-single-day-pending-leave-request-canceled-employee"),
	PEOPLE_MODULE_HOLIDAY_MULTI_DAY_PENDING_LEAVE_REQUEST_UPDATED_EMPLOYEE(
			"people-module-holiday-multi-day-pending-leave-request-updated-employee"),
	PEOPLE_MODULE_HOLIDAY_SINGLE_DAY_APPROVED_LEAVE_REQUEST_REVOKED_EMPLOYEE(
			"people-module-holiday-single-day-approved-leave-request-revoked-employee"),
	PEOPLE_MODULE_HOLIDAY_MULTI_DAY_APPROVED_LEAVE_REQUEST_UPDATED_EMPLOYEE(
			"people-module-holiday-multi-day-approved-leave-request-updated-employee"),
	PEOPLE_MODULE_HOLIDAY_SINGLE_DAY_PENDING_LEAVE_REQUEST_CANCELED_MANAGER(
			"people-module-holiday-single-day-pending-leave-request-canceled-manager"),
	PEOPLE_MODULE_HOLIDAY_DAY_MULTI_DAY_PENDING_LEAVE_REQUEST_UPDATED_MANAGER(
			"people-module-holiday-multi-day-pending-leave-request-updated-manager"),
	PEOPLE_MODULE_HOLIDAY_DAY_SINGLE_DAY_APPROVED_LEAVE_REQUEST_REVOKED_MANAGER(
			"people-module-holiday-single-day-approved-leave-request-revoked-manager"),
	PEOPLE_MODULE_HOLIDAY_MULTI_DAY_APPROVED_LEAVE_REQUEST_UPDATED_MANAGER(
			"people-module-holiday-multi-day-approved-leave-request-updated-manager"),
	PEOPLE_MODULE_PASSWORD_RESET_REQUEST_MANAGER("people-module-password-reset-request-manager"),

	// Attendance Module Templates

	// Non-Working Day Templates
	ATTENDANCE_MODULE_NON_WORKING_DAY_SINGLE_DAY_PENDING_LEAVE_REQUEST_CANCELED_EMPLOYEE(
			"attendance-module-non-working-day-single-day-pending-leave-request-canceled-employee"),
	ATTENDANCE_MODULE_NON_WORKING_DAY_MULTI_DAY_PENDING_LEAVE_REQUEST_CANCELED_EMPLOYEE(
			"attendance-module-non-working-day-multi-day-pending-leave-request-canceled-employee"),
	ATTENDANCE_MODULE_NON_WORKING_DAY_SINGLE_DAY_APPROVED_LEAVE_REQUEST_REVOKED_EMPLOYEE(
			"attendance-module-non-working-day-single-day-approved-leave-request-revoked-employee"),
	ATTENDANCE_MODULE_NON_WORKING_DAY_MULTI_DAY_APPROVED_LEAVE_REQUEST_REVOKED_EMPLOYEE(
			"attendance-module-non-working-day-multi-day-approved-leave-request-revoked-employee"),
	ATTENDANCE_MODULE_NON_WORKING_DAY_SINGLE_DAY_PENDING_LEAVE_REQUEST_CANCELED_MANAGER(
			"attendance-module-non-working-day-single-day-pending-leave-request-canceled-manager"),
	ATTENDANCE_MODULE_NON_WORKING_DAY_MULTI_DAY_PENDING_LEAVE_REQUEST_CANCELED_MANAGER(
			"attendance-module-non-working-day-multi-day-pending-leave-request-canceled-manager"),
	ATTENDANCE_MODULE_NON_WORKING_DAY_SINGLE_DAY_APPROVED_LEAVE_REQUEST_REVOKED_MANAGER(
			"attendance-module-non-working-day-single-day-approved-leave-request-revoked-manager"),
	ATTENDANCE_MODULE_NON_WORKING_DAY_MULTI_DAY_APPROVED_LEAVE_REQUEST_REVOKED_MANAGER(
			"attendance-module-non-working-day-multi-day-approved-leave-request-revoked-manager"),

	// Time Entry Templates
	ATTENDANCE_MODULE_TIME_ENTRY_REQUEST_SUBMITTED_EMPLOYEE("attendance-module-time-entry-request-submitted-employee"),
	ATTENDANCE_MODULE_RECEIVED_TIME_ENTRY_REQUEST_MANAGER("attendance-module-received-time-entry-request-manager"),
	ATTENDANCE_MODULE_TIME_ENTRY_REQUEST_APPROVED_EMPLOYEE("attendance-module-time-entry-request-approved-employee"),
	ATTENDANCE_MODULE_TIME_ENTRY_REQUEST_DECLINED_EMPLOYEE("attendance-module-time-entry-request-declined-employee"),
	ATTENDANCE_MODULE_PENDING_TIME_ENTRY_REQUEST_CANCELLED_EMPLOYEE(
			"attendance-module-pending-time-entry-request-cancelled-employee"),
	ATTENDANCE_MODULE_PENDING_TIME_ENTRY_REQUEST_CANCELLED_MANAGER(
			"attendance-module-pending-time-entry-request-cancelled-manager"),
	ATTENDANCE_MODULE_TIME_ENTRY_REQUEST_AUTO_APPROVED_EMPLOYEE(
			"attendance-module-time-entry-request-auto-approved-employee"),
	ATTENDANCE_MODULE_TIME_ENTRY_REQUEST_AUTO_APPROVED_MANAGER(
			"attendance-module-time-entry-request-auto-approved-manager"),
	ATTENDANCE_MODULE_TIME_ENTRY_REQUEST_APPROVED_OTHER_MANAGER(
			"attendance-module-time-entry-request-approved-other-manager"),
	ATTENDANCE_MODULE_TIME_ENTRY_REQUEST_DECLINED_OTHER_MANAGER(
			"attendance-module-time-entry-request-declined-other-manager"),

	// Leave Module Templates
	LEAVE_MODULE_EMPLOYEE_APPLY_SINGLE_DAY_LEAVE("leave-module-employee-apply-single-day-leave"),
	LEAVE_MODULE_EMPLOYEE_APPLY_MULTIPLE_DAY_LEAVE("leave-module-employee-apply-multiple-day-leave"),
	LEAVE_MODULE_MANAGER_RECEIVED_SINGLE_DAY_LEAVE("leave-module-manager-received-single-day-leave"),
	LEAVE_MODULE_MANAGER_RECEIVED_MULTIPLE_DAY_LEAVE("leave-module-manager-received-multiple-day-leave"),
	LEAVE_MODULE_EMPLOYEE_CANCEL_SINGLE_DAY_LEAVE("leave-module-employee-cancel-single-day-leave"),
	LEAVE_MODULE_EMPLOYEE_CANCEL_MULTIPLE_DAY_LEAVE("leave-module-employee-cancel-multiple-day-leave"),
	LEAVE_MODULE_MANAGER_CANCEL_SINGLE_DAY_LEAVE("leave-module-manager-cancel-single-day-leave"),
	LEAVE_MODULE_MANAGER_CANCEL_MULTIPLE_DAY_LEAVE("leave-module-manager-cancel-multiple-day-leave"),
	LEAVE_MODULE_EMPLOYEE_APPROVED_SINGLE_DAY_LEAVE("leave-module-employee-approved-single-day-leave"),
	LEAVE_MODULE_EMPLOYEE_APPROVED_MULTI_DAY_LEAVE("leave-module-employee-approved-multi-day-leave"),
	LEAVE_MODULE_EMPLOYEE_REVOKED_SINGLE_DAY_LEAVE("leave-module-employee-revoked-single-day-leave"),
	LEAVE_MODULE_EMPLOYEE_REVOKED_MULTI_DAY_LEAVE("leave-module-employee-revoked-multi-day-leave"),
	LEAVE_MODULE_EMPLOYEE_DECLINED_SINGLE_DAY_LEAVE("leave-module-employee-declined-single-day-leave"),
	LEAVE_MODULE_EMPLOYEE_DECLINED_MULTI_DAY_LEAVE("leave-module-employee-declined-multi-day-leave"),
	LEAVE_MODULE_EMPLOYEE_AUTO_APPROVED_SINGLE_DAY_LEAVE("leave-module-employee-auto-approved-single-day-leave"),
	LEAVE_MODULE_EMPLOYEE_AUTO_APPROVED_MULTI_DAY_LEAVE("leave-module-employee-auto-approved-multi-day-leave"),
	LEAVE_MODULE_EMPLOYEE_LEAVE_CARRY_FORWARD("leave-module-employee-leave-carry-forward"),
	LEAVE_MODULE_EMPLOYEE_CUSTOM_ALLOCATION("leave-module-employee-custom-allocation"),
	LEAVE_MODULE_MANAGER_APPROVED_SINGLE_DAY_LEAVE("leave-module-manager-approved-single-day-leave"),
	LEAVE_MODULE_MANAGER_APPROVED_MULTI_DAY_LEAVE("leave-module-manager-approved-multi-day-leave"),
	LEAVE_MODULE_MANAGER_REVOKED_SINGLE_DAY_LEAVE("leave-module-manager-revoked-single-day-leave"),
	LEAVE_MODULE_MANAGER_REVOKED_MULTI_DAY_LEAVE("leave-module-manager-revoked-multi-day-leave"),
	LEAVE_MODULE_MANAGER_DECLINED_SINGLE_DAY_LEAVE("leave-module-manager-declined-single-day-leave"),
	LEAVE_MODULE_MANAGER_DECLINED_MULTI_DAY_LEAVE("leave-module-manager-declined-multi-day-leave"),
	LEAVE_MODULE_MANAGER_NUDGE_SINGLE_DAY_LEAVE("leave-module-manager-nudge-single-day-leave"),
	LEAVE_MODULE_MANAGER_NUDGE_MULTI_DAY_LEAVE("leave-module-manager-nudge-multi-day-leave"),
	LEAVE_MODULE_MANAGER_AUTO_APPROVED_SINGLE_DAY_LEAVE("leave-module-manager-auto-approved-single-day-leave"),
	LEAVE_MODULE_MANAGER_AUTO_APPROVED_MULTI_DAY_LEAVE("leave-module-manager-auto-approved-multi-day-leave"),

	// Common Module Templates
	COMMON_MODULE_EMAIL_VERIFY("common-module-email-verify"),
	COMMON_MODULE_PASSWORD_RESET_OTP("common-module-password-reset-otp"),
	COMMON_MODULE_GOOGLE_SSO_CREATION_TENANT_URL("common-module-google-sso-creation-tenant-url"),
	COMMON_MODULE_MICROSOFT_SSO_CREATION_TENANT_URL("common-module-microsoft-sso-creation-tenant-url"),
	COMMON_MODULE_CREDENTIAL_BASED_CREATION_TENANT_URL("common-module-credential-based-creation-tenant-url"),

	// E-Signature Module Templates esignature-module-document-viewer-email
	ESIGNATURE_MODULE_ENVELOPE_CC_EMAIL("esignature-module-document-viewer-email"),
	ESIGNATURE_MODULE_ENVELOPE_SIGNER_EMAIL("esignature-module-document-signer-email"),
	ESIGNATURE_MODULE_ENVELOPE_VOIDED_RECIEVER_EMAIL("esignature-module-document-voided-reciever"),
	ESIGNATURE_MODULE_ENVELOPE_VOIDED_SENDER_EMAIL("esignature-module-document-voided-sender"),
	ESIGNATURE_MODULE_ENVELOPE_DECLINED_RECIEVER_EMAIL("esignature-module-document-declined-reciever"),
	ESIGNATURE_MODULE_ENVELOPE_DECLINED_SENDER_EMAIL("esignature-module-document-declined-sender"),
	ESIGNATURE_MODULE_ENVELOPE_EMAIL_REMINDER("esignature-module-document-signer-email-reminder"),
	ESIGNATURE_MODULE_ENVELOPE_COMPLETED_RECEIVER_EMAIL("esignature-module-document-completed-receiver"),
	ESIGNATURE_MODULE_ENVELOPE_COMPLETED_SENDER_EMAIL("esignature-module-document-completed-sender"),

	// Payment Templates for stripe
	PAYMENT_STRIPE_WELCOME_TO_SKAPP_CORE_FREE_TRIAL("payment-stripe-welcome-to-skapp-core-free-trial"),
	PAYMENT_STRIPE_CONGRATULATIONS_ON_UPGRADING_TO_SKAPP_CORE(
			"payment-stripe-congratulations-on-upgrading-to-skapp-core"),
	PAYMENT_STRIPE_CANCEL_SUBSCRIPTION("payment-stripe-cancel-subscription"),

	// Dashboard Templates
	DASHBOARD_MODULE_NEW_ORGANIZATION_CREATED("dashboard-module-new-organization-created"),
	DASHBOARD_MODULE_NEW_ORGANIZATION_STARTED_CORE_FREE_TRIAL(
			"dashboard-module-new-organization-started-core-free-trial"),
	DASHBOARD_MODULE_TRIAL_ORGANIZATION_CONVERTED_TO_CORE("dashboard-module-trial-organization-converted-to-core"),
	DASHBOARD_MODULE_ORGANIZATION_CANCELLED_CORE("dashboard-module-organization-cancelled-core"),
	DASHBOARD_MODULE_SUPPORT_REQUEST_APPLIED("dashboard-module-support-request-applied"),

	// Invoice Module Templates
	INVOICE_MODULE_INVOICE_CREATED_FOR_CUSTOMER("invoice-module-customer-invoice-email"),

	// Guest User Templates
	GUEST_MODULE_EMAIL_VERIFY("guest-module-email-verify"), GUEST_MODULE_INVITATION("guest-module-invitation");

	private final String templateId;

}
