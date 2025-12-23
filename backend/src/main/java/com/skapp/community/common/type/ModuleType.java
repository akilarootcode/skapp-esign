package com.skapp.community.common.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ModuleType {

	COMMON("common"), ATTENDANCE("attendance"), PEOPLE("people"), LEAVE("leave"), ESIGN("esignature"), OKR("okr"),
	INVOICE("invoice"), PM("projectmanagement");

	private final String displayName;

}
