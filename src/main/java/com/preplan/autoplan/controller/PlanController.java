package com.preplan.autoplan.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class PlanController {

    @Value("${ncp.client.id}")
    private String ncpClientId;

    @GetMapping("/plan")
    public String plan(Model model) {
        model.addAttribute("ncpClientId", ncpClientId);
        return "createPlan";
    }

    //메뉴 선택시 fragment 호출
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
}
