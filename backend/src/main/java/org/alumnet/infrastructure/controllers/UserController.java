package org.alumnet.infrastructure.controllers;

import jakarta.validation.Valid;
import org.alumnet.application.dtos.ResultResponse;
import org.alumnet.application.dtos.UserDTO;
import org.alumnet.application.services.UserService;
import org.alumnet.infrastructure.exceptions.ExistingUserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping(path = "/create-user", produces = "application/json")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<ResultResponse> createUser(@Valid @RequestBody UserDTO userDTO) {
        ResultResponse response;
        try {
            response = userService.createUser(userDTO);
            return ResponseEntity.ok(response);
        } catch (ExistingUserException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ResultResponse.builder().message(e.getMessage()).build());
        }
    }

}
