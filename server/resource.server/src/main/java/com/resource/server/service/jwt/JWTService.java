package com.resource.server.service.jwt;

import com.resource.server.entity.security.*;
import com.resource.server.service.util.CookieUtility;
import jakarta.servlet.http.*;
import lombok.*;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.beans.factory.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.web.authentication.session.*;
import org.springframework.stereotype.*;
import org.springframework.util.*;
import org.springframework.web.client.*;

import javax.naming.*;
import javax.security.auth.login.*;
import java.net.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JWTService {

    @Value("${spring.security.oauth2.resourceserver.jwt.audiences}")
    private String clientId;

    @Value("${spring.security.oauth2.resourceserver.jwt.secret}")
    private String clientSecret;

    @Value("${spring.security.redirect-uri}")
    private String redirectUri;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String jwtIssuerUri;

    @Value("${spring.security.oauth2.endpoints.token}")
    private String tokenEndpoint;

    @Value("${spring.security.oauth2.endpoints.logout}")
    private String logoutEndpoint;

    @Value("${spring.security.refresh-token-duration}")
    private int refreshTokenDuration;

    private final String refreshTokenKey = "refresh_token";

    private final String accessTokenKey = "access_token";

    private final RestClient restClient;

    private final CookieUtility cookieUtility;

    public Map<String, String> tokenExchange (HttpServletResponse httpServletResponse, Token token)
    {
        MultiValueMap<String, String> multiValueMap = getTokenExchangeMap(token);

        HashMap<String, String> entity = tokenExchangeCall(multiValueMap);

        setRefreshTokenCookie(httpServletResponse,entity.get(refreshTokenKey));

        return Map.of(accessTokenKey, entity.get(accessTokenKey));
    }

    private MultiValueMap<String, String> getTokenExchangeMap (Token token)
    {
        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();

        multiValueMap.add("client_id", clientId);
        multiValueMap.add("redirect_uri", redirectUri);
        multiValueMap.add("grant_type", "authorization_code");
        multiValueMap.add("code", token.getToken());

        return multiValueMap;
    }

    private void setRefreshTokenCookie (HttpServletResponse httpServletResponse, String refreshToken)
    {
        Cookie cookie = new Cookie(refreshTokenKey, refreshToken);
        cookie.setMaxAge(refreshTokenDuration);
        cookie.setHttpOnly(true);
        httpServletResponse.addCookie(cookie);
    }

    public Map<String, String>  accessTokenRefresh (HttpServletRequest httpServletRequest)
    {

        Cookie cookie = cookieUtility.getCookie(httpServletRequest, refreshTokenKey);

        MultiValueMap<String, String> multiValueMap = getAccessTokenRefreshMap(cookie.getValue());

        HashMap<String, String> entity = tokenExchangeCall(multiValueMap);

        return Map.of(accessTokenKey, entity.get(accessTokenKey));
    }


    private MultiValueMap<String, String> getAccessTokenRefreshMap (String refreshToken)
    {
        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();

        multiValueMap.add("grant_type", "refresh_token");
        multiValueMap.add("refresh_token", refreshToken);

        return multiValueMap;
    }

    private HashMap<String, String> tokenExchangeCall (MultiValueMap<String, String> multiValueMap)
    {
        String credential = clientId + ":" + clientSecret;

        return restClient
                .post()
                .uri(URI.create(jwtIssuerUri + tokenEndpoint))
                .header("Authorization", "Basic "+Base64.getEncoder().encodeToString(credential.getBytes()))
                .contentType(MediaType.valueOf(MediaType.APPLICATION_FORM_URLENCODED_VALUE))
                .accept(MediaType.valueOf(MediaType.ALL_VALUE))
                .body(multiValueMap)
                .retrieve()
                .toEntity(HashMap.class)
                .getBody();
    }

    public void logout (HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
    {
        Cookie refreshToken = cookieUtility.getCookie(httpServletRequest, refreshTokenKey);
        Cookie jSessionId = cookieUtility.getCookie(httpServletRequest, "JSESSIONID");

        jSessionId.setMaxAge(-10);

        refreshToken.setMaxAge(0);
        refreshToken.setHttpOnly(true);
        refreshToken.setAttribute("Path","/api/v1/all");

        httpServletResponse.addCookie(refreshToken);
        httpServletResponse.addCookie(jSessionId);

        restClient
                .post()
                .uri(URI.create(jwtIssuerUri + logoutEndpoint))
                .accept(MediaType.valueOf(MediaType.ALL_VALUE))
                .retrieve();
    }

}
