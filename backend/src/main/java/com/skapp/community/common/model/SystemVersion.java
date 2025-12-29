package com.skapp.community.common.model;

import com.skapp.community.common.type.SystemVersionTypes;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "system_version")
public class SystemVersion extends Auditable<String> {

	@Id
	@Column(name = "version")
	private String version;

	@Enumerated(value = EnumType.STRING)
	@Column(name = "reason", columnDefinition = "varchar(255)")
	private SystemVersionTypes reason;

}
