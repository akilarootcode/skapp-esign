package com.skapp.community.common.util;

import com.skapp.community.common.constant.CommonMessageConstant;
import com.skapp.community.common.exception.ModuleException;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Year;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;
import java.util.Set;

/**
 * Utility class for handling UTC date and time operations.
 */
public class DateTimeUtils {

	public static final int JANUARY = 1;

	public static final int DECEMBER = 12;

	public static final int FIRST_DAY = 1;

	public static final int LAST_DAY = 31;

	public static final float MILLISECONDS_IN_AN_HOUR = 1000 * 60 * 60.0f;

	public static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
		.withZone(ZoneId.of("UTC"));

	// Default UTC ZoneId
	private static final ZoneId UTC_ZONE_ID = ZoneOffset.UTC;

	private static final DateTimeFormatter AM_PM_FORMATTER = DateTimeFormatter.ofPattern("hh:mm a");

	public static final String TIMESTAMP_POSTFIX = "_";

	private static final DateTimeFormatter ESIGN_CERT_FORMATTER = DateTimeFormatter
		.ofPattern("MM/dd/yyyy | hh:mm:ss a");

	private DateTimeUtils() {
		throw new UnsupportedOperationException("Utility class");
	}

	/**
	 * Get the current UTC LocalDate.
	 * @return Current date in UTC.
	 */
	public static LocalDate getCurrentUtcDate() {
		return LocalDate.now(UTC_ZONE_ID);
	}

	/**
	 * Get the current UTC LocalDateTime.
	 * @return Current date and time in UTC.
	 */
	public static LocalDateTime getCurrentUtcDateTime() {
		return LocalDateTime.now(UTC_ZONE_ID);
	}

	/**
	 * Convert a UTC date string to LocalDate.
	 * @param dateStr Date string in "yyyy-MM-dd" format.
	 * @return LocalDate instance.
	 * @throws DateTimeParseException If the date string is invalid.
	 * @throws IllegalArgumentException If the input string is null.
	 */
	public static LocalDate parseUtcDate(String dateStr) {
		if (dateStr == null) {
			throw new IllegalArgumentException("Date string cannot be null");
		}
		try {
			return LocalDate.parse(dateStr);
		}
		catch (DateTimeParseException ex) {
			throw new DateTimeParseException("Incorrect date format", dateStr, ex.getErrorIndex());
		}
	}

	/**
	 * Returns a {@link LocalDate} representing the specified year, month, and day in UTC.
	 * @param year The year to represent.
	 * @param month The month to represent (1 for January, 12 for December).
	 * @param day The day of the month to represent.
	 * @return {@link LocalDate} instance representing the specified date in UTC.
	 */
	public static LocalDate getUtcLocalDate(int year, int month, int day) {
		return LocalDate.of(year, month, day);
	}

