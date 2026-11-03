package com.resource.server.service.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class CookieUtility {

    public Cookie getCookie(HttpServletRequest httpServletRequest, String cookieName) {
        if (httpServletRequest.getCookies() == null) {
            throw new SessionAuthenticationException("Invalid session");
        }

        for (Cookie cookie : httpServletRequest.getCookies()) {
            if (cookie.getName().equals(cookieName)) {
                return cookie;
            }
        }

        throw new SessionAuthenticationException("Session Expired");
    }
}
