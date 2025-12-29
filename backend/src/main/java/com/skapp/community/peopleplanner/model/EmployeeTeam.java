package com.skapp.community.peopleplanner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "employee_team")
public class EmployeeTeam {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "team_id")
	private Team team;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee_id")
	private Employee employee;

	@Column(name = "is_supervisor", nullable = false)
	private Boolean isSupervisor;

	public EmployeeTeam(EmployeeTeam employeeTeam) {
		this.id = employeeTeam.id;
		this.team = employeeTeam.team;
		this.isSupervisor = employeeTeam.isSupervisor;
		this.employee = employeeTeam.employee;
	}

}
