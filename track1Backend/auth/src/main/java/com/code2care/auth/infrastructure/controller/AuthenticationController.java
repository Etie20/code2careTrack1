package com.code2care.auth.infrastructure.controller;

import com.code2care.auth.application.dto.AuthenticationRequest;
import com.code2care.auth.application.dto.RegisterRequest;
import com.code2care.auth.application.service.AuthenticateUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticateUseCase authenticationUseCase;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(authenticationUseCase.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(authenticationUseCase.authenticate(request));
    }
}
