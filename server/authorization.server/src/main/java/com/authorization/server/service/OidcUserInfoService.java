package com.authorization.server.service;

import com.authorization.server.repository.*;
import lombok.*;
import org.springframework.security.oauth2.core.oidc.*;
import org.springframework.stereotype.*;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OidcUserInfoService
{

    private final UserDetailsRepository userDetailsRepository;

    public OidcUserInfo loadUser(String username) {
        return new OidcUserInfo(userDetailsRepository.getUserInfo(username));
    }
}
