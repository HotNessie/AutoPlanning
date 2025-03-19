package com.preplan.autoplan.apiController.bookmark;

import com.preplan.autoplan.domain.member.Bookmark;
import com.preplan.autoplan.domain.planPlace.Plan;
import com.preplan.autoplan.dto.bookmark.BookmarkCreateRequestDto;
import com.preplan.autoplan.dto.bookmark.BookmarkResponseDto;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class BookmarkController {

    //bookmarkService 작성

    //계획을 사용자가 북마크 했는지 확인
//    @GetMapping("/plans/{planId}/bookmarks")
//    public ResponseEntity<List<BookmarkResponseDto>> getBookmarksByPlan(@PathVariable Long planId) {
//        List<Bookmark> bookmarks = bookmarkService.findByPlanId(planId);
//        List<BookmarkResponseDto> dtos = bookmarks.stream()
//            .map(bookmark -> new BookmarkResponseDto(
//                bookmark.getId(),
//                bookmark.getMember().getId(),
//                bookmark.getPlan().getId(),
//                bookmark.getCreatedAt()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

//사용자가 북마크한 계획목록 반환
//    @GetMapping("/members/{memberId}/bookmarks")
//    public ResponseEntity<List<BookmarkResponseDto>> getBookmarksByMember(
//        @PathVariable Long memberId) {
//        List<Bookmark> bookmarks = bookmarkService.findByMemberId(memberId);
//        List<BookmarkResponseDto> dtos = bookmarks.stream()
//            .map(bookmark -> new BookmarkResponseDto(
//                bookmark.getId(),
//                bookmark.getMember().getId(),
//                bookmark.getPlan().getId(),
//                bookmark.getCreatedAt()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

    //북마크 추가
//    @PostMapping("/plans/{planId}/bookmarks")
//    public ResponseEntity<BookmarkResponseDto> createBookmark(
//        @PathVariable Long planId,
//        @RequestBody BookmarkCreateRequestDto dto,
//        @AuthenticationPrincipal Member currentMember // 인증된 사용자 정보
//    ) {
//        Plan plan = planService.findById(dto.planId());
//        Bookmark bookmark = Bookmark.builder()
//            .member(currentMember)
//            .plan(plan)
//            .build();
//        Bookmark savedBookmark = bookmarkService.save(bookmark);
//        plan.increaseBookmarks(); // 계획의 북마크 수 증가
//        BookmarkResponseDto response = new BookmarkResponseDto(
//            savedBookmark.getId(),
//            savedBookmark.getMember().getId(),
//            savedBookmark.getPlan().getId(),
//            savedBookmark.getCreatedAt()
//        );
//        return ResponseEntity.ok(response);
//    }
}
