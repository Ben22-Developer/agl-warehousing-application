package com.resource.server.service.security;

import lombok.*;
import org.springframework.security.crypto.password.*;
import org.springframework.stereotype.*;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final PasswordEncoder passwordEncoder;

    public boolean isPasswordValid (String rawPassword, String encodedPassword)
    {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
