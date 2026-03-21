
package com.preplan.autoplan.service.bookmarkService;

import com.preplan.autoplan.domain.member.Bookmark;
import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.dto.bookmark.BookmarkResponseDto;
import com.preplan.autoplan.repository.BookmarkRepository;
import com.preplan.autoplan.repository.MemberRepository;
import com.preplan.autoplan.repository.PlanRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

  private final BookmarkRepository bookmarkRepository;
  private final PlanRepository planRepository;
  private final MemberRepository memberRepository;

  @Transactional(readOnly = true)
  public boolean isBookmarked(Long planId, String email) {
    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. email=" + email));
    Plan plan = planRepository.findById(planId)
        .orElseThrow(() -> new IllegalArgumentException("플랜이 존재하지 않습니다. id=" + planId));
    return bookmarkRepository.existsByPlanAndMember(plan, member);
  }

  @Transactional
  public boolean createBookmark(Long planId, String email) {

    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. email=" + email));
    Plan plan = planRepository.findById(planId)
        .orElseThrow(() -> new IllegalArgumentException("플랜이 존재하지 않습니다. id=" + planId));

    Optional<Bookmark> existingBookmark = bookmarkRepository.findByPlanAndMember(plan, member);

    if (existingBookmark.isPresent()) {
      // 북마크가 이미 존재하면 -> false 반환
      return false;
    } else {
      // 북마크가 없으면 -> 생성 및 카운트 증가
      plan.increaseBookmarkCount();
      Bookmark newBookmark = Bookmark.builder()
          .plan(plan)
          .member(member)
          .build();
      bookmarkRepository.save(newBookmark);
      return true;
    }
  }

  @Transactional
  public void deleteBookmark(Long planId, String email) {
    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. email=" + email));
    Plan plan = planRepository.findById(planId)
        .orElseThrow(() -> new IllegalArgumentException("플랜이 존재하지 않습니다. id=" + planId));

    Bookmark bookmark = bookmarkRepository.findByPlanAndMember(plan, member)
        .orElseThrow(() -> new IllegalArgumentException("북마크가 존재하지 않습니다. planId=" + planId + ", email=" + email));

    // 북마크 삭제 및 카운트 감소
    plan.decreaseBookmarkCount();
    bookmarkRepository.delete(bookmark);
  }

  @Transactional(readOnly = true)
  public List<BookmarkResponseDto> getMyBookmarks(String email) {

    Member member = memberRepository.findByEmail(email)
        .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. email=" + email));

    return bookmarkRepository.findByMember(member).stream()
        .map(BookmarkResponseDto::from)
        .collect(Collectors.toList());
  }
}
