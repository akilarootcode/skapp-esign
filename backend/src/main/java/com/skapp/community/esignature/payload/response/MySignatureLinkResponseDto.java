package com.skapp.community.esignature.payload.response;

import com.skapp.community.esignature.type.MySignatureMethods;
import com.skapp.community.esignature.type.UserType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MySignatureLinkResponseDto {

	private Long addressBookId;

	private Long userId;

	private UserType type;

	private String firstName;

	private String lastName;

	private String mySignatureLink;

	private MySignatureMethods mySignatureMethod;

	private String fontFamily;

	private String fontColor;

}
