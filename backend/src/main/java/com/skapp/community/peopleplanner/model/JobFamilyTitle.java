package com.skapp.community.peopleplanner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "job_family_title")
@IdClass(JobFamilyTitleId.class)
public class JobFamilyTitle {

	@Id
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_family_id")
	private JobFamily jobFamily;

	@Id
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_title_id")
	private JobTitle jobTitle;

}
