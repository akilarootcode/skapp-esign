package com.skapp.community.common.type;

public enum QuartzEntityType {

	ENVELOPE, INVOICE;

	public static QuartzEntityType convertToUpperCase(String value) {

		return QuartzEntityType.valueOf(value.toUpperCase());

	}

}
