package com.skapp.community.esignature.repository;

import com.skapp.community.esignature.model.UserKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserKeyRepository extends JpaRepository<UserKey, Long> {

	Optional<UserKey> findByAddressBookId(Long addressBookId);

}
