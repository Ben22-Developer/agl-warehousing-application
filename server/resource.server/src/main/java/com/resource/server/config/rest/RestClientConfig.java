package com.resource.server.config.rest;

import org.springframework.context.annotation.*;
import org.springframework.web.client.*;

@Configuration
public class RestClientConfig
{
    @Bean
    public RestClient restClient ()
    {
        return RestClient
                .builder()
                .build();
    }
}
