package com.skapp.community.common.constant;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ApiUriConstants {

	public static final String SENDGRID_POST_API = "mail/send";

	public static final String SENDGRID_CREATE_BACTH_ID_API = "/mail/batch";

	public static final String SENDGRID_CANCEL_SCHEDULED_EMAIL = "/user/scheduled_sends";

}
