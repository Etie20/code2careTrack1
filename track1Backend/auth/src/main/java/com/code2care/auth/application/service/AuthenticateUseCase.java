package com.code2care.auth.application.service;

import com.code2care.auth.application.dto.AuthenticationRequest;
import com.code2care.auth.application.dto.AuthenticationResponse;
import com.code2care.auth.application.dto.RegisterRequest;
import com.code2care.auth.domain.service.AuthenticationDomainservice;
import com.code2care.common.domain.model.DoctorDto;
import com.code2care.common.domain.model.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthenticateUseCase {
    private final AuthenticationDomainservice authenticationDomainservice;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = authenticationDomainservice.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!passwordMatches) {
            throw new IllegalArgumentException("Incorrect password");
        }
        return AuthenticationResponse.builder().token(jwtService.generateToken(user.getFullName())).build();
    }

    public AuthenticationResponse register(RegisterRequest request) {
        var user = DoctorDto.builder()
                .fullName(request.getFullName())
                .email(new Email(request.getEmail()))
                .password(passwordEncoder.encode(request.getPassword()))
                .specialty(request.getSpecialty())
                .phoneNumber(request.getPhoneNumber())
                .createdAt(Instant.now())
                .build();
        authenticationDomainservice.save(user);
        return AuthenticationResponse.builder().token(jwtService.generateToken(user.getFullName())).build();
    }
}
