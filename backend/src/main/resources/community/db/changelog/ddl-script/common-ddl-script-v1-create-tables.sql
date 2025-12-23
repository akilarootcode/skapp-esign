-- liquibase formatted sql

-- changeset AkilaSilva:common-ddl-script-v1-create-tables
CREATE TABLE IF NOT EXISTS `user`
(
    `user_id`             bigint       NOT NULL AUTO_INCREMENT,
    `email`               varchar(255) NOT NULL,
    `is_active`           bit(1)       NOT NULL,
    `is_password_changed` bit(1)       DEFAULT NULL,
    `password`            varchar(255) DEFAULT NULL,
    `previous_passwords`  varchar(255) DEFAULT NULL,
    `temp_password`       varchar(255) DEFAULT NULL,
    `login_method`        varchar(255) DEFAULT 'CREDENTIALS',
    `lang`                text,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `UK_user_email` (`email`)
);

CREATE TABLE IF NOT EXISTS `organization`
(
    `organization_id`        bigint NOT NULL AUTO_INCREMENT,
    `country`                varchar(100)  DEFAULT NULL,
    `organization_logo`      varchar(255)  DEFAULT NULL,
    `organization_name`      varchar(100)  DEFAULT NULL,
    `organization_website`   varchar(2083) DEFAULT NULL,
    `theme_color`            varchar(9)    DEFAULT NULL,
    `organization_time_zone` varchar(100)  DEFAULT NULL,
    `app_url`                varchar(255)  DEFAULT NULL,
    `company_domain`         varchar(255)  DEFAULT NULL,
    `dtype`                  varchar(255)  DEFAULT NULL,
    `contact_no`             varchar(15)   DEFAULT NULL,
    PRIMARY KEY (`organization_id`)
);

CREATE TABLE IF NOT EXISTS `job_family`
(
    `job_family_id` bigint      NOT NULL AUTO_INCREMENT,
    `is_active`     bit(1)      NOT NULL,
    `name`          varchar(50) NOT NULL,
    PRIMARY KEY (`job_family_id`)
);

CREATE TABLE IF NOT EXISTS `job_title`
(
    `job_title_id` bigint      NOT NULL AUTO_INCREMENT,
    `is_active`    bit(1)      NOT NULL,
    `title_name`   varchar(50) NOT NULL,
    PRIMARY KEY (`job_title_id`)
);

CREATE TABLE IF NOT EXISTS `team`
(
    `team_id`   bigint NOT NULL AUTO_INCREMENT,
    `is_active` bit(1)      DEFAULT NULL,
    `team_name` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`team_id`)
);

CREATE TABLE IF NOT EXISTS `leave_type`
(
    `type_id`                                    bigint       NOT NULL AUTO_INCREMENT,
    `calculation_type`                           varchar(255) NOT NULL,
    `carry_forward_expiration_date`              date         DEFAULT NULL,
    `carry_forward_expiration_days`              float        DEFAULT NULL,
    `color_code`                                 varchar(255) DEFAULT NULL,
    `emoji_code`                                 varchar(255) DEFAULT NULL,
    `is_active`                                  bit(1)       DEFAULT NULL,
    `is_attachment`                              bit(1)       DEFAULT NULL,
    `is_attachment_must`                         bit(1)       DEFAULT NULL,
    `is_auto_approval`                           bit(1)       DEFAULT NULL,
    `carry_forward_enabled`                      bit(1)       DEFAULT NULL,
    `is_carry_forward_remaining_balance_enabled` bit(1)       DEFAULT NULL,
    `is_comment_must`                            bit(1)       DEFAULT NULL,
    `is_overridden`                              bit(1)       DEFAULT NULL,
    `min_duration`                               varchar(255) NOT NULL,
    `max_carry_forward_days`                     float        DEFAULT NULL,
    `name`                                       varchar(20)  NOT NULL,
    PRIMARY KEY (`type_id`),
    UNIQUE KEY `UK_leave_type_name` (`name`)
);

CREATE TABLE IF NOT EXISTS `attendance_config`
(
    `config_title` varchar(255) NOT NULL,
    `config_value` varchar(255) NOT NULL,
    PRIMARY KEY (`config_title`)
);

CREATE TABLE IF NOT EXISTS `organization_config`
(
    `config_title` varchar(255) NOT NULL,
    `config_value` varchar(255) NOT NULL,
    PRIMARY KEY (`config_title`)
);

CREATE TABLE IF NOT EXISTS `module_role_restriction`
(
    `module`     varchar(255) NOT NULL,
    `is_admin`   bit(1) DEFAULT NULL,
    `is_manager` bit(1) DEFAULT NULL,
    PRIMARY KEY (`module`)
);

