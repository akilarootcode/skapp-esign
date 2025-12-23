package com.skapp.community.esignature.model;

import com.skapp.community.esignature.type.DateFormatType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "es_config")
public class EsignConfig {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "date_format")
	private DateFormatType dateFormat;

	@Column(name = "expiration_days")
	private int defaultEnvelopeExpireDays;

	@Column(name = "reminder_days")
	private int reminderDaysBeforeExpire;

}
