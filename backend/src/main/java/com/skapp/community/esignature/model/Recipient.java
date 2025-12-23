package com.skapp.community.esignature.model;

import com.skapp.community.esignature.type.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "es_recipient")
public class Recipient {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "recipient_id", nullable = false, updatable = false)
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "email")
	private String email;

	@Enumerated(EnumType.STRING)
	@Column(name = "member_role")
	private MemberRole memberRole;

	@Enumerated(EnumType.STRING)
	private RecipientStatus status;

	@Column(name = "signing_order")
	private int signingOrder;

	@Column(name = "color")
	private String color;

	@ManyToOne
	@JoinColumn(name = "envelope_id")
	private Envelope envelope;

	@OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Field> fields;

	@ManyToOne
	@JoinColumn(name = "address_book_id")
	private AddressBook addressBook;

	@Column(name = "reminder_batch_id")
	private String reminderBatchId;

	@Enumerated(EnumType.STRING)
	@Column(name = "reminder_status")
	private EmailReminderStatus reminderStatus;

	@Enumerated(EnumType.STRING)
	@Column(name = "email_status")
	private EmailStatus emailStatus;

	@Column(name = "received_at")
	private LocalDateTime receivedAt;

	@Column(name = "decline_reason")
	private String declineReason;

	@Column(name = "is_consent", nullable = false)
	private boolean isConsent;

	@Enumerated(EnumType.STRING)
	@Column(name = "inbox_status")
	private InboxStatus inboxStatus;

}
