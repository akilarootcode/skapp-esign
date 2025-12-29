package com.skapp.community.peopleplanner.model;

import com.skapp.community.peopleplanner.type.RelationshipTypes;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "employee_emergency")
public class EmployeeEmergency {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "emergency_id")
	private Long emergencyId;

	@Column(name = "name")
	private String name;

	@Column(name = "relationship", columnDefinition = "varchar(255)")
	@Enumerated(EnumType.STRING)
	private RelationshipTypes emergencyRelationship;

	@Column(name = "contact_no", length = 15)
	private String contactNo;

	@Column(name = "is_primary")
	private Boolean isPrimary = Boolean.FALSE;

	@ManyToOne(optional = false)
	@JoinColumn(name = "employee_id")
	private Employee employee;

}
