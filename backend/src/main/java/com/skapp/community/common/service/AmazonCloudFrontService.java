package com.skapp.community.common.service;

import java.util.Map;

public interface AmazonCloudFrontService {

	Map<String, String> generateCloudFrontDocumentSignedCookies();

	Map<String, String> generateCloudFrontSignatureSignedCookies(boolean isInternal);

}
