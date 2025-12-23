import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import React, { useRef } from "react";

import Icon from "~community/common/components/atoms/Icon/Icon";
import { ZIndexEnums } from "~community/common/enums/CommonEnums";
import { KeyboardKeys } from "~community/common/enums/KeyboardEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import {
  DocumentFieldsIdentifiers,
  DocumentSignModalTypes
} from "~community/sign/enums/CommonDocumentsEnums";
import { SignatureFieldData } from "~community/sign/types/ESignFormTypes";
import { getLocalizedFieldLabel } from "~community/sign/utils/dragAndDropUtils";
import { getFieldIcon } from "~community/sign/utils/fieldIconUtils";
import { handleActivationKeyDown } from "~community/sign/utils/keyboardEventUtils";

interface FieldComponentProps {
  field: SignatureFieldData;
  zoomLevel: number;
  isSelected?: boolean;
  onDelete?: (e: React.MouseEvent, fieldId: number) => void;
  onDragStart?: (
    e: React.DragEvent<HTMLDivElement>,
    field: SignatureFieldData
  ) => void;
  setSelectedFieldId?: React.Dispatch<React.SetStateAction<number | null>>;
  deleteEnabled?: boolean;
  onClickField?: (field: DocumentSignModalTypes, id: number) => void;
  onUpdatePosition?: (
    fieldId: number,
    x: number,
    y: number,
    page?: number
  ) => void;
  getPageDimensions?: (
    pageNumber: number
  ) => { width: number; height: number } | undefined;
  numPages?: number;
  scrollToPage?: (pageNumber: number) => void;
}

const SignatureFieldComponent: React.FC<FieldComponentProps> = ({
  field,
  zoomLevel,
  isSelected = false,
  onDelete,
  onDragStart,
  setSelectedFieldId,
  deleteEnabled = true,
  onClickField,
  onUpdatePosition,
  getPageDimensions,
  numPages
}) => {
  const theme = useTheme();
  const translateText = useTranslator(
    "eSignatureModule",
    "create.defineField.fields"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "signatureField"
  );

  const fieldRef = useRef<HTMLDivElement>(null);
  const fieldLabel = getLocalizedFieldLabel(field.fieldType, translateText);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleActivationKeyDown(e, () => {
      setSelectedFieldId && setSelectedFieldId(field.id);
      onClickField?.(
        field.fieldType as unknown as DocumentSignModalTypes,
        field.id
      );
    });

    const step = 2;
    let newX = field.x;
    let newY = field.y;
    let newPage = field.page;
    let positionChanged = false;

    switch (e.key) {
      case KeyboardKeys.ARROW_LEFT:
        newX -= step;
        positionChanged = true;
        break;
      case KeyboardKeys.ARROW_RIGHT:
        newX += step;
        positionChanged = true;
        break;
      case KeyboardKeys.ARROW_UP:
        newY -= step;
        positionChanged = true;
        break;
      case KeyboardKeys.ARROW_DOWN:
        newY += step;
        positionChanged = true;
        break;
    }

    if (!positionChanged || !onUpdatePosition || !getPageDimensions) return;

    const pageDimensions = getPageDimensions(field.page);
    if (!pageDimensions) return;

    const maxX = pageDimensions.width / zoomLevel - field.width;
    const maxY = pageDimensions.height / zoomLevel - field.height;

    if (newY < 0 && field.page > 1) {
      newPage = field.page - 1;
      const prevPageDimensions = getPageDimensions(newPage);

      if (prevPageDimensions) {
        newY = prevPageDimensions.height / zoomLevel - field.height;
      } else {
        newPage = field.page;
        newY = 0;
      }
    } else if (newY > maxY && field.page < (numPages || 1)) {
      newPage = field.page + 1;
      const nextPageDimensions = getPageDimensions(newPage);

      if (nextPageDimensions) {
        newY = 0;
      } else {
        newPage = field.page;
        newY = maxY;
      }
    } else {
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    onUpdatePosition(field.id, newX, newY, newPage);

    if (newPage !== field.page && fieldRef.current) {
      const currentFieldId = field.id;
      setTimeout(() => {
        const movedField = document.querySelector(
          `[data-field-id="${currentFieldId}"]`
        );
        if (movedField instanceof HTMLElement) {
          movedField.focus();
        }
      }, 100);
    }
  };

  return (
    <Paper
      ref={fieldRef}
      elevation={2}
      draggable
      onDragStart={(e: React.DragEvent<HTMLDivElement>) =>
        onDragStart && onDragStart(e, field)
      }
      className="signature-field"
      data-field-id={field.id}
      data-field-type={field.fieldType}
      sx={{
        position: "absolute",
        left: field.x * zoomLevel,
        top: field.y * zoomLevel,
        width: field.width * zoomLevel,
        height: field.height * zoomLevel,
        bgcolor: field.colorCodes?.background,
        border: `${1.5 * zoomLevel}px ${isSelected ? "dashed" : "solid"} ${field.colorCodes?.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "move",
        userSelect: "none",
        zIndex: ZIndexEnums.LEVEL_2,
        boxShadow: "none"
      }}
      onClick={() => {
        setSelectedFieldId && setSelectedFieldId(field.id);
        onClickField?.(
          field.fieldType as unknown as DocumentSignModalTypes,
          field.id
        );
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={translateAria(["field"], { fieldType: fieldLabel })}
    >
      <Stack
        direction={
          field.fieldType === DocumentFieldsIdentifiers.STAMP ||
          field.fieldType === DocumentFieldsIdentifiers.INITIAL
            ? "column"
            : "row"
        }
        spacing={1 * zoomLevel}
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", px: `${1 * zoomLevel}rem` }}
      >
        {getFieldIcon(field.fieldType, field.colorCodes?.border, zoomLevel)}
        <Typography
          variant="caption"
          sx={{
            color: field.colorCodes?.border,
            fontWeight: "medium",
            fontSize: `${0.75 * zoomLevel}rem`
          }}
        >
          {getLocalizedFieldLabel(field.fieldType, translateText)}
        </Typography>{" "}
        {isSelected && deleteEnabled && (
          <Box
            sx={{
              position: "absolute",
              top: -40 * zoomLevel,
              right: -40 * zoomLevel,
              bgcolor: theme.palette.common.white,
              "&:hover": {
                bgcolor: "error.light"
              },
              width: `${44 * zoomLevel}px`,
              height: `${44 * zoomLevel}px`,
              borderRadius: `${8 * zoomLevel}px`,
              padding: `${4 * zoomLevel}px`,
              cursor: "pointer",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Box
              sx={{
                width: `${36 * zoomLevel}px`,
                height: `${36 * zoomLevel}px`,
                bgcolor: theme.palette.grey[100],
                borderRadius: `${64 * zoomLevel}px`,
                padding: `${10 * zoomLevel}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              tabIndex={0}
              onClick={(e) => onDelete?.(e, field.id)}
              onKeyDown={(e) => {
                if (
                  e.key === KeyboardKeys.ENTER ||
                  e.key === KeyboardKeys.SPACE
                ) {
                  e.preventDefault();
                  onDelete?.(e as unknown as React.MouseEvent, field.id);
                }
              }}
              role="button"
              aria-label={translateAria(["deleteButton"])}
            >
              <Icon name={IconName.BIN_ICON} />
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default SignatureFieldComponent;
