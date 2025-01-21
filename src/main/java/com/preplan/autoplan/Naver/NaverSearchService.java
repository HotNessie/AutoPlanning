package com.preplan.autoplan.Naver;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NaverSearchService {

    private final NaverSearchClient naverSearchClient;
//    private final NaverApiConfig naverApiConfig;

    public Map searchBlog(String query) {
        return naverSearchClient.getBlogList(query);
    }
}
