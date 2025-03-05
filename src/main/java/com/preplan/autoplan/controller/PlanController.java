package com.preplan.autoplan.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class PlanController {

    @GetMapping("/plan")
    public String plan() {
        return "createPlan";
    }

    // 메뉴 선택시 fragment 호출
    @GetMapping("/hotContent")
    public String getHotContent() {
        return "fragments/planContent :: hotContent";
    }

    @GetMapping("/autoContent")
    public String getAutoContent() {
        return "fragments/planContent :: autoContent";
    }

    @GetMapping("/selfContent")
    public String getSelfContent() {
        return "fragments/planContent :: selfContent";
    }

    @GetMapping("/bookmarkContent")
    public String getBookmarkContent() {
        return "fragments/planContent :: bookmarkContent";
    }

    @GetMapping("/historyContent")
    public String gethistoryContent() {
        return "fragments/planContent :: historyContent";
    }

}
