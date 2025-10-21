package org.alumnet.application.enums;

import lombok.Getter;

@Getter
public enum UserRole {
    STUDENT("student"),
    TEACHER("teacher"),
    ADMIN("admin");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }
}
