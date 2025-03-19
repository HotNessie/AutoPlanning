package com.preplan.autoplan.apiController.placeKeyword;

import com.preplan.autoplan.domain.keyword.SelectKeyword.MoodField;
import com.preplan.autoplan.domain.keyword.SelectKeyword.PurposeField;
import com.preplan.autoplan.dto.placeKeyword.PlaceKeywordCreateRequestDto;
import com.preplan.autoplan.dto.placeKeyword.PlaceKeywordResponseDto;
import java.util.List;
import java.util.stream.Collectors;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@NoArgsConstructor
public class PlaceKeyword {

    //placeKeywordService 작성하셈

    //특정 장소에 연결된 모든 키워드와 count반환
//    @GetMapping("/places/{placeId}/keywords")
//    public ResponseEntity<List<PlaceKeywordResponseDto>> getPlaceKeywords(
//        @PathVariable Long placeId) {
//        List<PlaceKeyword> keywords = placeKeywordService.findByPlaceId(placeId);
//        List<PlaceKeywordResponseDto> dtos = keywords.stream()
//            .map(keyword -> new PlaceKeywordResponseDto(
//                keyword.getId(),
//                keyword.getPlace().getId(),
//                keyword.getPurposeKeyword() != null ? keyword.getPurposeKeyword().name() : null,
//                keyword.getMoodKeyword() != null ? keyword.getMoodKeyword().name() : null,
//                keyword.getCount()
//            ))
//            .collect(Collectors.toList());
//        return ResponseEntity.ok(dtos);
//    }

    //키워드 추가
//    @PostMapping("/places/{placeId}/keywords")
//    public ResponseEntity<PlaceKeywordResponseDto> addPlaceKeyword(
//        @PathVariable Long placeId,
//        @RequestBody PlaceKeywordCreateRequestDto dto
//    ) {
//        Place place = placeService.findById(dto.placeId());
//
    ////     PurposeField 또는 MoodField로 변환
//        PurposeField purpose = dto.purposeKeyword() != null ? PurposeField.valueOf(dto.purposeKeyword()) : null;
//        MoodField mood = dto.moodKeyword() != null ? MoodField.valueOf(dto.moodKeyword()) : null;
//
////         PlaceKeyword 생성 또는 업데이트
//        PlaceKeyword keyword = PlaceKeyword.builder()
//            .place(place)
//            .purposeKeyword(purpose)
//            .moodKeyword(mood)
//            .build();
//        PlaceKeyword savedKeyword = placeKeywordService.saveOrUpdate(keyword);
//
////         Place의 상위 키워드 갱신
//        place.addPurposeKeyword(purpose);
//        place.addMoodKeyword(mood);
//        placeService.save(place);
//
//        PlaceKeywordResponseDto response = new PlaceKeywordResponseDto(
//            savedKeyword.getId(),
//            savedKeyword.getPlace().getId(),
//            savedKeyword.getPurposeKeyword() != null ? savedKeyword.getPurposeKeyword().name() : null,
//            savedKeyword.getMoodKeyword() != null ? savedKeyword.getMoodKeyword().name() : null,
//            savedKeyword.getCount()
//        );
//        return ResponseEntity.ok(response);
//    }
}
