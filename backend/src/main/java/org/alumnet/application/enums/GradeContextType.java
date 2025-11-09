package org.alumnet.application.enums;

import lombok.Getter;

@Getter
public enum GradeContextType {
    COURSE("curso"),
    EVENT("evento"),
    ;

    private final String value;

    GradeContextType(String value) {
        this.value = value;
    }
}
