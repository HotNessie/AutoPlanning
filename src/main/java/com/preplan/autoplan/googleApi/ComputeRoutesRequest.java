package com.preplan.autoplan.googleApi;

import com.preplan.autoplan.domain.keyword.Transport;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

//google api와의 통신용
//placeId저장, Place searchCount 증가, 체류시간 저장
public record ComputeRoutesRequest(
    @Valid @NotNull(message = "장소 정보는 필수입니다") @Size(min = 2, max = 7, message = "장소는 최소 2개, 최대 7개까지 입력 가능합니다") List<PlaceInfo> placeNames,
    @FutureOrPresent(message = "출발 시간은 현재 또는 미래 시간이어야 합니다") LocalDateTime departureTime,
    String routingPreference,
    @Pattern(regexp = "METRIC|IMPERIAL", message = "단위는 METRIC 또는 IMPERIAL이어야 합니다") String units) {

  public record PlaceInfo(
      @NotNull(message = "장소 이름은 필수입니다") String name,
      @NotNull(message = "장소 ID는 필수입니다") String placeId,
      Transport transport,
      @Min(value = 0, message = "체류 시간은 0 이상이어야 합니다") Integer time,
      Location location) {

    public record Location(
        Latlng latLng) {

      public record Latlng(
          @Min(value = -90, message = "위도는 -90에서 90 사이여야 합니다") @Max(value = 90, message = "위도는 -90에서 90 사이여야 합니다") double latitude,
          @Min(value = -180, message = "경도는 -180에서 180 사이여야 합니다") @Max(value = 180, message = "경도는 -180에서 180 사이여야 합니다") double longitude) {

      }
    }
  }
}