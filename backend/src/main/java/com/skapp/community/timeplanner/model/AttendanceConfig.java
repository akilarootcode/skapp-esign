package com.skapp.community.timeplanner.model;

import com.skapp.community.timeplanner.type.AttendanceConfigType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "attendance_config")
public class AttendanceConfig {

	@Id
	@Enumerated(EnumType.STRING)
	@Column(name = "config_title", updatable = false, unique = true, columnDefinition = "varchar(255)")
	private AttendanceConfigType attendanceConfigType;

	@Column(name = "config_value", nullable = false)
	private String attendanceConfigValue;

}