	/**
	 * Retrieves the year from the given {@link LocalDate}.
	 * @param date The {@link LocalDate} instance from which to extract the year.
	 * @return The year as an {@code int}.
	 * @throws ModuleException If the date is null.
	 */
	public static int getYear(LocalDate date) {
		if (date == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_CANNOT_BE_NULL);
		}
		return date.getYear();
	}

	/**
	 * Returns the current year.
	 * @return the current year.
	 */
	public static int getCurrentYear() {
		return Year.now(UTC_ZONE_ID).getValue();
	}

	/**
	 * Calculates the end date given a start date and a number of years.
	 * @param startDate the start date. Cannot be null.
	 * @param years the number of years to add to the start date.
	 * @return the end date calculated by adding the years and subtracting one day.
	 * @throws ModuleException If the startDate is null.
	 */
	public static LocalDate calculateEndDateAfterYears(LocalDate startDate, int years) {
		if (startDate == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_CANNOT_BE_NULL);
		}
		return startDate.plusYears(years).minusDays(1);
	}

	/**
	 * Increments the given LocalDate by one year.
	 * @param localDate The LocalDate to increment. Cannot be null.
	 * @return The incremented LocalDate.
	 * @throws ModuleException If the localDate is null.
	 */
	public static LocalDate incrementYearByOne(LocalDate localDate) {
		if (localDate == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_CANNOT_BE_NULL);
		}
		return localDate.plusYears(1);
	}

	/**
	 * Calculates the valid 'to' date by adding the carry forward expiration days to the
	 * given LocalDate.
	 * @param startDate The starting LocalDate. Cannot be null.
	 * @param numberOfDays The number of days to add to the startDate.
	 * @return The calculated LocalDate.
	 * @throws ModuleException If the startDate is null.
	 */
	public static LocalDate incrementDays(LocalDate startDate, int numberOfDays) {
		if (startDate == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_CANNOT_BE_NULL);
		}
		return startDate.plusDays(numberOfDays);
	}

	/**
	 * Returns the month value of the given LocalDate.
	 * @param date The LocalDate object. Cannot be null.
	 * @return The month value (1-12).
	 * @throws ModuleException If the date is null.
	 */
	public static int getMonthValue(LocalDate date) {
		if (date == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_CANNOT_BE_NULL);
		}
		return date.getMonthValue();
	}

	/**
	 * Returns the day of the month of the given LocalDate.
	 * @param date The LocalDate object. Cannot be null.
	 * @return The day of the month (1-31).
	 * @throws ModuleException If the date is null.
	 */
	public static int getDayOfMonth(LocalDate date) {
		if (date == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_CANNOT_BE_NULL);
		}
		return date.getDayOfMonth();
	}

	/**
	 * Validates that the start date is before the end date.
	 * @param startDate The start date as a LocalDate. Cannot be null.
	 * @param endDate The end date as a LocalDate. Cannot be null.
	 * @return true if the endDate is null or if the startDate is not null and is before
	 * the endDate, otherwise false.
	 * @throws ModuleException If startDate or endDate is null.
	 */
	public static boolean isValidDateRange(LocalDate startDate, LocalDate endDate) {
		if (startDate == null || endDate == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_START_END_DATE_CANNOT_BE_NULL);
		}
		return startDate.isBefore(endDate);
	}

	/**
	 * Return the Suffix of the given date.
	 * @param day date that is needed to be formatted (1-31).
	 * @return the string Suffix.
	 * @throws ModuleException if the day is not within the valid range (1-31).
	 */
	public static String getDayOfMonthSuffix(int day) {
		if (day < 1 || day > 31) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_INVALID_DAY_OF_MONTH);
		}
		if (day >= 11 && day <= 13) {
			return "th";
		}
		return switch (day % 10) {
			case 1 -> "st";
			case 2 -> "nd";
			case 3 -> "rd";
			default -> "th";
		};
	}

	/**
	 * Validates whether the provided time zone ID is valid.
	 * @param timeZone The time zone ID to validate. Cannot be null.
	 * @return true if the time zone ID is valid, otherwise false.
	 * @throws ModuleException If the time zone ID is null.
	 */
	public static boolean isValidTimeZone(String timeZone) {
		if (timeZone == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_TIME_ZONE_CANNOT_BE_NULL);
		}
		Set<String> validIDs = ZoneId.getAvailableZoneIds();
		return validIDs.contains(timeZone);
	}

	/**
	 * Converts epoch milliseconds to LocalDateTime using the specified ZoneId.
	 * @param epochMillis the epoch milliseconds to convert
	 * @param zoneId the ZoneId to apply
	 * @return the corresponding LocalDateTime in the specified time zone, or null if
	 * epochMillis is null
	 */
	public static LocalDateTime epochMillisToUtcLocalDateTime(Long epochMillis, ZoneId zoneId) {
		if (zoneId == null) {
			return Instant.ofEpochMilli(epochMillis).atZone(ZoneOffset.UTC).toLocalDateTime();
		}
		return Instant.ofEpochMilli(epochMillis).atZone(zoneId).toLocalDateTime();
	}

	/**
	 * Converts epoch milliseconds to UTC LocalDate.
	 * @param epochMillis the epoch milliseconds to convert
	 * @return the corresponding LocalDate in UTC, or null if epochMillis is null
	 */
	public static LocalDate epochMillisToUtcLocalDate(Long epochMillis) {
		return Instant.ofEpochMilli(epochMillis).atZone(ZoneOffset.UTC).toLocalDate();
	}

	/**
	 * Converts epoch milliseconds to LocalTime using UTC timezone.
	 * @param epochMillis the epoch milliseconds to convert.
	 * @return the corresponding LocalTime in UTC.
	 * @throws ModuleException if epochMillis is null.
	 */
	public static LocalTime epochMillisToUtcLocalTime(Long epochMillis) {
		if (epochMillis == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_EPOCH_MILLIS_CANNOT_BE_NULL);
		}
		return Instant.ofEpochMilli(epochMillis).atZone(ZoneOffset.UTC).toLocalTime();
	}

	/**
	 * Converts a LocalDateTime to epoch milliseconds.
	 * @param localDateTime the LocalDateTime to convert. Cannot be null.
	 * @return the corresponding epoch milliseconds.
	 * @throws ModuleException if localDateTime is null.
	 */
	public static long localDateTimeToEpochMillis(LocalDateTime localDateTime) {
		if (localDateTime == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_TIME_CANNOT_BE_NULL);
		}
		return localDateTime.toInstant(ZoneOffset.UTC).toEpochMilli();
	}

	/**
	 * Converts a LocalDateTime to LocalDate by extracting the date part.
	 * @param localDateTime the LocalDateTime to convert. Cannot be null.
	 * @return the corresponding LocalDate.
	 * @throws ModuleException if localDateTime is null.
	 */
	public static LocalDate toLocalDate(LocalDateTime localDateTime) {
		if (localDateTime == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_TIME_CANNOT_BE_NULL);
		}
		return localDateTime.toLocalDate();
	}

	/**
	 * Converts epoch milliseconds to LocalDate using UTC timezone.
	 * @param epochDateTime the epoch milliseconds to convert. Cannot be null.
	 * @return the corresponding LocalDate in UTC.
	 * @throws ModuleException if epochDateTime is null.
	 */
	public static LocalDate getLocalDateFromEpoch(Long epochDateTime) {
		if (epochDateTime == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_EPOCH_MILLIS_CANNOT_BE_NULL);
		}
		return Instant.ofEpochMilli(epochDateTime).atZone(ZoneOffset.UTC).toLocalDate();
	}

	public static long getLongValueOfDate(LocalDate date) {
		return date.atStartOfDay().toEpochSecond(ZoneOffset.UTC);
	}

	public static DayOfWeek getDayOfWeek(LocalDate date) {

		return date.getDayOfWeek();
	}

	public static String epochMillisToAmPmString(Long epochMillis) {
		if (epochMillis == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_EPOCH_MILLIS_CANNOT_BE_NULL);
		}
		LocalTime time = Instant.ofEpochMilli(epochMillis).atZone(ZoneOffset.UTC).toLocalTime();
		return time.format(AM_PM_FORMATTER);
	}

	public static String formatDateWithSuffix(LocalDate date) {
		int dayOfMonth = date.getDayOfMonth();
		DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH);
		String suffix = getDayOfMonthSuffix(dayOfMonth);
		return dayOfMonth + suffix + " " + date.format(monthFormatter);
	}

	public static String concatPrefixWithTimestamp(String prefix) {
		return prefix + localDateTimeToEpochMillis(getCurrentUtcDateTime()) + TIMESTAMP_POSTFIX;
	}

	/**
	 * Formats a LocalDateTime to a string with pattern "MM/dd/yyyy | hh:mm:ss a".
	 * @param dateTime The LocalDateTime to format. Cannot be null.
	 * @return The formatted date-time string.
	 * @throws ModuleException If the dateTime is null.
	 */
	public static String formatDateTimeEsignCert(LocalDateTime dateTime) {
		if (dateTime == null) {
			throw new ModuleException(CommonMessageConstant.COMMON_ERROR_DATE_TIME_CANNOT_BE_NULL);
		}
		return dateTime.format(ESIGN_CERT_FORMATTER);
	}

}
