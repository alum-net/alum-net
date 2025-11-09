package org.alumnet.application.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StudentSummaryDTO {
	private String name;
	private String lastname;
	private String email;
	private Double calculatedGrade;
	private Boolean approved;
	private Double finalGrade;

	public StudentSummaryDTO(String name, String lastname, String email) {
		this.name = name;
		this.lastname = lastname;
		this.email = email;
	}
}
