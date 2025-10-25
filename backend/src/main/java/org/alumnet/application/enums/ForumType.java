package org.alumnet.application.enums;

import lombok.Getter;

@Getter
public enum ForumType {
    ANNOUNCE("announce"),
    GENERAL("general");

    private final String value;

    ForumType(String value) {
        this.value = value;
    }
}
