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
    public ResponseEntity<ResultResponse<Void>> createUser(@Valid @RequestBody UserCreationRequestDTO userCreationRequestDTO) {
        ResultResponse<Void> response;
        try {
            response = userService.createUser(userCreationRequestDTO);
            return ResponseEntity.ok(response);
        } catch (ExistingUserException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ResultResponse.<Void>builder().message(e.getMessage()).build());
        }
    }

    @GetMapping(path = "/", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> getUsers(
            @PageableDefault(page = 0, size = 15) Pageable page,
            UserFilterDTO filter) {
        try {
            Page<UserDTO> userPage = userService.getUsers(filter, page);

            PageableResultResponse<UserDTO> response = PageableResultResponse.fromPage(
                    userPage,
                    userPage.getContent(),
                    userPage.getTotalElements() > 0
                            ? "Usuarios obtenidos exitosamente"
                            : "No se encontraron usuarios que coincidan con los filtros"
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            ResultResponse<Void> errorResponse = ResultResponse.<Void>builder()
                    .success(false)
                    .message("Error al obtener usuarios: " + e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
