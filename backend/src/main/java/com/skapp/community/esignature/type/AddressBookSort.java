package com.skapp.community.esignature.type;

import lombok.Getter;

@Getter
public enum AddressBookSort {

	NAME("firstName");

	private final String sortField;

	AddressBookSort(String sortField) {
		this.sortField = sortField;
	}

	@Override
	public String toString() {
		return this.sortField;
	}

}
