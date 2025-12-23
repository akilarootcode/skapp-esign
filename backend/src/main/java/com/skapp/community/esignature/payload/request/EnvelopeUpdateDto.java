package com.skapp.community.esignature.payload.request;

import com.skapp.community.esignature.type.EnvelopeStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EnvelopeUpdateDto {

	private String name;

	private EnvelopeStatus status;

	private String message;

	private String subject;

	private LocalDateTime expireAt;

}
