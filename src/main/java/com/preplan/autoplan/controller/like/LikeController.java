package com.preplan.autoplan.apiController.like;

import com.preplan.autoplan.domain.member.Like;
import com.preplan.autoplan.dto.like.LikeResponseDto;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@NoArgsConstructor
public class LikeController {

    //likeService만드셈

    //계획에 사용자가 좋아요 눌렀나 확인
//    @GetMapping("/plans/{planId}/likes")
//    public ResponseEntity<List<LikeResponseDto>> getLikesByPlan(@PathVariable Long planId) {
//        List<Like> likes = likeService.findByPlanId(planId);
//        List<LikeResponseDto> dtos = likes.stream()
//            .map(like -> new LikeResponseDto(
//                like.getId(),
//                like.getMember().getId(),
//                like.getPlan().getId(),
//                like.getCreatedAt()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

    //사용자가 좋아요 누른 계시물 반환
//    @GetMapping("/members/{memberId}/likes")
//    public ResponseEntity<List<LikeResponseDto>> getLikesByMember(@PathVariable Long memberId) {
//        List<Like> likes = likeService.findByMemberId(memberId);
//        List<LikeResponseDto> dtos = likes.stream()
//            .map(like -> new LikeResponseDto(
//                like.getId(),
//                like.getMember().getId(),
//                like.getPlan().getId(),
//                like.getCreatedAt()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

    //좋아요 추가
    // @PostMapping("/plans/{planId}/likes")
    //public ResponseEntity<LikeResponseDto> createLike(
    //    @PathVariable Long planId,
    //    @RequestBody LikeCreateRequestDto dto,
    //    @AuthenticationPrincipal Member currentMember // 인증된 사용자 정보
    //) {
    //    Plan plan = planService.findById(dto.planId());
    //    Like like = Like.builder()
    //        .member(currentMember)
    //        .plan(plan)
    //        .build();
    //    Like savedLike = likeService.save(like);
    //    plan.increaseLikes(); // 계획의 좋아요 수 증가
    //    LikeResponseDto response = new LikeResponseDto(
    //        savedLike.getId(),
    //        savedLike.getMember().getId(),
    //        savedLike.getPlan().getId(),
    //        savedLike.getCreatedAt()
    //    );
    //    return ResponseEntity.ok(response);
    //}

    //좋아요 취소
//    @DeleteMapping("/plans/{planId}/likes")
    
}
