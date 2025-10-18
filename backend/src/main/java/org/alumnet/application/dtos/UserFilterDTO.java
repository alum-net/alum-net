package org.alumnet.application.dtos;

import lombok.Builder;
import lombok.Data;
import org.alumnet.application.enums.UserRole;

@Data
@Builder
public class UserFilterDTO {
    private String name;
    private String lastname;
    private String email;
    private UserRole role;
}
