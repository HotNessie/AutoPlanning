package com.preplan.autoplan.Naver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class NaverApiConfig {

    @Value("${naver.api.client-id}")
    private String clientId;
    @Value("${naver.api.client-secret}")
    private String clientSecret;

    @Bean
    public NaverSearchClient naverSearchClient() {
        RestClient restClient = RestClient.builder()
                .baseUrl("https://openapi.naver.com/v1/search")
                .defaultHeader("X-Naver-Client-Id", clientId)
                .defaultHeader("X-Naver-Client-Secret", clientSecret)
                .build();
        RestClientAdapter adapter = RestClientAdapter.create(restClient);

        HttpServiceProxyFactory factory =
                HttpServiceProxyFactory.builderFor(adapter).build();
        return factory.createClient(NaverSearchClient.class);
    }
}
