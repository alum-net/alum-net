package org.alumnet.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.alumnet.application.enums.UserRole;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String name;
    private String lastname;
    private String email;
    private UserRole role;
    private String avatarUrl;
    private boolean enabled;
}
