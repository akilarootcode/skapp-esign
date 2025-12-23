package com.skapp.community.esignature.service;

import com.skapp.community.esignature.payload.request.FieldSignDto;
import com.skapp.community.esignature.payload.response.PageDimensionResponseDto;

import java.util.List;
import java.util.Map;

public interface DocumentProcessingService {

	byte[] mergeTextFieldToDocument(FieldSignDto fieldSignDto, byte[] inputBytes);

	byte[] updateEnvelopeUuidToEachPage(String value, byte[] inputBytes, int numOfPages);

	byte[] mergeImageFieldToDocument(FieldSignDto fieldSignDto, byte[] inputBytes, byte[] imageBytes);

	int getNumberOfPages(byte[] inputBytes);

	Map<Integer, PageDimensionResponseDto> processDocumentDimensions(byte[] documentBytes);

	List<byte[]> convertPDFdocumentToImageList(byte[] documentBytes);

	byte[] convertPDFdocumentToImage(byte[] documentBytes, int pageNumber);

}
