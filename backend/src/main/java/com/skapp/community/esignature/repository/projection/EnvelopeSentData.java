package com.skapp.community.esignature.repository.projection;

import com.skapp.community.esignature.payload.response.AddressBookBasicResponseDto;
import com.skapp.community.esignature.payload.response.RecipientResponseDto;
import com.skapp.community.esignature.type.EnvelopeStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnvelopeSentData {

	private Long envelopeId;

	private String subject;

	private String title;

	private AddressBookBasicResponseDto sender;

	private EnvelopeStatus status;

	private LocalDate expiresAt;

	private LocalDateTime sentAt;

	private List<RecipientResponseDto> recipients = new ArrayList<>();

}
