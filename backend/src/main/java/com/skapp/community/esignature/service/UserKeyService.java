package com.skapp.community.esignature.service;

import com.skapp.community.esignature.model.AddressBook;
import com.skapp.community.esignature.model.UserKey;
import jakarta.validation.constraints.NotNull;

public interface UserKeyService {

	void generateAndStoreKeys(AddressBook addressBook);

	UserKey getKeyPairByAddressBookId(@NotNull Long addressBookId);

}
