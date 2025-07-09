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

    @GetMapping("/plan/submit")
    public String submitPlan() {
        // 여기에 계획 제출 로직을 추가할 수 있습니다.
        return "fragments/selfPlanContent"; // 제출 후 다시 계획 페이지로 리다이렉트
    }

    @GetMapping("/hotContent")
    public String getHotContent() {
        return "fragments/hotContent";
    }

    @GetMapping("/autoContent")
    public String getAutoContent() {
        return "fragments/autoContent";
    }

    @GetMapping("/selfContent")
    public String getSelfContent() {
        return "fragments/selfContent";
    }

    @GetMapping("/routeResult")
    public String getSelfResult() {
        return "fragments/RouteResult";
    }

    @GetMapping("/bookmarkContent")
    public String getBookmarkContent() {
        return "fragments/bookmarkContent";
    }

    @GetMapping("/historyContent")
    public String getHistoryContent() {
        return "fragments/historyContent";
    }
}
