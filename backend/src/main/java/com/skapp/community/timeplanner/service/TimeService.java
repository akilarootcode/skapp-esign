package com.skapp.community.timeplanner.service;

import com.skapp.community.common.model.User;
import com.skapp.community.common.payload.response.ResponseEntityDto;
import com.skapp.community.peopleplanner.payload.request.EmployeeTimeRequestFilterDto;
import com.skapp.community.peopleplanner.payload.request.ManagerEmployeeLogFilterDto;
import com.skapp.community.timeplanner.model.TimeConfig;
import com.skapp.community.timeplanner.model.TimeRequest;
import com.skapp.community.timeplanner.payload.request.*;
import com.skapp.community.timeplanner.payload.response.UtilizationPercentageDto;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public interface TimeService {

	ResponseEntityDto updateTimeConfigs(TimeConfigDto timeConfigDto);

	ResponseEntityDto getActiveTimeSlot();

	ResponseEntityDto getEmployeeAttendanceSummary(
			EmployeeAttendanceSummaryFilterDto employeeAttendanceSummaryFilterDto);

	ResponseEntityDto getEmployeeDailyTimeRecords(TimeRecordFilterDto timeRecordFilterDto);

	ResponseEntityDto getAllRequestsOfEmployee(EmployeeTimeRequestFilterDto employeeTimeRequestFilterDto);

	ResponseEntityDto getRequestedDateTimeAvailability(TimeRequestAvailabilityRequestDto requestDto);

	ResponseEntityDto getIncompleteClockOuts();

	ResponseEntityDto getDefaultTimeConfigurations();

	ResponseEntityDto addManualEntryRequest(ManualEntryRequestDto timeRequestDto);

	ResponseEntityDto updateTimeRequests(UpdateTimeRequestsFilterDto updateTimeRequestsFilterDto);

	ResponseEntityDto updateCurrentUserIncompleteTimeRecords(Long id, UpdateIncompleteTimeRecordsRequestDto requestDto);

	ResponseEntityDto addTimeRecord(AddTimeRecordDto addTimeRecordDto);

	@Transactional
	ResponseEntityDto editTimeRequest(EditTimeRequestDto timeRequestDto);

	ResponseEntityDto getManagerAttendanceSummary(ManagerAttendanceSummaryFilterDto managerAttendanceSummaryFilterDto);

	ResponseEntityDto updateTimeRequestByManager(Long id, TimeRequestManagerPatchDto timeRequestManagerPatchDto);

	TimeRequest handleEditTimeRecordRequests(TimeRequest timeRequest, User currentUser,
			TimeRequestManagerPatchDto timeRequestManagerPatchDto);

	TimeRequest handleManualTimeEntryRequests(TimeRequest timeRequest, User currentUser,
			TimeRequestManagerPatchDto timeRequestManagerPatchDto);

	ResponseEntityDto managerAssignUsersTimeRecords(ManagerTimeRecordFilterDto managerTimeRecordFilterDto);

	ResponseEntityDto getAllAssignEmployeesTimeRequests(ManagerTimeRequestFilterDto timeRequestFilterDto);

	ResponseEntityDto managerTeamTimeRecordSummary(TeamTimeRecordFilterDto timeRecordSummaryDto);

	ResponseEntityDto getManagerEmployeeDailyLog(ManagerEmployeeLogFilterDto managerEmployeeLogFilterDto);

	ResponseEntityDto getIndividualWorkHoursBySupervisor(IndividualWorkHourFilterDto individualWorkHourFilterDto);

	ResponseEntityDto getIndividualWorkUtilizationByManager(Long id);

	ResponseEntityDto getIfTimeConfigRemovable(List<DayOfWeek> days);

	UtilizationPercentageDto calculateWorkTimeUtilization(List<Long> employeeId, List<TimeConfig> timeConfigs,
			List<LocalDate> holidays);

	ResponseEntityDto getEmployeeDailyTimeRecordsByEmployeeId(TimeRecordFilterDto timeRecordFilterDto, Long employeeId);

	ResponseEntityDto getPendingTimeRequestsCount();

}
