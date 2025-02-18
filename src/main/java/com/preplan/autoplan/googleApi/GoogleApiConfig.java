package com.preplan.autoplan.googleApi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class GoogleApiConfig {

    @Value("${google.api.client-key}")
    private String apiKey;

    @Value("${google.route.field-mask}")
    private String routeFieldMask;

    @Bean
    public GoogleRouteClient googleRouteClient() {
        RestClient restClient = RestClient.builder()
            .baseUrl("https://routes.googleapis.com/")
            .defaultHeader("X-Goog-Api-Key", apiKey)
            .build();

        HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(
            RestClientAdapter.create(restClient)
        ).build();

        return factory.createClient(GoogleRouteClient.class);
    }
}
