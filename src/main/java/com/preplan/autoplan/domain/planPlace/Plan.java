package com.preplan.autoplan.domain.planPlace;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.Keyword;
import com.preplan.autoplan.domain.keyword.PlanKeyword;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.domain.member.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Plan {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // TODO: 계획 제목이 있으면 좋을 것 같음.
  private String title;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "member_id")
  private Member member;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "region_id", nullable = false)
  private Region region;

  @Column(nullable = false)
  private LocalDateTime startTime;

  @Column(nullable = false)
  private LocalDateTime endTime;

  @ElementCollection
  @CollectionTable(name = "plan_purpose_keywords", joinColumns = @JoinColumn(name = "plan_id"))
  @Enumerated(EnumType.STRING)
  @Column(name = "purpose_keyword")
  private List<PurposeField> purposeKeywords = new ArrayList<>();

  @ElementCollection
  @CollectionTable(name = "plan_mood_keywords", joinColumns = @JoinColumn(name = "plan_id"))
  @Enumerated(EnumType.STRING)
  @Column(name = "mood_keyword")
  private List<MoodField> moodKeywords = new ArrayList<>();

  @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<PlanKeyword> planKeywords = new ArrayList<>();

  @Column(nullable = false)
  private int likes = 0;

  @Column(nullable = false)
  private int bookmarks = 0;

  @Column(nullable = false)
  private boolean isShared = true; // 만들어는 두지만 공개 상태는 디폴드로 두겠음

  @CreatedDate
  private LocalDateTime createdDate;

  @LastModifiedDate
  private LocalDateTime lastModifiedDate;

  @Builder
  public Plan(Member member, String title, Region region, LocalDateTime startTime, LocalDateTime endTime,
      List<PurposeField> purposeKeywords, List<MoodField> moodKeywords) {
    this.member = member;
    this.title = title;
    this.region = region;
    this.startTime = startTime;
    this.endTime = endTime;
    this.purposeKeywords = purposeKeywords != null ? purposeKeywords : new ArrayList<>();
    this.moodKeywords = moodKeywords != null ? moodKeywords : new ArrayList<>();
  }

  // 좋아요 증가
  public void increaseLikes() {
    this.likes++;
  }

  // 북마크 증가
  public void increaseBookmarks() {
    this.bookmarks++;
  }

  // 비공유 할거임
  public void setShared(boolean shared) {
    this.isShared = shared;
  }

  // 대표지역 설정
  public void updateRegion(Region region) {
    this.region = region;
  }

  // 계획 키워드 추가
  public void addKeyword(Keyword keyword) {
    PlanKeyword planKeyword = new PlanKeyword(this, keyword);
    this.planKeywords.add(planKeyword);
  }

  // 계획 키워드 제거
  public void removeKeyword(Keyword keyword) {
    this.planKeywords.removeIf(pk -> pk.getKeyword().equals(keyword));
  }
}