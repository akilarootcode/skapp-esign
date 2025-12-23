package com.skapp.community.esignature.service;

import com.skapp.community.common.payload.response.ResponseEntityDto;
import com.skapp.community.esignature.payload.request.EsignConfigDto;

public interface EsignConfigService {

	void setDefaultEsignConfigs();

	ResponseEntityDto updateEsignConfig(EsignConfigDto esignConfigDto);

	ResponseEntityDto getEsignConfig();

	ResponseEntityDto getExternalEsignConfig();

}
