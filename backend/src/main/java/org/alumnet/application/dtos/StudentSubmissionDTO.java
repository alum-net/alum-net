package org.alumnet.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentSubmissionDTO {
    private String email;
    private double grade;
    private String name;
    private String lastname;
}