CREATE TABLE IF NOT EXISTS `time_config`
(
    `id`                bigint                                                                        NOT NULL AUTO_INCREMENT,
    `day_of_week`       enum ('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY') NOT NULL,
    `is_week_start_day` boolean                                                                       NOT NULL,
    `start_hour`        int  DEFAULT NULL,
    `start_minute`      int  DEFAULT NULL,
    `time_blocks`       json DEFAULT NULL,
    `total_hours`       float                                                                         NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `user_version`
(
    `user_id`            bigint       NOT NULL,
    `version`            varchar(255) NOT NULL,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE IF NOT EXISTS `module_config`
(
    `id`                bigint NOT NULL DEFAULT '1',
    `leave_module`      bit(1)          DEFAULT b'1',
    `attendance_module` bit(1)          DEFAULT b'1',
    `esign_module`      bit(1)          DEFAULT b'1',
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `organization_calendar`
(
    `is_google_calendar_enabled` bit(1) NOT NULL DEFAULT b'0',
    PRIMARY KEY (`is_google_calendar_enabled`)
);

CREATE TABLE IF NOT EXISTS `password_reset_otp`
(
    `user_id`           bigint    NOT NULL,
    `verification_code` varchar(255)   DEFAULT NULL,
    `is_verified`       bit(1)         DEFAULT NULL,
    `otp_expiry_time`   timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE IF NOT EXISTS `system_version`
(
    `version`            varchar(255) NOT NULL,
    `reason`             varchar(255) NOT NULL,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`version`)
);

CREATE TABLE IF NOT EXISTS `employee`
(
    `employee_id`           bigint NOT NULL,
    `created_by`            varchar(255) DEFAULT NULL,
    `created_date`          datetime(6)  DEFAULT NULL,
    `last_modified_by`      varchar(255) DEFAULT NULL,
    `last_modified_date`    datetime(6)  DEFAULT NULL,
    `account_status`        varchar(20)  DEFAULT NULL,
    `address`               varchar(255) DEFAULT NULL,
    `address_line_2`        varchar(255) DEFAULT NULL,
    `auth_pic`              text,
    `country`               varchar(255) DEFAULT NULL,
    `employee_type`         varchar(255) DEFAULT NULL,
    `designation`           varchar(255) DEFAULT NULL,
    `eeo`                   varchar(255) DEFAULT NULL,
    `employment_allocation` varchar(255) DEFAULT NULL,
    `first_name`            varchar(50)  DEFAULT NULL,
    `gender`                varchar(20)  DEFAULT NULL,
    `identification_no`     varchar(15)  DEFAULT NULL,
    `join_date`             date         DEFAULT NULL,
    `last_clock_in_date`    date         DEFAULT NULL,
    `last_name`             varchar(50)  DEFAULT NULL,
    `middle_name`           varchar(255) DEFAULT NULL,
    `personal_email`        varchar(255) DEFAULT NULL,
    `phone`                 varchar(15)  DEFAULT NULL,
    `termination_date`      date         DEFAULT NULL,
    `time_zone`             varchar(255) DEFAULT NULL,
    `work_hour_capacity`    int          DEFAULT NULL,
    `job_family_id`         bigint       DEFAULT NULL,
    `job_title_id`          bigint       DEFAULT NULL,
    PRIMARY KEY (`employee_id`),
    KEY `IDX_employee_job_family_id` (`job_family_id`),
    KEY `IDX_employee_job_title_id` (`job_title_id`),
    CONSTRAINT `FK_employee_job_family_job_family_id` FOREIGN KEY (`job_family_id`) REFERENCES `job_family` (`job_family_id`),
    CONSTRAINT `FK_employee_job_title_job_title_id` FOREIGN KEY (`job_title_id`) REFERENCES `job_title` (`job_title_id`),
    CONSTRAINT `FK_employee_user_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE IF NOT EXISTS `time_record`
(
    `time_record_id`     bigint NOT NULL AUTO_INCREMENT,
    `created_by`         varchar(255)                                                                  DEFAULT NULL,
    `created_date`       datetime(6)                                                                   DEFAULT NULL,
    `last_modified_by`   varchar(255)                                                                  DEFAULT NULL,
    `last_modified_date` datetime(6)                                                                   DEFAULT NULL,
    `break_hours`        float                                                                         DEFAULT NULL,
    `clock_in_time`      bigint                                                                        DEFAULT NULL,
    `clock_out_time`     bigint                                                                        DEFAULT NULL,
    `date`               date                                                                          DEFAULT NULL,
    `day_of_week`        enum ('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY') DEFAULT NULL,
    `is_completed`       bit(1)                                                                        DEFAULT NULL,
    `is_manual`          bit(1)                                                                        DEFAULT NULL,
    `leave_hours`        float                                                                         DEFAULT NULL,
    `worked_hours`       float                                                                         DEFAULT NULL,
    `employee_id`        bigint                                                                        DEFAULT NULL,
    PRIMARY KEY (`time_record_id`),
    KEY `IDX_time_record_employee_id` (`employee_id`),
    CONSTRAINT `FK_time_record_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `time_slot`
(
    `time_slot_id`   bigint NOT NULL AUTO_INCREMENT,
    `end_time`       bigint       DEFAULT NULL,
    `is_active_now`  bit(1)       DEFAULT NULL,
    `is_manual`      bit(1)       DEFAULT NULL,
    `type`           varchar(255) DEFAULT NULL,
    `start_time`     bigint       DEFAULT NULL,
    `time_record_id` bigint       DEFAULT NULL,
    PRIMARY KEY (`time_slot_id`),
    KEY `IDX_time_slot_time_record_id` (`time_record_id`),
    CONSTRAINT `FK_time_slot_time_record_time_record_id` FOREIGN KEY (`time_record_id`) REFERENCES `time_record` (`time_record_id`)
);

CREATE TABLE IF NOT EXISTS `time_request`
(
    `time_request_id`      bigint       NOT NULL AUTO_INCREMENT,
    `break_hours`          float       DEFAULT NULL,
    `created_date`         datetime(6)  NOT NULL,
    `initial_clock_in`     bigint      DEFAULT NULL,
    `initial_clock_out`    bigint      DEFAULT NULL,
    `request_type`         varchar(255) NOT NULL,
    `requested_end_time`   bigint      DEFAULT NULL,
    `requested_start_time` bigint      DEFAULT NULL,
    `reviewed_at`          datetime(6) DEFAULT NULL,
    `status`               varchar(255) NOT NULL,
    `work_hours`           float       DEFAULT NULL,
    `employee_id`          bigint       NOT NULL,
    `reviewer_id`          bigint      DEFAULT NULL,
    `time_record_id`       bigint      DEFAULT NULL,
    PRIMARY KEY (`time_request_id`),
    KEY `IDX_time_request_employee_id` (`employee_id`),
    KEY `IDX_time_request_time_record_id` (`time_record_id`),
    KEY `IDX_time_request_reviewer_id` (`reviewer_id`),
    CONSTRAINT `FK_time_request_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_time_request_employee_reviewer_id` FOREIGN KEY (`reviewer_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_time_request_time_record_time_record_id` FOREIGN KEY (`time_record_id`) REFERENCES `time_record` (`time_record_id`)
);

CREATE TABLE IF NOT EXISTS `employee_calendar`
(
    `calendar_id`         bigint NOT NULL AUTO_INCREMENT,
    `user_id`             bigint NOT NULL,
    `calendar_token`      varchar(255)    DEFAULT NULL,
    `integrated_calendar` varchar(255)    DEFAULT NULL,
    `is_enabled`          bit(1) NOT NULL DEFAULT b'1',
    PRIMARY KEY (`calendar_id`)
);

CREATE TABLE IF NOT EXISTS `employee_education`
(
    `education_id`   bigint NOT NULL AUTO_INCREMENT,
    `degree`         varchar(255) DEFAULT NULL,
    `end_date`       date         DEFAULT NULL,
    `institution`    varchar(255) DEFAULT NULL,
    `specialization` varchar(255) DEFAULT NULL,
    `start_date`     date         DEFAULT NULL,
    `employee_id`    bigint NOT NULL,
    PRIMARY KEY (`education_id`),
    KEY `IDX_employee_education_employee_id` (`employee_id`),
    CONSTRAINT `FK_employee_education_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_emergency`
(
    `emergency_id` bigint NOT NULL AUTO_INCREMENT,
    `contact_no`   varchar(15)  DEFAULT NULL,
    `relationship` varchar(255) DEFAULT NULL,
    `is_primary`   bit(1)       DEFAULT NULL,
    `name`         varchar(255) DEFAULT NULL,
    `employee_id`  bigint NOT NULL,
    PRIMARY KEY (`emergency_id`),
    KEY `IDX_employee_emergency_employee_id` (`employee_id`),
    CONSTRAINT `FK_employee_emergency_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_family`
(
    `family_id`    bigint NOT NULL AUTO_INCREMENT,
    `birth_date`   date         DEFAULT NULL,
    `relationship` varchar(255) DEFAULT NULL,
    `first_name`   varchar(255) DEFAULT NULL,
    `gender`       varchar(255) DEFAULT NULL,
    `last_name`    varchar(255) DEFAULT NULL,
    `parent_name`  varchar(255) DEFAULT NULL,
    `employee_id`  bigint NOT NULL,
    PRIMARY KEY (`family_id`),
    KEY `IDX_employee_family_employee_id` (`employee_id`),
    CONSTRAINT `FK_employee_family_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_manager`
(
    `id`                bigint NOT NULL AUTO_INCREMENT,
    `is_direct_manager` bit(1)       DEFAULT NULL,
    `manager_type`      varchar(255) DEFAULT NULL,
    `employee_id`       bigint       DEFAULT NULL,
    `manager_id`        bigint       DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_employee_manager_employee_id` (`employee_id`),
    KEY `IDX_employee_manager_manager_id` (`manager_id`),
    CONSTRAINT `FK_employee_manager_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_employee_manager_employee_manager_id` FOREIGN KEY (`manager_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_period`
(
    `id`          bigint NOT NULL AUTO_INCREMENT,
    `end_date`    date   DEFAULT NULL,
    `is_active`   bit(1) DEFAULT NULL,
    `start_date`  date   DEFAULT NULL,
    `employee_id` bigint DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_employee_period_employee_id` (`employee_id`),
    CONSTRAINT `FK_employee_period_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_personal_info`
(
    `employee_id`                 bigint NOT NULL,
    `birth_date`                  date                                                                                                                                                                                                                                                                                                                                                                                     DEFAULT NULL,
    `blood_group`                 enum ('AB_NEGATIVE','AB_POSITIVE','A_NEGATIVE','A_POSITIVE','B_NEGATIVE','B_POSITIVE','O_NEGATIVE','O_POSITIVE')                                                                                                                                                                                                                                                                         DEFAULT NULL,
    `city`                        varchar(255)                                                                                                                                                                                                                                                                                                                                                                             DEFAULT NULL,
    `ethnicity`                   enum ('AFRICAN','ALASKAN_NATIVE','ARABIC','AUSTRALASIAN_OR_ABORIGINAL','CARIBBEAN','CHINESE','CUBAN','DECLINED_TO_RESPOND','EUROPEAN_OR_ANGLO_SAXON','FILIPINO','GUAMANIAN','INDIAN','JAPANESE','KOREAN','LATIN_AMERICAN','MELANESIAN','MEXICAN','MICRONESIAN','OTHER_ASIAN','OTHER_HISPANIC','OTHER_PACIFIC_ISLANDER','POLYNESIAN','PUERTO_RICAN','US_OR_CANADIAN_INDIAN','VIETNAMESE') DEFAULT NULL,
    `extra_info`                  json                                                                                                                                                                                                                                                                                                                                                                                     DEFAULT NULL,
    `marital_status`              enum ('DIVORCED','MARRIED','SINGLE','WIDOWED')                                                                                                                                                                                                                                                                                                                                           DEFAULT NULL,
    `nationality`                 varchar(255)                                                                                                                                                                                                                                                                                                                                                                             DEFAULT NULL,
    `nin`                         varchar(255)                                                                                                                                                                                                                                                                                                                                                                             DEFAULT NULL,
    `passport_no`                 varchar(255)                                                                                                                                                                                                                                                                                                                                                                             DEFAULT NULL,
    `postal_code`                 varchar(255)                                                                                                                                                                                                                                                                                                                                                                             DEFAULT NULL,
    `previous_employment_details` json                                                                                                                                                                                                                                                                                                                                                                                     DEFAULT NULL,
    `social_media_details`        json                                                                                                                                                                                                                                                                                                                                                                                     DEFAULT NULL,
    `ssn`                         varchar(255)                                                                                                                                                                                                                                                                                                                                                                             DEFAULT NULL,
    `state`                       varchar(255)                                                                                                                                                                                                                                                                                                                                                                             DEFAULT NULL,
    PRIMARY KEY (`employee_id`),
    CONSTRAINT `FK_employee_personal_info_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_progression`
(
    `progression_id` bigint NOT NULL AUTO_INCREMENT,
    `employee_type`  varchar(255) DEFAULT NULL,
    `end_date`       date         DEFAULT NULL,
    `is_current`     bit(1)       DEFAULT NULL,
    `start_date`     date         DEFAULT NULL,
    `employee_id`    bigint NOT NULL,
    `job_family_id`  bigint NOT NULL,
    `job_title_id`   bigint NOT NULL,
    PRIMARY KEY (`progression_id`),
    KEY `IDX_employee_progression_job_title_id` (`job_title_id`),
    KEY `IDX_employee_progression_employee_id` (`employee_id`),
    KEY `IDX_employee_progression_job_family_id` (`job_family_id`),
    CONSTRAINT `FK_employee_progression_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_employee_progression_job_family_job_family_id` FOREIGN KEY (`job_family_id`) REFERENCES `job_family` (`job_family_id`),
    CONSTRAINT `FK_employee_progression_job_title_job_title_id` FOREIGN KEY (`job_title_id`) REFERENCES `job_title` (`job_title_id`)
);

CREATE TABLE IF NOT EXISTS `employee_role`
(
    `employee_id`             bigint NOT NULL,
    `attendance_role`         varchar(255) DEFAULT NULL,
    `permission_changed_date` date         DEFAULT NULL,
    `is_super_admin`          bit(1) NOT NULL,
    `leave_role`              varchar(255) DEFAULT NULL,
    `people_role`             varchar(255) DEFAULT NULL,
    `role_changed_by`         bigint       DEFAULT NULL,
    `esign_role`              varchar(255) DEFAULT NULL,
    `okr_role`                varchar(255) DEFAULT 'OKR_EMPLOYEE',
    PRIMARY KEY (`employee_id`),
    KEY `IDX_employee_role_role_changed_by` (`role_changed_by`),
    CONSTRAINT `FK_employee_role_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_employee_role_employee_role_changed_by` FOREIGN KEY (`role_changed_by`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_team`
(
    `id`            bigint NOT NULL AUTO_INCREMENT,
    `is_supervisor` bit(1) NOT NULL,
    `employee_id`   bigint DEFAULT NULL,
    `team_id`       bigint DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_employee_team_employee_id` (`employee_id`),
    KEY `IDX_employee_team_team_id` (`team_id`),
    CONSTRAINT `FK_employee_team_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_employee_team_team_team_id` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`)
);

CREATE TABLE IF NOT EXISTS `employee_timeline`
(
    `timeline_id`        bigint NOT NULL AUTO_INCREMENT,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    `new_value`          varchar(255) DEFAULT NULL,
    `previous_value`     varchar(255) DEFAULT NULL,
    `timeline_type`      varchar(255) DEFAULT NULL,
    `employee_id`        bigint       DEFAULT NULL,
    `recorded_by`        bigint       DEFAULT NULL,
    PRIMARY KEY (`timeline_id`),
    KEY `IDX_employee_timeline_employee_id` (`employee_id`),
    KEY `IDX_employee_timeline_recorded_by` (`recorded_by`),
    CONSTRAINT `FK_employee_timeline_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_employee_timeline_employee_recorded_by` FOREIGN KEY (`recorded_by`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `employee_visa`
(
    `visa_id`         bigint NOT NULL AUTO_INCREMENT,
    `expiration_date` date         DEFAULT NULL,
    `issued_date`     date         DEFAULT NULL,
    `issuing_country` varchar(255) DEFAULT NULL,
    `visa_type`       varchar(255) DEFAULT NULL,
    `employee_id`     bigint NOT NULL,
    PRIMARY KEY (`visa_id`),
    KEY `IDX_employee_visa_employee_id` (`employee_id`),
    CONSTRAINT `FK_employee_visa_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `holiday`
(
    `id`                 bigint       NOT NULL AUTO_INCREMENT,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    `date`               date         NOT NULL,
    `holiday_duration`   varchar(255) NOT NULL,
    `is_active`          bit(1)       DEFAULT NULL,
    `name`               varchar(50)  NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `job_family_title`
(
    `job_family_id` bigint NOT NULL,
    `job_title_id`  bigint NOT NULL,
    PRIMARY KEY (`job_family_id`, `job_title_id`),
    KEY `IDX_job_family_title_job_title_id` (`job_title_id`),
    CONSTRAINT `FK_job_family_title_job_family_job_family_id` FOREIGN KEY (`job_family_id`) REFERENCES `job_family` (`job_family_id`),
    CONSTRAINT `FK_job_family_title_job_title_job_title_id` FOREIGN KEY (`job_title_id`) REFERENCES `job_title` (`job_title_id`)
);

CREATE TABLE IF NOT EXISTS `leave_entitlement`
(
    `entitlement_id`       bigint NOT NULL AUTO_INCREMENT,
    `created_by`           varchar(255) DEFAULT NULL,
    `created_date`         datetime(6)  DEFAULT NULL,
    `last_modified_by`     varchar(255) DEFAULT NULL,
    `last_modified_date`   datetime(6)  DEFAULT NULL,
    `is_active`            bit(1) NOT NULL,
    `is_manual`            bit(1) NOT NULL,
    `is_override`          bit(1) NOT NULL,
    `reason`               varchar(40)  DEFAULT NULL,
    `total_days_allocated` float  NOT NULL,
    `total_days_used`      float  NOT NULL,
    `valid_from`           date   NOT NULL,
    `valid_to`             date   NOT NULL,
    `employee_id`          bigint NOT NULL,
    `leave_type_id`        bigint NOT NULL,
    PRIMARY KEY (`entitlement_id`),
    KEY `IDX_leave_entitlement_employee_id` (`employee_id`),
    KEY `IDX_leave_entitlement_leave_type_id` (`leave_type_id`),
    CONSTRAINT `FK_leave_entitlement_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_leave_entitlement_leave_type_type_id` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`type_id`)
);

CREATE TABLE IF NOT EXISTS `leave_request`
(
    `leave_req_id`       bigint       NOT NULL AUTO_INCREMENT,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    `duration_days`      float        DEFAULT NULL,
    `end_date`           date         NOT NULL,
    `event_id`           varchar(255) DEFAULT NULL,
    `is_auto_approved`   bit(1)       DEFAULT NULL,
    `is_viewed`          bit(1)       DEFAULT NULL,
    `leave_state`        varchar(255) NOT NULL,
    `description`        varchar(255) DEFAULT NULL,
    `reviewed_date`      datetime(6)  DEFAULT NULL,
    `reviewer_comment`   varchar(255) DEFAULT NULL,
    `start_date`         date         NOT NULL,
    `status`             varchar(255) NOT NULL,
    `employee_id`        bigint       NOT NULL,
    `type_id`            bigint       NOT NULL,
    `reviewer_id`        bigint       DEFAULT NULL,
    PRIMARY KEY (`leave_req_id`),
    KEY `IDX_leave_request_reviewer_id` (`reviewer_id`),
    KEY `IDX_leave_request_type_id` (`type_id`),
    KEY `IDX_leave_request_employee_id` (`employee_id`),
    CONSTRAINT `FK_leave_request_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_leave_request_employee_reviewer_id` FOREIGN KEY (`reviewer_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_leave_request_leave_type_type_id` FOREIGN KEY (`type_id`) REFERENCES `leave_type` (`type_id`)
);

CREATE TABLE IF NOT EXISTS `leave_request_attachment`
(
    `attachment_id`      bigint NOT NULL AUTO_INCREMENT,
    `cognito_file_name`  varchar(255) DEFAULT NULL,
    `original_file_name` varchar(255) DEFAULT NULL,
    `file_url`           varchar(255) DEFAULT NULL,
    `leave_request_id`   bigint NOT NULL,
    PRIMARY KEY (`attachment_id`),
    KEY `IDX_leave_request_attachment_leave_request_id` (`leave_request_id`),
    CONSTRAINT `FK_leave_request_attachment_leave_request_leave_req_id` FOREIGN KEY (`leave_request_id`) REFERENCES `leave_request` (`leave_req_id`)
);

CREATE TABLE IF NOT EXISTS `leave_request_entitlement`
(
    `id`                   bigint NOT NULL AUTO_INCREMENT,
    `days_used`            float  NOT NULL,
    `leave_entitlement_id` bigint DEFAULT NULL,
    `leave_request_id`     bigint DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_leave_request_entitlement_leave_entitlement_id` (`leave_entitlement_id`),
    KEY `IDX_leave_request_entitlement_leave_request_id` (`leave_request_id`),
    CONSTRAINT `FK_leave_request_entitlement_leave_entitlement_entitlement_id` FOREIGN KEY (`leave_entitlement_id`) REFERENCES `leave_entitlement` (`entitlement_id`),
    CONSTRAINT `FK_leave_request_entitlement_leave_request_leave_req_id` FOREIGN KEY (`leave_request_id`) REFERENCES `leave_request` (`leave_req_id`)
);

CREATE TABLE IF NOT EXISTS `notification`
(
    `id`                 bigint NOT NULL AUTO_INCREMENT,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    `body`               varchar(255) DEFAULT NULL,
    `is_viewed`          bit(1)       DEFAULT NULL,
    `notification_type`  varchar(255) DEFAULT NULL,
    `resource_id`        varchar(255) DEFAULT NULL,
    `employee_id`        bigint       DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_notification_employee_id` (`employee_id`),
    CONSTRAINT `FK_notification_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `type_rule`
(
    `rule_id`              bigint       NOT NULL AUTO_INCREMENT,
    `each_year_applicable` bit(1)       DEFAULT NULL,
    `gain_eligible_type`   varchar(255) NOT NULL,
    `is_active`            bit(1)       DEFAULT NULL,
    `rule_category`        varchar(255) NOT NULL,
    `employee_type`        varchar(255) NOT NULL,
    `lose_eligible_type`   varchar(255) NOT NULL,
    `name`                 varchar(255) DEFAULT NULL,
    `valid_from`           date         DEFAULT NULL,
    `type_id`              bigint       NOT NULL,
    PRIMARY KEY (`rule_id`),
    UNIQUE KEY `UK_type_rule_name` (`name`),
    KEY `IDX_type_rule_type_id` (`type_id`),
    CONSTRAINT `FK_type_rule_leave_type_type_id` FOREIGN KEY (`type_id`) REFERENCES `leave_type` (`type_id`)
);

CREATE TABLE IF NOT EXISTS `rule_property`
(
    `prop_id`       bigint       NOT NULL AUTO_INCREMENT,
    `earn_grid`     json DEFAULT NULL,
    `earn_method`   varchar(255) NOT NULL,
    `num_days`      int  DEFAULT NULL,
    `property_type` varchar(255) NOT NULL,
    `rule_id`       bigint       NOT NULL,
    PRIMARY KEY (`prop_id`),
    KEY `IDX_rule_property_rule_id` (`rule_id`),
    CONSTRAINT `FK_rule_property_type_rule_rule_id` FOREIGN KEY (`rule_id`) REFERENCES `type_rule` (`rule_id`)
);

CREATE TABLE IF NOT EXISTS `calendar_event`
(
    `leave_req_id` bigint       NOT NULL,
    `event_id`     varchar(255) NOT NULL,
    PRIMARY KEY (`event_id`)
);

CREATE TABLE IF NOT EXISTS `carry_forward_info`
(
    `info_id`            bigint NOT NULL AUTO_INCREMENT,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    `cycle_end_date`     date         DEFAULT NULL,
    `days`               float        DEFAULT NULL,
    `employee_id`        bigint NOT NULL,
    `leave_type_id`      bigint NOT NULL,
    PRIMARY KEY (`info_id`),
    KEY `IDX_carry_forward_info_employee_id` (`employee_id`),
    KEY `IDX_carry_forward_info_leave_type_id` (`leave_type_id`),
    CONSTRAINT `FK_carry_forward_info_employee_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
    CONSTRAINT `FK_carry_forward_info_leave_type_type_id` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`type_id`)
);

CREATE TABLE IF NOT EXISTS `device_token`
(
    `id`                 bigint NOT NULL AUTO_INCREMENT,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    `token`              varchar(255) DEFAULT NULL,
    `user_id`            bigint       DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `user_settings`
(
    `user_id`       bigint NOT NULL,
    `notifications` json DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    CONSTRAINT `FK_user_settings_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE IF NOT EXISTS `support_request`
(
    `support_req_id`     bigint       NOT NULL AUTO_INCREMENT,
    `issue_type`         varchar(255) NOT NULL,
    `details`            text,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`support_req_id`)
);

CREATE TABLE IF NOT EXISTS `support_request_attachment`
(
    `attachment_id`      bigint NOT NULL AUTO_INCREMENT,
    `file_path`          text   NOT NULL,
    `support_request_id` bigint NOT NULL,
    PRIMARY KEY (`attachment_id`),
    KEY `fk_support_request_attachment` (`support_request_id`),
    CONSTRAINT `fk_support_request_attachment` FOREIGN KEY (`support_request_id`) REFERENCES `support_request` (`support_req_id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `es_external_user`
(
    `id`         bigint       NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name`  varchar(255) NOT NULL,
    `email`      varchar(255) NOT NULL,
    `phone`      varchar(15) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
);

CREATE TABLE IF NOT EXISTS `es_config`
(
    `id`              bigint      NOT NULL AUTO_INCREMENT,
    `date_format`     varchar(20) NOT NULL DEFAULT 'DD_MM_YYYY',
    `expiration_days` int         NOT NULL,
    `reminder_days`   int         NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `es_document_signature`
(
    `id`                 bigint NOT NULL AUTO_INCREMENT,
    `signature`          text   NOT NULL,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `in_customer`
(
    `id`                 bigint       NOT NULL AUTO_INCREMENT,
    `name`               varchar(255) NOT NULL,
    `email`              varchar(255)          DEFAULT NULL,
    `address`            varchar(255)          DEFAULT NULL,
    `country`            varchar(100)          DEFAULT NULL,
    `currency`           varchar(10)  NOT NULL DEFAULT 'USD',
    `status`             varchar(100) NOT NULL DEFAULT 'ACTIVE',
    `created_by`         varchar(255)          DEFAULT NULL,
    `created_date`       datetime(6)           DEFAULT NULL,
    `last_modified_by`   varchar(255)          DEFAULT NULL,
    `last_modified_date` datetime(6)           DEFAULT NULL,
    `number_format`      varchar(50)  NOT NULL DEFAULT 'US_UK',
    `date_format`        varchar(50)  NOT NULL DEFAULT 'YYYY_MM_DD',
    `vat_id`             varchar(255)          DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `in_customer_contact`
(
    `id`                 bigint       NOT NULL AUTO_INCREMENT,
    `customer_id`        bigint       NOT NULL,
    `name`               varchar(255) NOT NULL,
    `email`              varchar(255) NOT NULL,
    `contact_no`         varchar(15)  DEFAULT NULL,
    `job_title`          varchar(255) DEFAULT NULL,
    `is_active`          bit(1)       NOT NULL,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_customer_contact_customer` (`customer_id`),
    CONSTRAINT `FK_customer_contact_customer` FOREIGN KEY (`customer_id`) REFERENCES `in_customer` (`id`)
);

CREATE TABLE IF NOT EXISTS `es_address_book`
(
    `id`                  bigint     NOT NULL AUTO_INCREMENT,
    `internal_user_id`    bigint              DEFAULT NULL,
    `external_user_id`    bigint              DEFAULT NULL,
    `type`                varchar(255)        DEFAULT NULL,
    `is_active`           tinyint(1) NOT NULL DEFAULT '1',
    `my_signature_link`   text,
    `my_signature_method` varchar(255)        DEFAULT NULL,
    `font_family`         varchar(255)        DEFAULT NULL,
    `font_color`          varchar(255)        DEFAULT NULL,
    `customer_id`         bigint              DEFAULT NULL,
    `customer_contact_id` bigint              DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_address_book_user` (`internal_user_id`),
    KEY `FK_address_book_external_user` (`external_user_id`),
    KEY `FK_address_book_customer` (`customer_id`),
    KEY `FK_address_book_customer_contact` (`customer_contact_id`),
    CONSTRAINT `FK_address_book_customer` FOREIGN KEY (`customer_id`) REFERENCES `in_customer` (`id`),
    CONSTRAINT `FK_address_book_customer_contact` FOREIGN KEY (`customer_contact_id`) REFERENCES `in_customer_contact` (`id`),
    CONSTRAINT `FK_address_book_external_user` FOREIGN KEY (`external_user_id`) REFERENCES `es_external_user` (`id`),
    CONSTRAINT `FK_address_book_user` FOREIGN KEY (`internal_user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE IF NOT EXISTS `es_envelope`
(
    `envelope_id`        bigint      NOT NULL AUTO_INCREMENT,
    `name`               varchar(255) DEFAULT NULL,
    `status`             varchar(255) DEFAULT NULL,
    `message`            text,
    `subject`            varchar(255) DEFAULT NULL,
    `sent_at`            datetime(6)  DEFAULT NULL,
    `completed_at`       datetime(6)  DEFAULT NULL,
    `declined_at`        datetime(6)  DEFAULT NULL,
    `expire_at`          datetime(6)  DEFAULT NULL,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    `owner_id`           bigint       DEFAULT NULL,
    `void_reason`        varchar(255) DEFAULT NULL,
    `sign_type`          varchar(255) DEFAULT 'SEQUENTIAL',
    `envelope_uuid`      varchar(23) NOT NULL,
    PRIMARY KEY (`envelope_id`),
    KEY `fk_es_envelope_owner` (`owner_id`),
    KEY `IDX_envelope_uuid` (`envelope_uuid`),
    CONSTRAINT `fk_es_envelope_owner` FOREIGN KEY (`owner_id`) REFERENCES `es_address_book` (`id`)
);

CREATE TABLE IF NOT EXISTS `es_document`
(
    `document_id`               bigint NOT NULL AUTO_INCREMENT,
    `name`                      varchar(255)    DEFAULT NULL,
    `file_path`                 varchar(255)    DEFAULT NULL,
    `envelope_id`               bigint          DEFAULT NULL,
    `current_version`           int    NOT NULL DEFAULT '1',
    `current_sign_order_number` int    NOT NULL DEFAULT '1',
    `num_of_pages`              int             DEFAULT '0',
    PRIMARY KEY (`document_id`),
    KEY `FK_document_envelope` (`envelope_id`),
    CONSTRAINT `FK_document_envelope` FOREIGN KEY (`envelope_id`) REFERENCES `es_envelope` (`envelope_id`)
);

CREATE TABLE IF NOT EXISTS `es_recipient`
(
    `recipient_id`      bigint NOT NULL AUTO_INCREMENT,
    `name`              varchar(255)    DEFAULT NULL,
    `email`             varchar(255)    DEFAULT NULL,
    `member_role`       varchar(255)    DEFAULT NULL,
    `status`            varchar(255)    DEFAULT NULL,
    `signing_order`     int             DEFAULT NULL,
    `envelope_id`       bigint          DEFAULT NULL,
    `address_book_id`   bigint          DEFAULT NULL,
    `color`             varchar(255)    DEFAULT NULL,
    `reminder_batch_id` varchar(255)    DEFAULT NULL,
    `reminder_status`   varchar(255)    DEFAULT NULL,
    `email_status`      varchar(255)    DEFAULT NULL,
    `received_at`       datetime(6)     DEFAULT NULL,
    `decline_reason`    varchar(600)    DEFAULT NULL,
    `is_consent`        bit(1) NOT NULL DEFAULT b'0',
    `inbox_status`      varchar(255)    DEFAULT NULL,
    PRIMARY KEY (`recipient_id`),
    KEY `FK_recipient_envelope` (`envelope_id`),
    KEY `FK_recipient_address_book` (`address_book_id`),
    CONSTRAINT `FK_recipient_address_book` FOREIGN KEY (`address_book_id`) REFERENCES `es_address_book` (`id`),
    CONSTRAINT `FK_recipient_envelope` FOREIGN KEY (`envelope_id`) REFERENCES `es_envelope` (`envelope_id`)
);

CREATE TABLE IF NOT EXISTS `es_field`
(
    `field_id`     bigint NOT NULL AUTO_INCREMENT,
    `type`         varchar(255) DEFAULT NULL,
    `status`       varchar(255) DEFAULT NULL,
    `page_number`  int          DEFAULT NULL,
    `x_position`   float        DEFAULT NULL,
    `y_position`   float        DEFAULT NULL,
    `document_id`  bigint       DEFAULT NULL,
    `recipient_id` bigint NOT NULL,
    `font_family`  varchar(255) DEFAULT NULL,
    `font_color`   varchar(255) DEFAULT NULL,
    `width`        float  NOT NULL,
    `height`       float  NOT NULL,
    PRIMARY KEY (`field_id`),
    KEY `FK_field_document` (`document_id`),
    KEY `FK_field_recipient` (`recipient_id`),
    CONSTRAINT `FK_field_document` FOREIGN KEY (`document_id`) REFERENCES `es_document` (`document_id`),
    CONSTRAINT `FK_field_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `es_recipient` (`recipient_id`)
);

CREATE TABLE IF NOT EXISTS `es_audit_trail`
(
    `audit_id`        bigint NOT NULL AUTO_INCREMENT,
    `envelope_id`     bigint       DEFAULT NULL,
    `recipient_id`    bigint       DEFAULT NULL,
    `address_book_id` bigint       DEFAULT NULL,
    `ip_address`      varchar(255) DEFAULT NULL,
    `action`          varchar(255) DEFAULT NULL,
    `timestamp`       datetime(6)  DEFAULT NULL,
    `metadata`        varchar(255) DEFAULT NULL,
    `is_authorized`   tinyint(1)   DEFAULT NULL,
    `hash`            varchar(255) DEFAULT NULL,
    PRIMARY KEY (`audit_id`),
    KEY `FK_audit_trail_envelope` (`envelope_id`),
    KEY `FK_audit_trail_recipient` (`recipient_id`),
    KEY `FK_audit_address_book_user` (`address_book_id`),
    CONSTRAINT `FK_audit_address_book_user` FOREIGN KEY (`address_book_id`) REFERENCES `es_address_book` (`id`),
    CONSTRAINT `FK_audit_trail_envelope` FOREIGN KEY (`envelope_id`) REFERENCES `es_envelope` (`envelope_id`),
    CONSTRAINT `FK_audit_trail_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `es_recipient` (`recipient_id`)
);

CREATE TABLE IF NOT EXISTS `es_envelope_setting`
(
    `id`                          bigint NOT NULL AUTO_INCREMENT,
    `expiration_date`             date         DEFAULT NULL,
    `reminder_days`               int          DEFAULT NULL,
    `retention_period`            int          DEFAULT NULL,
    `auto_delete_after_retention` bit(1)       DEFAULT NULL,
    `allow_signing_order_change`  bit(1)       DEFAULT NULL,
    `allow_editing_fields`        bit(1)       DEFAULT NULL,
    `brand_logo_url`              varchar(255) DEFAULT NULL,
    `brand_theme`                 varchar(255) DEFAULT NULL,
    `digital_signature_required`  bit(1)       DEFAULT NULL,
    `envelope_id`                 bigint       DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `envelope_id` (`envelope_id`),
    CONSTRAINT `FK_envelope_setting_envelope` FOREIGN KEY (`envelope_id`) REFERENCES `es_envelope` (`envelope_id`)
);

CREATE TABLE IF NOT EXISTS `es_document_link`
(
    `id`                bigint       NOT NULL AUTO_INCREMENT,
    `token`             text         NOT NULL,
    `expires_at`        datetime(6)  NOT NULL,
    `max_clicks`        int          NOT NULL,
    `click_count`       int          NOT NULL,
    `is_active`         bit(1)       NOT NULL,
    `create_by_user_id` bigint       NOT NULL,
    `created_at`        datetime(6)  NOT NULL,
    `envelope_id`       bigint                DEFAULT NULL,
    `recipient_id`      bigint                DEFAULT NULL,
    `document_id`       bigint                DEFAULT NULL,
    `is_resend`         bit(1)       NOT NULL DEFAULT b'0',
    `permission_type`   varchar(255)          DEFAULT 'READ',
    `uuid`              varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_document_link_envelope` (`envelope_id`),
    KEY `FK_document_link_recipient` (`recipient_id`),
    KEY `FK_document_link_document` (`document_id`),
    KEY `IDX_uuid` (`uuid`),
    CONSTRAINT `FK_document_link_document` FOREIGN KEY (`document_id`) REFERENCES `es_document` (`document_id`),
    CONSTRAINT `FK_document_link_envelope` FOREIGN KEY (`envelope_id`) REFERENCES `es_envelope` (`envelope_id`),
    CONSTRAINT `FK_document_link_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `es_recipient` (`recipient_id`)
);

CREATE TABLE IF NOT EXISTS `es_document_version`
(
    `id`                    bigint       NOT NULL AUTO_INCREMENT,
    `document_id`           bigint       NOT NULL,
    `version_number`        int          NOT NULL,
    `document_hash`         text         NOT NULL,
    `file_path`             varchar(255) NOT NULL,
    `document_signature_id` bigint       DEFAULT NULL,
    `address_book_id`       bigint       DEFAULT NULL,
    `created_by`            varchar(255) DEFAULT NULL,
    `created_date`          datetime(6)  DEFAULT NULL,
    `last_modified_by`      varchar(255) DEFAULT NULL,
    `last_modified_date`    datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_es_document_version_document` (`document_id`),
    KEY `fk_es_document_version_signature` (`document_signature_id`),
    KEY `fk_es_document_version_address_book` (`address_book_id`),
    CONSTRAINT `fk_es_document_version_address_book` FOREIGN KEY (`address_book_id`) REFERENCES `es_address_book` (`id`),
    CONSTRAINT `fk_es_document_version_document` FOREIGN KEY (`document_id`) REFERENCES `es_document` (`document_id`),
    CONSTRAINT `fk_es_document_version_signature` FOREIGN KEY (`document_signature_id`) REFERENCES `es_document_signature` (`id`)
);

CREATE TABLE IF NOT EXISTS `es_document_version_field`
(
    `id`                  bigint NOT NULL AUTO_INCREMENT,
    `document_version_id` bigint NOT NULL,
    `field_id`            bigint NOT NULL,
    `field_value`         varchar(255) DEFAULT NULL,
    `x_position`          float  NOT NULL,
    `y_position`          float  NOT NULL,
    `field_hash`          text,
    `field_signature`     text,
    `width`               float  NOT NULL,
    `height`              float  NOT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_document_version_field_document_version` (`document_version_id`),
    KEY `fk_document_version_field_field` (`field_id`),
    CONSTRAINT `fk_document_version_field_document_version` FOREIGN KEY (`document_version_id`) REFERENCES `es_document_version` (`id`),
    CONSTRAINT `fk_document_version_field_field` FOREIGN KEY (`field_id`) REFERENCES `es_field` (`field_id`)
);

CREATE TABLE IF NOT EXISTS `es_user_key`
(
    `id`              bigint      NOT NULL AUTO_INCREMENT,
    `address_book_id` bigint DEFAULT NULL,
    `private_key`     longtext,
    `public_key`      longtext,
    `certificate`     longtext,
    `vector`          varchar(32) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_user_key_address_book` (`address_book_id`),
    CONSTRAINT `FK_user_key_address_book` FOREIGN KEY (`address_book_id`) REFERENCES `es_address_book` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_config`
(
    `id`             bigint NOT NULL AUTO_INCREMENT,
    `invoice_logo`   text,
    `currency`       text,
    `country`        text,
    `payment_terms`  text,
    `pay_to_address` text,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `in_customer_project`
(
    `customer_id`        bigint NOT NULL,
    `project_id`         bigint NOT NULL,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`customer_id`, `project_id`),
    KEY `IDX_in_customer_project_project_id` (`project_id`),
    CONSTRAINT `FK_customer_project_customer` FOREIGN KEY (`customer_id`) REFERENCES `in_customer` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_invoice`
(
    `id`                   bigint       NOT NULL AUTO_INCREMENT,
    `customer_id`          bigint       NOT NULL,
    `invoice_id`           varchar(255) NOT NULL,
    `project_id`           bigint                DEFAULT NULL,
    `invoice_date`         datetime(6)  NOT NULL,
    `due_date`             datetime(6)           DEFAULT NULL,
    `billed_to`            varchar(255)          DEFAULT NULL,
    `pay_to`               varchar(255)          DEFAULT NULL,
    `currency`             varchar(10)  NOT NULL DEFAULT 'USD',
    `status`               varchar(255) NOT NULL,
    `discount_type`        varchar(255)          DEFAULT NULL,
    `discount_value`       double                DEFAULT NULL,
    `sub_total_amount`     double                DEFAULT NULL,
    `payable_total_amount` double                DEFAULT NULL,
    `invoice_logo`         text,
    `invoice_terms`        text,
    `invoice_notes`        text,
    `created_by`           varchar(255)          DEFAULT NULL,
    `created_date`         datetime(6)           DEFAULT NULL,
    `last_modified_by`     varchar(255)          DEFAULT NULL,
    `last_modified_date`   datetime(6)           DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_in_invoice_customer_id` (`customer_id`),
    KEY `IDX_in_invoice_project_id` (`project_id`),
    CONSTRAINT `FK_in_invoice_in_customer_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `in_customer` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_item`
(
    `id`             bigint       NOT NULL AUTO_INCREMENT,
    `invoice_id`     bigint       NOT NULL,
    `item_name`      varchar(255) NOT NULL,
    `description`    text,
    `quantity`       double       DEFAULT NULL,
    `unit_price`     double       DEFAULT NULL,
    `discount_type`  varchar(255) DEFAULT NULL,
    `discount_value` double       DEFAULT NULL,
    `amount`         double       DEFAULT NULL,
    `quantity_type`  varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_in_item_invoice_id` (`invoice_id`),
    CONSTRAINT `FK_in_item_in_invoice_invoice_id` FOREIGN KEY (`invoice_id`) REFERENCES `in_invoice` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_expense`
(
    `id`         bigint       NOT NULL AUTO_INCREMENT,
    `invoice_id` bigint       NOT NULL,
    `name`       varchar(255) NOT NULL,
    `category`   varchar(255) NOT NULL,
    `date`       datetime(6)  NOT NULL,
    `amount`     double DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_in_expense_invoice_id` (`invoice_id`),
    CONSTRAINT `FK_in_expense_in_invoice_invoice_id` FOREIGN KEY (`invoice_id`) REFERENCES `in_invoice` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_expense_attachment`
(
    `id`             bigint NOT NULL AUTO_INCREMENT,
    `expense_id`     bigint NOT NULL,
    `attachment_url` text   NOT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_in_expense_attachment_expense_id` (`expense_id`),
    CONSTRAINT `FK_in_expense_attachment_in_expense_expense_id` FOREIGN KEY (`expense_id`) REFERENCES `in_expense` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_tax`
(
    `id`             bigint       NOT NULL AUTO_INCREMENT,
    `invoice_id`     bigint       NOT NULL,
    `tax_type`       varchar(255) NOT NULL,
    `tax_percentage` double       NOT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_in_tax_invoice_id` (`invoice_id`),
    CONSTRAINT `FK_in_tax_in_invoice_invoice_id` FOREIGN KEY (`invoice_id`) REFERENCES `in_invoice` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_customer_document`
(
    `id`              bigint       NOT NULL AUTO_INCREMENT,
    `customer_id`     bigint       NOT NULL,
    `name`            varchar(255) NOT NULL,
    `document_url`    text         NOT NULL,
    `document_status` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_in_customer_documents_customer_id` (`customer_id`),
    CONSTRAINT `FK_in_customer_document_in_customer_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `in_customer` (`id`)
);

CREATE TABLE IF NOT EXISTS `in_project_member_billable_rate`
(
    `id`                 bigint      NOT NULL AUTO_INCREMENT,
    `employee_id`        bigint      NOT NULL,
    `project_id`         bigint      NOT NULL,
    `customer_id`        bigint      NOT NULL,
    `billable_rate`      double       DEFAULT NULL,
    `billable_frequency` varchar(15) NOT NULL,
    `is_active`          bit(1)      NOT NULL,
    `created_by`         varchar(255) DEFAULT NULL,
    `created_date`       datetime(6)  DEFAULT NULL,
    `last_modified_by`   varchar(255) DEFAULT NULL,
    `last_modified_date` datetime(6)  DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_billable_rate_user` (`employee_id`),
    KEY `IDX_billable_rate_customer_project` (`project_id`),
    KEY `IDX_billable_rate_customer_project_customer` (`customer_id`),
    CONSTRAINT `FK_billable_rate_customer_project` FOREIGN KEY (`customer_id`, `project_id`) REFERENCES `in_customer_project` (`customer_id`, `project_id`),
    CONSTRAINT `FK_billable_rate_user` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
);

CREATE TABLE IF NOT EXISTS `okr_config`
(
    `id`        bigint      NOT NULL AUTO_INCREMENT,
    `frequency` varchar(50) NOT NULL DEFAULT 'ANNUAL',
    PRIMARY KEY (`id`)
);

