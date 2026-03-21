package com.preplan.autoplan.restController.bookmarkController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.preplan.autoplan.dto.bookmark.BookmarkResponseDto;
import com.preplan.autoplan.service.bookmarkService.BookmarkService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class bookmarkApiController {

  private final BookmarkService bookmarkService;

  @GetMapping("/api/private/bookmarks/{planId}")
  public ResponseEntity<Boolean> isBookmarked(
      @PathVariable Long planId, Authentication authentication) {
    String userEmail = authentication.getName();
    boolean bookmarked = bookmarkService.isBookmarked(planId, userEmail);
    return ResponseEntity.ok(bookmarked);
  }

  @PostMapping("/api/private/bookmarks/{planId}")
  public ResponseEntity<Boolean> createBookmark(
      @PathVariable Long planId, Authentication authentication) {
    String userEmail = authentication.getName();
    boolean result = bookmarkService.createBookmark(planId, userEmail);
    return ResponseEntity.ok(result);
  }

  @DeleteMapping("/api/private/bookmarks/{planId}")
  public ResponseEntity<Void> deleteBookmark(
      @PathVariable Long planId, Authentication authentication) {
    String userEmail = authentication.getName();
    bookmarkService.deleteBookmark(planId, userEmail);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/api/private/bookmarks/my")
  public ResponseEntity<List<BookmarkResponseDto>> getMyBookmarks(
      Authentication authentication) {
    String userEmail = authentication.getName();
    List<BookmarkResponseDto> bookmarks = bookmarkService.getMyBookmarks(userEmail);
    return ResponseEntity.ok(bookmarks);
  }
}