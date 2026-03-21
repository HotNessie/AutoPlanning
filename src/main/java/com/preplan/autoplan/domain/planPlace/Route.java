package com.preplan.autoplan.domain.planPlace;

import com.preplan.autoplan.domain.keyword.Transport;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Route {
  // Route는 Plan과 Place를 연결하는 엔티티
  // 여행 계획에서 특정 장소에 대한 정보를 담고 있음

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "plan_id")
  private Plan plan;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "place_id")
  private Place place;

  @Column(nullable = false)
  private int sequence;

  private Transport transportMode;

  @Column(nullable = false)
  private Long stayTime;

  private String memo;

  private Integer travelTime;

  private Integer travelDistance;

  @Lob
  private String polyline;

  private String transitDetailInfo;

  @Builder
  public Route(Plan plan, Place place, int sequence, Transport transportMode, Long stayTime,
      String memo, Integer travelTime, Integer travelDistance, String polyline, String transitDetailInfo) {
    this.plan = plan;
    this.place = place;
    this.sequence = sequence;
    this.transportMode = transportMode;
    this.stayTime = stayTime;
    this.memo = memo;
    this.travelTime = travelTime;
    this.travelDistance = travelDistance;
    this.polyline = polyline;
    this.transitDetailInfo = transitDetailInfo;
  }

  // Memo 수정 메서드
  public void setMemo(String memo) {
    this.memo = memo;
  }

  // 체류시간 수정 메서드
  public void setStayTime(Long stayTime) {
    this.stayTime = stayTime;
  }

  // polyline 수정 메서드
  public void setPolyline(String polyline) {
    this.polyline = polyline;
  }

  // set travelTime
  public void setTravelTime(Integer travelTime) {
    this.travelTime = travelTime;
  }

  // set travelDistance
  public void setTravelDistance(Integer travelDistance) {
    this.travelDistance = travelDistance;
  }

  // set TransitDetailInfo
  public void setTransitDetailInfo(String transitDetailInfo) {
    this.transitDetailInfo = transitDetailInfo;
  }

  public void setSequence(int i) {
    this.sequence = i;
  }

  // 교통수단은 변경 불가 - 생성 시에만 설정(일단 구글에서 지원하지도 않아서 수정 기능은 안넣음)

}
