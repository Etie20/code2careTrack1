package com.code2care.auth.application.service;

import com.code2care.auth.application.dto.AuthenticationRequest;
import com.code2care.auth.application.dto.RegisterRequest;
import com.code2care.auth.domain.model.DoctorUserDetails;
import com.code2care.auth.domain.service.AuthenticationDomainservice;
import com.code2care.common.domain.model.DoctorDto;
import com.code2care.common.domain.model.Email;
import com.code2care.common.infrastructure.entites.Doctor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthenticateUseCase {
    private final AuthenticationDomainservice authenticationDomainservice;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public String authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = authenticationDomainservice.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(new DoctorUserDetails(user));
        return jwtToken;
    }

    public String register(RegisterRequest request) {
        var user = DoctorDto.builder()
                .fullName(request.getFullName())
                .email(new Email(request.getEmail()))
                .password(passwordEncoder.encode(request.getPassword()))
                .specialty(request.getSpecialty())
                .phoneNumber(request.getPhoneNumber())
                .createdAt(Instant.now())
                .build();
        authenticationDomainservice.save(user);
        var jwtToken = jwtService.generateToken(new DoctorUserDetails(user));
        return jwtToken;
    }
}
