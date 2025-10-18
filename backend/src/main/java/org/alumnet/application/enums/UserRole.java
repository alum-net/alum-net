package org.alumnet.application.enums;

public enum UserRole {
    STUDENT("student"),
    TEACHER("teacher"),
    ADMIN("admin");

    private final String value;

    UserRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static UserRole fromValue(String text) {
        for (UserRole role : UserRole.values()) {
            if (role.value.equalsIgnoreCase(text)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unexpected value '" + text + "' for UserRole.");
    }
}
