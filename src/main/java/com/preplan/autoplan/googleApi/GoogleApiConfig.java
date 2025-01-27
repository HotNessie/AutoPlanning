package com.preplan.autoplan.googleApi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class GoogleApiConfig {

    @Value("${google.api.client-id}")
    private String clientId;
    @Value("${google.api.client-secret}")
    private String clientSecret;

    @Bean
    public GoogleSearchClient googleSearchClient() {
        RestClient restClient = RestClient.builder()
//            .baseUrl("https://openapi.google.com/v1/search")
//            .defaultHeader("X-Google-Client-Id", clientId)
//            .defaultHeader("X-Google-Client-Secret", clientSecret)
            .build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);

        HttpServiceProxyFactory factory =
            HttpServiceProxyFactory.builderFor(adapter).build();
        return factory.createClient(GoogleSearchClient.class);
    }
}
