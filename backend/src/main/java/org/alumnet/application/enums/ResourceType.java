package org.alumnet.application.enums;

import lombok.Getter;

@Getter
public enum ResourceType {
    LIBRARY("library"),
    SECTION("section");

    private final String value;

    ResourceType(String value) {
        this.value = value;
    }

}


