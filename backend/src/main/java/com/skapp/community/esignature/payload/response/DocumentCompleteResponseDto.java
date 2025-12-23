package com.skapp.community.esignature.payload.response;

import com.skapp.community.esignature.type.EnvelopeStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DocumentCompleteResponseDto {

	private EnvelopeStatus status;

	private String accessLink;

}
