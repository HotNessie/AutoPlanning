package com.preplan.autoplan.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class PlaceController {

  /**
   * 장소 상세 페이지를 렌더링합니다.
   * 
   * @return 장소 상세 페이지 템플릿 이름
   */
  @GetMapping("/placeDetail")
  public String placeDetail() {
    return "placeDetail";
  }

  /**
   * 장소 탐색 메인 페이지를 렌더링합니다.
   * 
   * @return 탐색 메인 페이지 템플릿 이름
   */
  @GetMapping("/placeMain")
  public String placeMain() {
    return "placeMain";
  }
}
