package com.skapp.community.esignature.payload.response;

import com.skapp.community.esignature.type.MemberRole;
import com.skapp.community.esignature.type.RecipientStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipientResponseDto {

	private Long id;

	private MemberRole memberRole;

	private RecipientStatus status;

	private int signingOrder;

	private String color;

	private boolean isConsent;

	private AddressBookBasicResponseDto addressBook;

}
