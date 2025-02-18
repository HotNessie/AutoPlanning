package com.preplan.autoplan.googleApi;


import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;

public record ComputeRoutesRequest(
    @Valid @NotNull(message = "출발지 정보는 필수입니다")
    WrappedLocation origin,

    @Valid @NotNull(message = "도착지 정보는 필수입니다")
    WrappedLocation destination,

    @Valid @Size(max = 10, message = "경유지는 최대 10개까지 입력 가능합니다")
    List<WrappedLocation> intermediates,

    @Pattern(regexp = "DRIVE|WALK|TRANSIT", message = "이동 수단은 DRIVE, WALK, TRANSIT 중 선택해야 합니다")
    String travelMode,

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    @FutureOrPresent(message = "출발 시간은 현재 또는 미래 시간이어야 합니다")
    LocalDateTime departureTime,

    String routingPreference,
    @Pattern(regexp = "METRIC|IMPERIAL", message = "단위는 METRIC/IMPERIAL만 허용")
    String units
) {

    public record WrappedLocation(
        Location location
    ) {

        public record Location(
            Latlng latLng
        ) {

        }

        public record Latlng(
            @Min(value = -90, message = "위도는 -90에서 90 사이여야 합니다")
            @Max(value = 90, message = "위도는 -90에서 90 사이여야 합니다")
            double latitude,

            @Min(value = -180, message = "경도는 -180에서 180 사이여야 합니다")
            @Max(value = 180, message = "경도는 -180에서 180 사이여야 합니다")
            double longitude
        ) {

        }
    }
}