package org.alumnet.application.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreationRequestDTO {
    @NotBlank(message = "El nombre del usuario no puede estar vacío")
    private String name;

    @NotBlank(message = "El apellido del usuario no puede estar vacío")
    private String lastname;

    @NotNull(message = "Debe seleccionarse un grupo (students, teachers o admins)")
    private String group;

    @Email(message = "Debe ser un email valido")
    @NotBlank(message = "Debe ingresar un email")
    private String email;

    @NotBlank(message = "Debe ingresar una contraseña")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

}
