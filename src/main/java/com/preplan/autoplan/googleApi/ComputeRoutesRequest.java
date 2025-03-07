package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.ZonedDateTime;

public record ComputeRoutesRequest(
        @Valid @NotNull(message = "출발지 정보는 필수입니다") WrappedLocation origin,

        @Valid @NotNull(message = "도착지 정보는 필수입니다") WrappedLocation destination,

        // @Valid @Size(max = 10, message = "경유지는 최대 10개까지 입력 가능합니다")
        // List<WrappedLocation> intermediates,
        // 구글 routes travelMode:DRIVE를 한국에서 사용하지 못하기 때문에 경유지 사용 못함...

        @NotNull Transport travelMode,

        @FutureOrPresent(message = "출발 시간은 현재 또는 미래 시간이어야 합니다") ZonedDateTime departureTime,

        String routingPreference,
        @Pattern(regexp = "METRIC|IMPERIAL") String units) {

    public record WrappedLocation(
            String placeId,
            Location location) {

        public record Location(
                Latlng latLng) {

        }

        public record Latlng(
                @Min(value = -90, message = "위도는 -90에서 90 사이여야 합니다") @Max(value = 90, message = "위도는 -90에서 90 사이여야 합니다") double latitude,

                @Min(value = -180, message = "경도는 -180에서 180 사이여야 합니다") @Max(value = 180, message = "경도는 -180에서 180 사이여야 합니다") double longitude) {

        }
    }
}