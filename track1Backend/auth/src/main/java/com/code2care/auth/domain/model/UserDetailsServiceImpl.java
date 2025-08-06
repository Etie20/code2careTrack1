package com.code2care.auth.domain.model;

import com.code2care.auth.infrastructure.repository.JpaDoctorRepository;
import com.code2care.common.domain.model.DoctorDto;
import com.code2care.common.domain.model.Email;
import com.code2care.common.infrastructure.config.Mapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final JpaDoctorRepository repository;
    @Override
    public UserDetails loadUserByUsername(String fullName) throws UsernameNotFoundException {
        DoctorDto doctor = Mapper.mapDoctorDto(repository.findByFullName(fullName).orElseThrow(() -> new IllegalArgumentException("User not found")));
        return org.springframework.security.core.userdetails.User.builder().username(doctor.getEmail().value()).password(doctor.getPassword()).build();
    }
}
