package com.skapp.community.esignature.repository;

import com.skapp.community.esignature.model.ExternalUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExternalUserDao extends JpaRepository<ExternalUser, Long>, ExternalUserRepository {

}
