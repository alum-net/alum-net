package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.dtos.UserCreationRequestDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.UserFilterDTO;
import org.alumnet.application.services.UserService;
import org.alumnet.infrastructure.exceptions.ExistingUserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/create-user", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> createUser(@Valid @RequestBody UserCreationRequestDTO userCreationRequestDTO) {
        userService.createUser(userCreationRequestDTO);
        return ResponseEntity.ok(ResultResponse.success(null, "Usuario creado exitosamente"));
    }

    @GetMapping(path = "/", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<PageableResultResponse<UserDTO>> getUsers(
            @PageableDefault(page = 0, size = 15) Pageable page,
            UserFilterDTO filter) {
        Page<UserDTO> userPage = userService.getUsers(filter, page);

        PageableResultResponse<UserDTO> response = PageableResultResponse.fromPage(
                userPage,
                userPage.getContent(),
                userPage.getTotalElements() > 0
                        ? "Usuarios obtenidos exitosamente"
                        : "No se encontraron usuarios que coincidan con los filtros"
            );

            return ResponseEntity.ok(response);

    }
}
