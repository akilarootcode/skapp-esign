package com.skapp.community.peopleplanner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "employee_education")
public class EmployeeEducation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "education_id")
	private Long educationId;

	@Column(name = "institution")
	private String institution;

	@Column(name = "degree")
	private String degree;

	@Column(name = "specialization")
	private String specialization;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "end_date")
	private LocalDate endDate;

	@ManyToOne(optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

}
