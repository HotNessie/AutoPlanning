package com.preplan.autoplan.googleApi;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Slf4j
@Configuration
public class GoogleApiConfig {

    @Value("${google.api.client-key}")
    private String apiKey;

    @Bean
    public GoogleRouteClient googleRouteClient() {
        RestClient restClient = RestClient.builder()
            .baseUrl("https://routes.googleapis.com/")
            .defaultHeader("X-Goog-Api-Key", apiKey)
//            .defaultHeader("X-Google-Client-Secret", clientSecret)
            .build();

        RestClientAdapter adapter = RestClientAdapter.create(restClient);
        HttpServiceProxyFactory factory =
            HttpServiceProxyFactory.builderFor(adapter).build();
        return factory.createClient(GoogleRouteClient.class);
    }
}