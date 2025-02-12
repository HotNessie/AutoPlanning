package com.preplan.autoplan.apiController;

import com.preplan.autoplan.googleApi.GoogleRouteClient;
import com.preplan.autoplan.googleApi.PlaceDetails;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
//@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanApiController {

    //    private final GoogleSearchService naverSearchService;
    private final GoogleRouteClient googleRouteClient;

    @GetMapping("/search/local")
    public ResponseEntity search(
        @RequestBody String origin,
        @RequestBody String destination,
        @RequestBody String travelMode,
        @RequestBody String language
    ) {
        try {
            PlaceDetails result = googleRouteClient.getRoute(origin, destination, travelMode,
                language);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "검색 중 오류가 발생했습니다."));
        }

    }
}