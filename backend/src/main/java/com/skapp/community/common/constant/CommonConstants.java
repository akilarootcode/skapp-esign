package com.skapp.community.common.constant;

import lombok.experimental.UtilityClass;

@UtilityClass
public class CommonConstants {

	public static final long MAX_RETRIES_COUNT = 3;

	public static final String DEFAULT_TIME_CONFIG_KEY_HOUR = "hours";

	public static final String DEFAULT_TIME_CONFIG_KEY_TIME_BLOCK = "timeBlock";

	public static final String DEFAULT_TIME_CONFIG_VALUE_HOUR = "4.0";

	public static final String DEFAULT_TIME_CONFIG_VALUE_MORNING = "MORNING_HOURS";

	public static final String DEFAULT_TIME_CONFIG_VALUE_EVENING = "EVENING_HOURS";

	public static final Float DEFAULT_TIME_CONFIG_VALUE_TOTAL_HOUR = 8F;

	public static final Integer DEFAULT_TIME_CONFIG_VALUE_START_HOUR = 8;

	public static final Integer DEFAULT_TIME_CONFIG_VALUE_START_MINUTE = 30;

	public static final String NOTIFICATION_TITLE = "title";

	public static final String NOTIFICATION_MESSAGE = "message";

	public static final String APPLICATION_NAME = "Skapp";

	public static final String VIA = " via ";

	public static final String ESIGNATURE = "esignature";

	public static final String MODULE = "module";

	public static final String SENDER = "sender";

	public static final String NAME = "name";

	public static final int SENDGRID_EMAIL_SCHEDULE_MAX_HOURS = 72;

	public static final int HOURS_A_DAY = 24;

	public static final String SENDGRID_CANCEL_SCHEDULED_MAIL = "cancel";

	public static final int S3_SIGNED_URL_DURATION = 15;

}
