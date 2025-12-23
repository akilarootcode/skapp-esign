package com.skapp.community.esignature.payload.response;

import com.skapp.community.esignature.type.AuditAction;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@ToString
public class AuditTrailResponseDto {

	private Long auditId;

	private AuditAction action;

	private String actionDoneByName;

	private String actionDoneByEmail;

	private Instant timestamp;

	private List<MetadataResponseDto> metadata;

	private Boolean isAuthorized;

	private String hash;

}
