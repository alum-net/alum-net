package org.alumnet.domain;

import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class Participation {
    private double grade;
}
