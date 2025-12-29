package com.skapp.community.leaveplanner.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "leave_request_entitlement")
public class LeaveRequestEntitlement {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "leave_request_id")
	private LeaveRequest leaveRequest;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "leave_entitlement_id")
	private LeaveEntitlement leaveEntitlement;

	@Column(name = "days_used")
	private float daysUsed;

}
