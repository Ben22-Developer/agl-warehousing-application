package com.resource.server.controller.test;

import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.*;

import java.io.*;
import java.net.*;
import java.util.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TestController
{
    private final RestClient restClient;

    @Value("${cloudinary.api.key}")
    private String cloudinaryKey;

    @Value("${cloudinary.api.secret}")
    private String cloudinarySecret;

    @Value("${cloudinary.uri.post}")
    private String cloudinaryPostUri;

    @Value("${cloudinary.uri.delete}")
    private String cloudinaryDeleteUri;

    @Value("${cloudinary.asset-folder}")
    private String assetFolder;


    @PostMapping("/secure/test")
    public String securePostTest () {
        return "Authenticated secured post test";
    }

    @PostMapping("/secure/admin_agent/test")
    public String adminOrAgentPostTest () {
        return "Admin or agent secured post test";
    }

    @PostMapping("/secure/admin/test")
    public String secureAdminPostTest () {
        return "Admin secured post test";
    }

    @PostMapping("/secure/agent/test")
    public String secureAgentPostTest () {
        return "Agent secured post test";
    }

    @PostMapping("/secure/client/test")
    public String secureClientPostTest () {
        return "Client secured post test";
    }

    @GetMapping("/all/client/test")
    public String secureClientGetTest () {
        return "Client secured get test";
    }

    @PostMapping("/all/cloudinary/test")
    public ResponseEntity<?> secureCloudinaryPostTest (@RequestBody ImageBase64 imageBase64) throws UnsupportedEncodingException
    {
        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();

        multiValueMap.add("file", imageBase64.getImageBase64String());
        multiValueMap.add("public_id", "Spring test");
        multiValueMap.add("asset_folder", assetFolder);
//        multiValueMap.add("upload_preset","ml_default");

        String credentials = cloudinaryKey +":"+ cloudinarySecret;


        HashMap<String, String> response = restClient
                .post()
                .uri(URI.create(cloudinaryPostUri))
                .header("Authorization", "Basic "+Base64.getEncoder().encodeToString(credentials.getBytes()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) // application/x-www-form-urlencoded
                .accept(MediaType.valueOf(MediaType.ALL_VALUE))
                .body(multiValueMap)
                .retrieve()
                .toEntity(HashMap.class)
                .getBody();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/all/cloudinary/test/{assetId}")
    public ResponseEntity<?> secureCloudinaryDeleteTest (@PathVariable String assetId)
    {
        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();

        multiValueMap.add("asset_id", assetId);
        multiValueMap.add("public_id", "Spring test");

        String credentials = cloudinaryKey +":"+ cloudinarySecret;


        HashMap<String, String> response = restClient
                .post()
                .uri(URI.create(cloudinaryDeleteUri))
                .header("Authorization", "Basic "+Base64.getEncoder().encodeToString(credentials.getBytes()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) // application/x-www-form-urlencoded
                .accept(MediaType.valueOf(MediaType.ALL_VALUE))
                .body(multiValueMap)
                .retrieve()
                .toEntity(HashMap.class)
                .getBody();

        return ResponseEntity.ok(response);
    }
}
