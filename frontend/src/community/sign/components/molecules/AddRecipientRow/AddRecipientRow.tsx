import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";



import Button from "~community/common/components/atoms/Button/Button";
import Icon from "~community/common/components/atoms/Icon/Icon";
import Tooltip from "~community/common/components/atoms/Tooltip/Tooltip";
import { ButtonStyle, TooltipPlacement } from "~community/common/enums/ComponentEnums";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { ESIGN_ADD_RECIPIENTS_LIMIT } from "~community/sign/constants";
import { DocumentUserPrivilege } from "~community/sign/enums/CommonDocumentsEnums";
import { useESignStore } from "~community/sign/store/signStore";
import { ESignAssigneesType } from "~community/sign/types/ESignFormTypes";



import RecipientRowDetails from "./RecipientRowDetails";


const AddRecipientRow = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [focusNewRecipient, setFocusNewRecipient] = useState<number | null>(
    null
  );

  const translateText = useTranslator(
    "eSignatureModule",
    "create.recipientDetails.recipientDetails"
  );
  const translateAria = useTranslator(
    "eSignatureModuleAria",
    "components",
    "recipientDetailsSection"
  );

  const handleMouseEnter = () => {
    if (recipients.length === ESIGN_ADD_RECIPIENTS_LIMIT) {
      setTooltipOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const createInitialItem = (id: number): ESignAssigneesType => ({
    addressBookId: null,
    authPic: null,
    email: "",
    firstName: "",
    id,
    lastName: "",
    userId: null,
    userType: null,
    userPrivileges: DocumentUserPrivilege.SIGNER,
    signingOrder: id,
    uuid: uuidv4(),
    error: null
  });

  const {
    recipients,
    setRecipients,
    signatureFields,
    setSignatureFields,
    isSigningOrderEnabled
  } = useESignStore();

  useEffect(() => {
    if (recipients.length === 0) {
      setRecipients([createInitialItem(1)]);
    }
  }, []);

  const handleDeleteRecipient = (idToDelete: number, addressBookId: number) => {
    const remainingRecipients = recipients
      .filter((recipient) => recipient.id !== idToDelete)
      .map((recipient, index) => ({
        ...recipient,
        id: index + 1,
        signingOrder: index + 1
      }));
    setRecipients(
      remainingRecipients.length === 0
        ? [createInitialItem(1)]
        : remainingRecipients
    );
    const updatedSignatureFields = signatureFields.filter(
      (field) => field.userId !== addressBookId
    );

    setSignatureFields(updatedSignatureFields);
  };

  const handleAddRecipient = () => {
    const newRecipientId = recipients.length + 1;
    setRecipients([...recipients, createInitialItem(newRecipientId)]);
    setFocusNewRecipient(newRecipientId);
  };

  const handleFocusHandled = () => {
    setFocusNewRecipient(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = recipients.findIndex((item) => item.uuid === active.id);
    const newIndex = recipients.findIndex((item) => item.uuid === over.id);

    const reorderedItems = arrayMove(recipients, oldIndex, newIndex).map(
      (item, index) => ({
        ...item,
        id: index + 1,
        signingOrder: index + 1
      })
    );

    setRecipients(reorderedItems);
  };
  return (
    <Stack component="section" width="100%">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {" "}
        <SortableContext
          items={recipients.map((item) => item.uuid)}
          strategy={verticalListSortingStrategy}
        >
          <Stack
            component="ul"
            gap={1}
            width="100%"
            sx={{ listStyleType: "none", padding: 0 }}
          >
            {recipients.map((recipientData) => (
              <RecipientRowDetails
                key={recipientData.uuid}
                recipientData={recipientData}
                showDeleteIcon={recipients.length > 1}
                showDragIcon={recipients.length > 1 && isSigningOrderEnabled}
                onDelete={handleDeleteRecipient}
                shouldFocus={focusNewRecipient === recipientData.id}
                onFocusHandled={handleFocusHandled}
              />
            ))}
          </Stack>
        </SortableContext>{" "}
      </DndContext>{" "}
      <Box
        component="div"
        width="max-content"
        mt={2}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Tooltip
          id="recipient-limit-tooltip"
          title={translateText(["disabledTooltip"])}
          open={tooltipOpen && recipients.length === ESIGN_ADD_RECIPIENTS_LIMIT}
          placement={TooltipPlacement.RIGHT}
          tabIndex={-1}
        >
          <Button
            label={translateText(["addRecipientButton"])}
            buttonStyle={ButtonStyle.TERTIARY}
            endIcon={<Icon name={IconName.ADD_ICON} />}
            styles={{
              padding: "0.8125rem 1.25rem"
            }}
            disabled={recipients.length === ESIGN_ADD_RECIPIENTS_LIMIT}
            onClick={handleAddRecipient}
            aria-describedby={
              recipients.length === ESIGN_ADD_RECIPIENTS_LIMIT
                ? "recipient-limit-tooltip"
                : undefined
            }
          />
        </Tooltip>
      </Box>
    </Stack>
  );
};

export default AddRecipientRow;