package com.skapp.community.esignature.repository;

import com.skapp.community.esignature.model.Field;
import com.skapp.community.esignature.model.Recipient;
import com.skapp.community.esignature.type.FieldStatus;
import com.skapp.community.esignature.type.FieldType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldRepository extends JpaRepository<Field, Long> {

	List<Field> findByIdIn(List<Long> fieldIds);

	List<Field> findByRecipientAndTypeAndStatus(Recipient recipient, FieldType type, FieldStatus status);

}
