package org.alumnet.application.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@NotEmpty
@NotNull
public class UserDTO {
    private String name;
    private String lastname;
    private String role;
    @Email(message = "Email should be valid")
    private String email;
    private String password;

}
