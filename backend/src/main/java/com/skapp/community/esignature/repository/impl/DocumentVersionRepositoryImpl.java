package com.skapp.community.esignature.repository.impl;

import com.skapp.community.esignature.model.Document;
import com.skapp.community.esignature.model.DocumentVersion;
import com.skapp.community.esignature.model.DocumentVersion_;
import com.skapp.community.esignature.model.Document_;
import com.skapp.community.esignature.repository.DocumentVersionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DocumentVersionRepositoryImpl implements DocumentVersionRepository {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public List<DocumentVersion> findByVersionNumberAndDocumentIdForUpdateOrdered(int versionNumber, Long documentId) {
		CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		CriteriaQuery<DocumentVersion> query = cb.createQuery(DocumentVersion.class);
		Root<DocumentVersion> root = query.from(DocumentVersion.class);

		Join<DocumentVersion, Document> documentJoin = root.join(DocumentVersion_.document);

		Predicate versionPredicate = cb.equal(root.get(DocumentVersion_.versionNumber), versionNumber);
		Predicate documentPredicate = cb.equal(documentJoin.get(Document_.id), documentId);

		query.select(root)
			.where(cb.and(versionPredicate, documentPredicate))
			.orderBy(cb.desc(root.get(DocumentVersion_.id)));

		TypedQuery<DocumentVersion> typedQuery = entityManager.createQuery(query);
		typedQuery.setLockMode(LockModeType.PESSIMISTIC_WRITE);

		return typedQuery.getResultList();
	}

}
