package com.resource.server.controller.jwt;

import com.resource.server.entity.security.Token;
import com.resource.server.service.jwt.JWTService;
import jakarta.servlet.http.*;
import lombok.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/all")
@RequiredArgsConstructor
public class JWTController {

    private final JWTService jwtService;

    @PostMapping("/token-exchange")
    public ResponseEntity<?> tokenExchange (@RequestBody Token token, HttpServletResponse httpServletResponse)
    {
        Map<String, String> result = jwtService.tokenExchange(httpServletResponse, token);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/access-token-refresh")
    public ResponseEntity<?> accessTokenRefresh (HttpServletRequest httpServletRequest)
    {
        Map<String, String> result = jwtService.accessTokenRefresh(httpServletRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
    {
        jwtService.logout(httpServletRequest, httpServletResponse);
        return ResponseEntity.ok().build();
    }
}
