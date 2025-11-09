package com.preplan.autoplan.controller.plan;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PlanController {

  @GetMapping("/test")
  public String test() {
    return "test";
  }

  @GetMapping("/plan")
  public String plan() {
    return "createPlan";
  }

  @GetMapping("/plan/submit")
  public String submitPlan() {
    return "fragments/selfContent/selfPlanContent";
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
    return "fragments/selfContent/selfContent";
  }

  @GetMapping("/myPlanList")
  public String getMyPlanList() {
    return "fragments/myPlanList/myPlanList";
  }

  @GetMapping("/myPlanDetail")
  public String getMyPlanDetail() {
    return "fragments/myPlanList/myPlanDetails";
  }

  @GetMapping("/routeResult")
  public String getSelfResult() {
    return "fragments/RouteResult";
  }

  @GetMapping("/bookmarkContent")
  public String getBookmarkContent() {
    return "fragments/bookmarkContent";
  }

  @GetMapping("/searchPlans")
  public String getHistoryContent() {
    return "fragments/searchPlans";
  }
}
