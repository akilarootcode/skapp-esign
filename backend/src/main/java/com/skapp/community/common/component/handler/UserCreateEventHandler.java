package com.skapp.community.common.component.handler;

import com.skapp.community.common.model.User;
import com.skapp.community.common.util.event.UserCreatedEvent;
import com.skapp.community.esignature.model.AddressBook;
import com.skapp.community.esignature.repository.AddressBookDao;
import com.skapp.community.esignature.service.UserKeyService;
import com.skapp.community.esignature.type.UserType;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class UserCreateEventHandler {

	private final AddressBookDao addressBookDao;

	private final UserKeyService userKeyService;

	public UserCreateEventHandler(AddressBookDao addressBookDao, UserKeyService userKeyService) {
		this.addressBookDao = addressBookDao;
		this.userKeyService = userKeyService;
	}

	@EventListener
	public void handleUserCreated(UserCreatedEvent event) {
		User user = event.getUser();

		AddressBook addressBook = new AddressBook();
		addressBook.setInternalUser(user);
		addressBook.setType(UserType.INTERNAL);
		addressBook = addressBookDao.save(addressBook);
		userKeyService.generateAndStoreKeys(addressBook);
	}

}
