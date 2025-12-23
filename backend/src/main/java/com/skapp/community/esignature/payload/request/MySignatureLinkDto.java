package com.skapp.community.esignature.payload.request;

import com.skapp.community.esignature.type.MySignatureMethods;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MySignatureLinkDto {

	private String mySignatureLink;

	private MySignatureMethods mySignatureMethod;

	private String fontFamily;

	private String fontColor;

}
