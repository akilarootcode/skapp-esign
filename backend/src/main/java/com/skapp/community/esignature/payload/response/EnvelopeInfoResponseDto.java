package com.skapp.community.esignature.payload.response;

import com.skapp.community.esignature.type.EnvelopeStatus;
import com.skapp.community.esignature.type.SignType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EnvelopeInfoResponseDto {

	private Long id;

	private String subject;

	private String message;

	private EnvelopeStatus status;

	private SignType signType;

	private List<DocumentDetailResponseDto> documents;

	private List<RecipientResponseDto> recipients;

	private AddressBookBasicResponseDto addressBook;

}
