package com.skapp.community.esignature.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.skapp.community.common.util.converter.JsonTypeConverter;
import com.skapp.community.esignature.type.AuditAction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "es_audit_trail")
public class AuditTrail {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "audit_id", nullable = false, updatable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "envelope_id", nullable = false, updatable = false)
	private Envelope envelope;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "recipient_id", updatable = false)
	private Recipient recipient;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "address_book_id", updatable = false)
	private AddressBook addressBookUser;

	@Column(name = "ip_address", nullable = false, updatable = false)
	private String ipAddress;

	@Enumerated(EnumType.STRING)
	@Column(name = "action", nullable = false, updatable = false)
	private AuditAction action;

	@Column(name = "timestamp", nullable = false, updatable = false)
	private Instant timestamp;

	@Convert(converter = JsonTypeConverter.class)
	@Column(name = "metadata", nullable = false, updatable = false)
	private JsonNode metadata;

	@Column(name = "is_authorized", nullable = false, updatable = false)
	private Boolean isAuthorized;

	@Column(name = "hash", nullable = false, updatable = false)
	private String hash;

}
