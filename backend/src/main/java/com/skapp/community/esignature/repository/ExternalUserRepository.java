package com.skapp.community.esignature.repository;

import com.skapp.community.esignature.model.ExternalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExternalUserRepository extends JpaRepository<ExternalUser, Long> {

	Optional<ExternalUser> findByEmail(String email);

}
