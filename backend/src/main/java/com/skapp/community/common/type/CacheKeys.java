package com.skapp.community.common.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.concurrent.TimeUnit;

@Getter
@RequiredArgsConstructor
public enum CacheKeys implements CacheKey {

	SYSTEM_VERSION_CACHE_KEY("system_version_cache:latest_version", 7, TimeUnit.DAYS),
	USER_VERSION_CACHE_KEY("user_version_cache:%s:latest_version", 7, TimeUnit.DAYS),
	CODE_CHALLENGE_CACHE_KEY("code_challenge_cache:%s", 5, TimeUnit.MINUTES),
	TENANT_ALL_USERS_CACHE_KEY("users_cache:all_users", 7, TimeUnit.DAYS),
	TENANT_ALL_USERS_AUTH_PICS_CACHE_KEY("users_cache:all_users_auth_pics", 7, TimeUnit.DAYS),
	TENANT_ALL_JOBS_CACHE_KEY("jobs_cache:all_jobs", 5, TimeUnit.DAYS),
	ALL_PROJECT_DETAILS_CACHE_KEY("project_details_cache:all_projects", 7, TimeUnit.DAYS);// userId

	private final String key;

	private final long ttl;

	private final TimeUnit timeUnit;

	public String format(Object... values) {
		return key.formatted(values);
	}

}
