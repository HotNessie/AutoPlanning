
package com.preplan.autoplan.dto.bookmark;

import com.preplan.autoplan.domain.member.Bookmark;

public record BookmarkResponseDto(
    Long bookmarkId,
    Long planId,
    String planTitle) {

  public static BookmarkResponseDto from(Bookmark bookmark) {
    return new BookmarkResponseDto(
        bookmark.getId(),
        bookmark.getPlan().getId(),
        bookmark.getPlan().getTitle());
  }
}
