package com.preplan.autoplan.apiController;

import com.preplan.autoplan.googleApi.ComputeRoutesRequest;
import com.preplan.autoplan.googleApi.ComputeRoutesRequest.Location;
import com.preplan.autoplan.googleApi.ComputeRoutesResponse;
import com.preplan.autoplan.googleApi.GoogleRouteClient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

    @PostMapping("/routes/compute")
    public ResponseEntity<?> computeRoute(
        @Valid @RequestBody ComputeRoutesRequest request
    ) {
        String fieldMask = "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline";
        ComputeRoutesResponse response =
            googleRouteClient.getRoute(fieldMask, request);
        return ResponseEntity.ok(response);
    }
}