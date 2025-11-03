package org.alumnet.application.enums;


import lombok.Getter;

@Getter
public enum EventType {
    TASK("task"),
    QUESTIONNAIRE("questionnaire"),
    ONSITE("on-site");

    private final String value;

     EventType(String value) {
        this.value = value;
    }
}
