package com.skapp.community.common.util.event;

import com.skapp.community.common.model.User;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public abstract class UserEvent extends ApplicationEvent {

	private final transient User user;

	protected UserEvent(Object source, User user) {
		super(source);
		this.user = user;
	}

}
