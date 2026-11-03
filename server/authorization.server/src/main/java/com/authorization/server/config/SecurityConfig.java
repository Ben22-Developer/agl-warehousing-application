package com.authorization.server.config;

import com.authorization.server.service.*;
import com.nimbusds.jose.jwk.*;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.*;
import com.nimbusds.jose.proc.*;
import org.jspecify.annotations.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.annotation.*;
import org.springframework.core.annotation.*;
import org.springframework.http.*;
import org.springframework.security.config.*;
import org.springframework.security.config.annotation.web.builders.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.authorization.*;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.mapping.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.*;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.oidc.*;
import org.springframework.security.oauth2.core.oidc.endpoint.*;
import org.springframework.security.oauth2.core.oidc.user.*;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.authorization.*;
import org.springframework.security.oauth2.server.authorization.client.*;
import org.springframework.security.oauth2.server.authorization.settings.*;
import org.springframework.security.oauth2.server.authorization.token.*;
import org.springframework.security.provisioning.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.*;
import org.springframework.security.web.authentication.logout.*;
import org.springframework.security.web.header.writers.*;
import org.springframework.security.web.savedrequest.*;
import org.springframework.security.web.server.header.*;
import org.springframework.security.web.util.matcher.*;
import org.springframework.util.*;
import  org.springframework.security.web.header.writers.*;
import org.springframework.web.cors.*;

import java.security.*;
import java.security.interfaces.*;
import java.time.*;
import java.time.temporal.*;
import java.util.*;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.access-token-duration}")
    private long accessTokenDuration;

    @Value("${spring.security.refresh-token-duration}")
    private long refreshTokenDuration;

    @Value("${spring.security.cross-origin}")
    private String crossOrigin;

    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) {

        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = new OAuth2AuthorizationServerConfigurer();

        http
                .securityMatcher(authorizationServerConfigurer.getEndpointsMatcher())
                .with(authorizationServerConfigurer, (authorizationServer) ->
                        authorizationServer
                                .oidc(Customizer.withDefaults())	// Enable OpenID Connect 1.0
                )
                .authorizeHttpRequests((authorize) ->
                        authorize
                                .anyRequest().authenticated()
                )
                // Redirect to the login page when not authenticated from the
                // authorization endpoint
                .exceptionHandling((exceptions) -> exceptions
                        .defaultAuthenticationEntryPointFor(
                                new LoginUrlAuthenticationEntryPoint("/login"),
                                new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
                        )

                );

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http)
            throws Exception {

        HeaderWriterLogoutHandler clearSiteData = new HeaderWriterLogoutHandler(new ClearSiteDataHeaderWriter(ClearSiteDataHeaderWriter.Directive.ALL));

        http
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/css/**", "/api/v1/all/**").permitAll()
                        .anyRequest().authenticated()
                )
                // Form login handles the redirect to the login page from the
                // authorization server filter chain
                .formLogin(form -> {
                    form.loginPage("/login")
                            .loginProcessingUrl("/login")
                            .permitAll();

                })
                .logout(l -> l
                        .addLogoutHandler(clearSiteData)
                        .permitAll())
                .csrf(c -> c.disable())
                .cors(Customizer.withDefaults());;

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder (@Value("${spring.security.password-strength}") int codeFactor) {
        return new BCryptPasswordEncoder(codeFactor);
    }

    @Bean
    public RegisteredClientRepository registeredClientRepository (@Value("${spring.security.client.client-id}") String clientId,
                                                                  @Value("${spring.security.client.client-secret}") String clientSecret,
                                                                  @Value("${spring.security.client.redirect-uri}") String redirectUri ,
                                                                  @Value("${spring.security.client.post-logout-redirect-url}") String postLogoutRedirectUrl,
                                                                  PasswordEncoder passwordEncoder)
    {
        RegisteredClient oidcClient = RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId(clientId)
                .clientSecret(passwordEncoder.encode((clientSecret)))
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                .redirectUri(redirectUri)
                .postLogoutRedirectUri(postLogoutRedirectUrl)
                .scope(OidcScopes.OPENID)
                .scope(OidcScopes.PROFILE)
                .clientSettings(ClientSettings
                        .builder()
                        .requireProofKey(false)
                        .requireAuthorizationConsent(false)
                        .build())
                .tokenSettings(TokenSettings
                        .builder()
                        .accessTokenTimeToLive(Duration.of(accessTokenDuration, ChronoUnit.SECONDS))
                        .refreshTokenTimeToLive(Duration.of(refreshTokenDuration, ChronoUnit.SECONDS))
                        .build())
                .build();

        return new InMemoryRegisteredClientRepository(oidcClient);
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        KeyPair keyPair = generateRsaKey();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(UUID.randomUUID().toString())
                .build();
        JWKSet jwkSet = new JWKSet(rsaKey);
        return new ImmutableJWKSet<>(jwkSet);
    }

    private static KeyPair generateRsaKey() {
        KeyPair keyPair;
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
        }
        catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
        return keyPair;
    }

    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings
                .builder()
                .build();
    }

    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> oAuth2TokenCustomizer (OidcUserInfoService oidcUserInfoService)
    {
        return (context) ->
        {

            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                context.getClaims().claims((claims) ->
                {
                    OidcUserInfo userInfo = oidcUserInfoService.loadUser(
                            context.getPrincipal().getName());

                    claims.remove("sub");
                    claims.putAll(userInfo.getClaims());
                });
            }
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource ()
    {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(crossOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}