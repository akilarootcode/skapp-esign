package com.skapp.community.esignature.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "es_document_version_field")
public class DocumentVersionField {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "document_version_id", nullable = false)
	private DocumentVersion documentVersion;

	@OneToOne
	@JoinColumn(name = "field_id", nullable = false)
	private Field field;

	@Column(name = "field_value")
	private String value;

	@Column(name = "x_position")
	private float xPosition;

	@Column(name = "y_position")
	private float yPosition;

	@Column(name = "field_hash")
	private String fieldHash;

	@Column(name = "field_signature")
	private String fieldSignature;

	@Column(name = "width")
	private float width;

	@Column(name = "height")
	private float height;

}
