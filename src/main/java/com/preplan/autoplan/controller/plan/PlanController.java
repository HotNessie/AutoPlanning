package com.preplan.autoplan.controller.plan;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PlanController {

    @GetMapping("/plan")
    public String plan() {
        return "createPlan";
    }

    @GetMapping("/plan/submit")
    public String submitPlan() {
        return "fragments/selfPlanContent";
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

    @GetMapping("/myPlanList")
    public String getMyPlanList() {
        return "fragments/myPlanList";
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
