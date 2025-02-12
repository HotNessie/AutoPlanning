package com.preplan.autoplan.apiController;

import com.preplan.autoplan.googleApi.ComputeRoutesRequest;
import com.preplan.autoplan.googleApi.ComputeRoutesResponse;
import com.preplan.autoplan.googleApi.GoogleRouteClient;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class PlanApiController {

    //    private final GoogleSearchService naverSearchService;
    private final GoogleRouteClient googleRouteClient;

    @GetMapping("/routes/compute")
    public ResponseEntity<?> computeRoute(
        @RequestParam double originLat,
        @RequestParam double originLng,
        @RequestParam double destLat,
        @RequestParam double destLng,
        @RequestParam String travelMode,
        @RequestParam String language
    ) {
        try {
            String fieldMask = "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline";
            var request = new ComputeRoutesRequest(
                createLocation(originLat, originLng),
                createLocation(destLat, destLng),
                travelMode,
                language
            );
            ComputeRoutesResponse response =
                googleRouteClient.getRoute(fieldMask, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "검색 중 오류가 발생했습니다."));
        }
    }

    private ComputeRoutesRequest.Location createLocation(double lat, double lng) {
        return new ComputeRoutesRequest.Location(
            null,  // 주소 대신 좌표 사용
            new ComputeRoutesRequest.LatLng(lat, lng)
        );
    }
}