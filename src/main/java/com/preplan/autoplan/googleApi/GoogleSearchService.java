package com.preplan.autoplan.googleApi;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleSearchService {

    private final GoogleSearchClient googleSearchClient;
//    private final GoogleApiConfig naverApiConfig;

//    public Map searchBlog(String query) {
//        return naverSearchClient.getBlogList(query);
//    }
}
