package com.skapp.community.esignature.service;

import com.skapp.community.common.payload.response.ResponseEntityDto;
import com.skapp.community.esignature.payload.request.AddressBookFilterDto;
import com.skapp.community.esignature.payload.request.ExternalUserDto;
import com.skapp.community.esignature.payload.request.MySignatureLinkDto;
import com.skapp.community.esignature.type.UserType;

public interface AddressBookService {

    /**
     * Adds an ExternalUser to the address book.
     *
     * @param externalUser The external user to be added.
     * @param type         The type of the user (e.g., EXTERNAL).
     * @return The AddressBook entry.
     */
    ResponseEntityDto addExternalUserToAddressBook(ExternalUserDto externalUser, UserType type);

    ResponseEntityDto getAddressBookContacts(AddressBookFilterDto addressBookFilterDto);

    ResponseEntityDto fetchAddressBookContactsByEmailPriority(String keyWord);

    ResponseEntityDto fetchAddressBookInternalEsignSenderByEmailPriority(String keyWord);

    ResponseEntityDto addUpdateMySignatureLink(MySignatureLinkDto mySignatureLinkDto);

    ResponseEntityDto getMySignatureLink();

}
