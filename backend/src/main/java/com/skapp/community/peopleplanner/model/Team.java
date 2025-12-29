package com.skapp.community.peopleplanner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "team")
public class Team {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "team_id", nullable = false, updatable = false)
	private Long teamId;

	@Column(name = "team_name", length = 50)
	private String teamName;

	@Column(name = "is_active")
	private boolean isActive = true;

	@OneToMany(mappedBy = "team", cascade = CascadeType.ALL)
	private List<EmployeeTeam> employees;

}
