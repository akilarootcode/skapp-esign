package com.skapp.community.common.service;

import com.skapp.community.common.payload.request.AmazonS3SignedUrlValidatedRequestDto;

public interface AmazonS3FileValidationService {

	void validateS3FileUpload(AmazonS3SignedUrlValidatedRequestDto amazonS3SignedUrlValidatedRequestDto);

}
