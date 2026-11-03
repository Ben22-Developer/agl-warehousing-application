package com.resource.server.service.client;

import com.resource.server.entity.product.productInStock.*;
import com.resource.server.exception.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.util.*;
import org.springframework.web.client.*;

import java.net.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CloudinaryClientService
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

    public void uploadProductInStockImage (HashMap<String,  List<ProductInStockImage>> productInStockImageMap
            ,HashMap<String,  String> publicIdToBase64StringMap)
    {
        try
        {
            productInStockImageMap.forEach((key, value) ->
            {
                for (ProductInStockImage e : value)
                {
                    HashMap<String, String> response = uploadImage(e.getCloudinaryPublicId(), publicIdToBase64StringMap.get(e.getCloudinaryPublicId()));

                    e.setCloudinaryAssetId(response.get("asset_id"));
                    e.setCloudinaryUrl(response.get("secure_url"));
                }
            });
        }
        catch (Exception e)
        {
            throw new NetworkFailureException("An exception occurred while uploading the stock product image");
        }
    }

    private HashMap<String, String> uploadImage(String publicId, String base64String)
    {
        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();

        multiValueMap.add("public_id", publicId);
        multiValueMap.add("file", base64String);
        multiValueMap.add("asset_folder", assetFolder);

        String credentials = cloudinaryKey +":"+ cloudinarySecret;


        return restClient
                .post()
                .uri(URI.create(cloudinaryPostUri))
                .header("Authorization", "Basic "+Base64.getEncoder().encodeToString(credentials.getBytes()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) // application/x-www-form-urlencoded
                .accept(MediaType.valueOf(MediaType.ALL_VALUE))
                .body(multiValueMap)
                .retrieve()
                .toEntity(HashMap.class)
                .getBody();
    }

    public void deleteProductInStockImageByAssetIdToPublicIdMap(HashMap<String, String> assetIdToPublicIdMap)
    {
        try
        {
            assetIdToPublicIdMap.forEach((key, value) ->
            {
                deleteImage(key, value);
            });
        }
        catch (Exception e)
        {
            throw new NetworkFailureException("An exception occurred while deleting the stock product image");
        }
    }

    private void deleteImage(String key, String value)
    {
        String credentials = cloudinaryKey +":"+ cloudinarySecret;

        MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();

        multiValueMap.add("asset_id", key);
        multiValueMap.add("public_id", value);

        restClient
                .post()
                .uri(URI.create(cloudinaryDeleteUri))
                .header("Authorization", "Basic "+Base64.getEncoder().encodeToString(credentials.getBytes()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED) // application/x-www-form-urlencoded
                .accept(MediaType.valueOf(MediaType.ALL_VALUE))
                .body(multiValueMap)
                .retrieve()
                .toEntity(HashMap.class)
                .getBody();
    }
}
