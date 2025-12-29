package com.skapp.community.peopleplanner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "job_title")
public class JobTitle {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "job_title_id")
	private Long jobTitleId;

	@Column(name = "title_name", nullable = false, length = 50)
	private String name;

	@Column(name = "is_active", nullable = false)
	private Boolean isActive = true;

	@OneToMany(mappedBy = "jobTitle", fetch = FetchType.LAZY)
	private List<Employee> employees = new ArrayList<>();

	@OneToMany(mappedBy = "jobTitle", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<JobFamilyTitle> jobFamilyTitle;

}
