package com.skapp.community.peopleplanner.payload.request.employee;

import com.skapp.community.peopleplanner.payload.request.employee.personal.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeePersonalDetailsDto {

	private EmployeePersonalGeneralDetailsDto general;

	private EmployeePersonalContactDetailsDto contact;

	private List<EmployeePersonalFamilyDetailsDto> family;

	private List<EmployeePersonalEducationalDetailsDto> educational;

	private EmployeePersonalSocialMediaDetailsDto socialMedia;

	private EmployeePersonalHealthAndOtherDetailsDto healthAndOther;

}
