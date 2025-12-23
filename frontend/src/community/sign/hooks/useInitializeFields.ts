import { useEffect, useRef } from "react";

import { theme } from "~community/common/theme/theme";
import { convertDateToUTC } from "~community/common/utils/dateTimeUtils";
import { DocumentFieldsIdentifiers } from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { SignatureFieldStatus } from "~community/sign/types/ESignFormTypes";

import { FieldResponseDtoList } from "../types/CommonEsignTypes";

export const useInitializeFields = () => {
  const {
    setSignatureFields,
    setCompleteFlowSignatureFields,
    completeFlowSignatureFields,
    documentInfo
  } = useESignStore();

  const fieldsInitialized = useRef(false);

  useEffect(() => {
    if (fieldsInitialized.current || !documentInfo) {
      return;
    }

    let colorCodes = {
      border: theme.palette.primary.dark,
      background: `${theme.palette.secondary.main}${theme.palette.opacity[80]}`
    };
    const apiFields =
      documentInfo.fieldResponseDtoList
        ?.filter(
          (field: FieldResponseDtoList) =>
            field.status !== SignatureFieldStatus.COMPLETED
        )
        .map((field: FieldResponseDtoList) => {
          const fieldColorCodes =
            field.type === DocumentFieldsIdentifiers.DECLINE
              ? {
                  border: theme.palette.text.error,
                  background: theme.palette.error.main
                }
              : colorCodes;
          return {
            id: field.id,
            type: field.type,
            status: field.status,
            pageNumber: field.pageNumber,
            documentId: field.documentId,
            receipientMail: field.receipientMail,
            fontFamily: field.fontFamily,
            fontColor: field.fontColor,
            width: field.width,
            height: field.height,
            fieldValueResponseDto: field.fieldValueResponseDto,
            xposition: field.xposition,
            yposition: field.yposition,

            page: field.pageNumber,
            x: field.xposition,
            y: field.yposition,
            fieldType: field.type,
            colorCodes: fieldColorCodes
          };
        }) || [];

    setSignatureFields(apiFields);

    fieldsInitialized.current = true;
  }, [documentInfo, setSignatureFields]);

  const dateFieldsInitialized = useRef(false);

  useEffect(() => {
    if (dateFieldsInitialized.current || !completeFlowSignatureFields.length) {
      return;
    }

    const hasDateFields = completeFlowSignatureFields.some(
      (field) => field.fieldType === DocumentFieldsIdentifiers.DATE
    );

    if (hasDateFields) {
      setCompleteFlowSignatureFields(
        completeFlowSignatureFields.map((field) =>
          field.fieldType === DocumentFieldsIdentifiers.DATE
            ? {
                ...field,
                value: convertDateToUTC(new Date().toISOString()),
                fieldStatus: SignatureFieldStatus.COMPLETED
              }
            : field
        )
      );

      dateFieldsInitialized.current = true;
    } else {
      dateFieldsInitialized.current = true;
    }
  }, [completeFlowSignatureFields, setCompleteFlowSignatureFields]);

  return {
    documentPath: documentInfo?.documentDetailResponseDto.filePath || ""
  };
};
