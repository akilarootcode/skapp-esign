import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

import ContentLayout from "~community/common/components/templates/ContentLayout/ContentLayout";
import ROUTES from "~community/common/constants/routes";
import useSessionData from "~community/common/hooks/useSessionData";
import { useTranslator } from "~community/common/hooks/useTranslator";
import { IconName } from "~community/common/types/IconTypes";
import { useGetUserPersonalDetails } from "~community/people/api/PeopleApi";
import ContactModalController from "~community/sign/components/molecules/ContactModalController/ContactModalController";
import ContactData from "~community/sign/components/organisms/ContactData/ContactData";
import { ContactUserTypes } from "~community/sign/enums/ContactEnums";
import { CreateDocumentsModalTypes } from "~community/sign/enums/CreateDocumentsModalTypes";
import { useESignStore } from "~community/sign/store/signStore";
import { ContactDataType } from "~community/sign/types/contactTypes";
import useGoogleAnalyticsEvent from "~enterprise/common/hooks/useGoogleAnalyticsEvent";
import { GoogleAnalyticsTypes } from "~enterprise/common/types/GoogleAnalyticsTypes";


const Contacts = () => {
  const router = useRouter();
  const translateText = useTranslator("eSignatureModule", "contact");
  const { setDocumentControllerModalType } = useESignStore();
  const [selectedContact, setSelectedContact] =
    useState<ContactDataType | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { isPeopleAdmin, isSuperAdmin } = useSessionData();
  const { data: currentEmployeeDetails } = useGetUserPersonalDetails();

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsEditMode(false);
    setDocumentControllerModalType(CreateDocumentsModalTypes.ADD_EXTERNAL_USER);
  };

  const handleEditContact = (contact: ContactDataType) => {
    if (contact.userType === ContactUserTypes.INTERNAL) {
      if (
        currentEmployeeDetails?.employeeId === contact.userId.toString() &&
        !(isPeopleAdmin || isSuperAdmin)
      ) {
        router.push(ROUTES.PEOPLE.ACCOUNT);
      } else if (isPeopleAdmin || isSuperAdmin) {
        router.push(ROUTES.PEOPLE.EDIT(contact.userId));
      } else {
        const route = `${ROUTES.PEOPLE.INDIVIDUAL}/${contact.userId}`;
        router.push(route);
      }
    } else {
      setSelectedContact(contact);
      setIsEditMode(true);
      setDocumentControllerModalType(
        CreateDocumentsModalTypes.ADD_EXTERNAL_USER
      );
    }
  };

  const handleCloseModal = () => {
    setDocumentControllerModalType(CreateDocumentsModalTypes.NONE);
    setSelectedContact(null);
    setIsEditMode(false);
  };

  useGoogleAnalyticsEvent({
    onMountEventType: GoogleAnalyticsTypes.GA4_ESIGN_CONTACTS_VIEWED,
    triggerOnMount: true
  });

  return (
    <>
      <ContentLayout
        pageHead={translateText(["pageHead"])}
        title={translateText(["title"])}
        primaryButtonText="Add Contact"
        primaryBtnIconName={IconName.ADD_ICON}
        onPrimaryButtonClick={handleAddContact}
      >
        <Box>
          <ContactData onRowClick={handleEditContact} />
        </Box>
      </ContentLayout>

      <ContactModalController
        selectedContact={selectedContact}
        isEditMode={isEditMode}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Contacts;