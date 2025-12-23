package com.skapp.community.esignature.repository;

import com.skapp.community.esignature.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentDao extends JpaRepository<Document, Long>, DocumentRepository {

	Optional<Document> findByEnvelopeId(Long envelopeId);

}
