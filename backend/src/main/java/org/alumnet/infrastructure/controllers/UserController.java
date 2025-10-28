package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import org.alumnet.application.dtos.requests.UserCreationRequestDTO;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.dtos.requests.UserFilterDTO;
import org.alumnet.application.dtos.requests.UserModifyRequestDTO;
import org.alumnet.application.dtos.responses.PageableResultResponse;
import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/create-user", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse<Object>> createUser(
            @Valid @RequestBody UserCreationRequestDTO userCreationRequestDTO) {
        userService.createUser(userCreationRequestDTO);
        return ResponseEntity.ok(ResultResponse.success(null, "Usuario creado exitosamente"));
    }

    @GetMapping(path = "/", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher')")
    public ResponseEntity<PageableResultResponse<UserDTO>> getUsers(
            @PageableDefault(page = 0, size = 15) Pageable page,
            UserFilterDTO filter) {
        Page<UserDTO> userPage = userService.getUsers(filter, page);

        PageableResultResponse<UserDTO> response = PageableResultResponse.fromPage(
                userPage,
                userPage.getContent(),
                userPage.getTotalElements() > 0
                        ? "Usuarios obtenidos exitosamente"
                        : "No se encontraron usuarios que coincidan con los filtros");

        return ResponseEntity.ok(response);

    }

    @GetMapping(path = "/{userEmail}", produces = "application/json")
    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    public  ResponseEntity<ResultResponse<UserDTO>> getUser(@PathVariable String userEmail){
        UserDTO user = userService.getUser(userEmail);
        return ResponseEntity.ok(ResultResponse.success(user, "Usuario encontrado."));
    }

    @PatchMapping(path = "/{userEmail}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    public  ResponseEntity<ResultResponse<Object>> modifyUser(
            @PathVariable String userEmail,
            @RequestPart(value = "userAvatar", required = false) MultipartFile userAvatar,
            @RequestPart(value = "modifyRequest", required = false) UserModifyRequestDTO modifyRequest){
        userService.modifyUser(userEmail, modifyRequest, userAvatar);
        return ResponseEntity.ok(ResultResponse.success(null, "Usuario modificado correctamente."));
    }
}
