package com.preplan.autoplan.Naver;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.Map;

@Component
@HttpExchange
//@HttpExchange(url = "https://openapi.naver.com/v1/search")
public interface NaverSearchClient {

    @GetExchange("/blog")
    Map getBlogList(
            @RequestParam("query") String query);
//    get요청임
//    @RequestParam("query") String query,
//    @RequestParam(value = "display", defaultValue = "10") Integer display,
//    @RequestParam(value = "start", defaultValue = "1") Integer start,
//    @RequestParam(value = "sort", defaultValue = "random") String sort
//    );
}