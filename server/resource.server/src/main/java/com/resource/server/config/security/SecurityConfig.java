package com.resource.server.config.security;

import com.resource.server.entity.grantedAuthorities.Role;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.config.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.security.oauth2.core.authorization.*;
import org.springframework.security.web.*;
import org.springframework.web.cors.*;

import java.util.*;

@Configuration
public class SecurityConfig
{
    @Value("${spring.security.cross-origin}")
    private String crossOrigin;

    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity httpSecurity) {

        return  httpSecurity
                .authorizeHttpRequests(auth -> auth

                        // global endpoint tests
                        .requestMatchers("/api/v1/secure/admin/**").access(OAuth2AuthorizationManagers.hasScope(Role.AdminRole))
                        .requestMatchers("/api/v1/secure/agent/**").access(OAuth2AuthorizationManagers.hasScope(Role.AgentRole))
                        .requestMatchers("/api/v1/secure/client/**").access(OAuth2AuthorizationManagers.hasScope(Role.UserRole))
                        .requestMatchers("/api/v1/secure/admin_agent/**").access(OAuth2AuthorizationManagers.hasAnyScope(Role.AdminRole, Role.AgentRole))
                        .requestMatchers("/api/v1/secure/**").authenticated()

                        .requestMatchers("/api/v1/all/**").permitAll()

                        .anyRequest().permitAll()
                )
                .oauth2ResourceServer((oauth2) -> oauth2.jwt(Customizer.withDefaults()))
                .anonymous(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource () {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(crossOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder (@Value("${spring.security.password-strength}") int codeFactor) {
        return new BCryptPasswordEncoder(codeFactor);
    }
}
