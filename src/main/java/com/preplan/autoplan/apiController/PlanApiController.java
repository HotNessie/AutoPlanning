package com.preplan.autoplan.apiController;

import com.preplan.autoplan.Naver.NaverSearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
//@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanApiController {

    //    private final NaverSearchService naverSearchService;
    private final NaverSearchClient naverSearchClient;

    @GetMapping("/search/local")
    public ResponseEntity<Map> search(
            @RequestParam("query") String query,
            @RequestParam(value = "display", defaultValue = "10") Integer display,
            @RequestParam(value = "start", defaultValue = "1") Integer start,
            @RequestParam(value = "sort", defaultValue = "random") String sort
    ) {
        try {
            Map result = naverSearchClient.getBlogList(query, display, start, sort);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "검색 중 오류가 발생했습니다."));
        }
    }
}