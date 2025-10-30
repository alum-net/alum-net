package org.alumnet.application.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public enum ShiftType {
    MORNING("morning"),
    AFTERNOON("afternoon"),
    EVENING("evening");

    private final String value;

    ShiftType(String value) {
        this.value = value;
    }
}
