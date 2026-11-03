package com.resource.server.service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Map;

public class SecurityContextUtils 
{
    private static Jwt getJwt() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            return (Jwt) authentication.getPrincipal();
        }
        return null;
    }

    private static Map<String, Object> getClaims() {
        Jwt jwt = getJwt();
        return jwt != null ? jwt.getClaims() : null;
    }

    public static String getUsername() {
        Map<String, Object> claims = getClaims();
        return claims != null ? (String) claims.get("username") : null;
    }

    public static String getRole() {
        Map<String, Object> claims = getClaims();
        return claims != null ? (String) claims.get("scope") : null;
    }

    public static String getProfilePicture() {
        Map<String, Object> claims = getClaims();
        return claims != null ? (String) claims.get("profilePicture") : null;
    }

    public static String getName() {
        Map<String, Object> claims = getClaims();
        return claims != null ? (String) claims.get("name") : null;
    }

    public static String getAudience() {
        Map<String, Object> claims = getClaims();
        return claims != null ? (String) claims.get("aud") : null;
    }

    public static String getIssuer() {
        Map<String, Object> claims = getClaims();
        return claims != null ? (String) claims.get("iss") : null;
    }

    public static String getJwtId() {
        Map<String, Object> claims = getClaims();
        return claims != null ? (String) claims.get("jti") : null;
    }

    public static Long getNotBefore() {
        Map<String, Object> claims = getClaims();
        return claims != null ? ((Number) claims.get("nbf")).longValue() : null;
    }

    public static Long getExpiration() {
        Map<String, Object> claims = getClaims();
        return claims != null ? ((Number) claims.get("exp")).longValue() : null;
    }

    public static Long getIssuedAt() {
        Map<String, Object> claims = getClaims();
        return claims != null ? ((Number) claims.get("iat")).longValue() : null;
    }
}
