package com.preplan.autoplan.controller.member;

import com.preplan.autoplan.dto.MemberFormDto;
import com.preplan.autoplan.service.MemberService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping(value = "/members/new")
    public String memberForm(Model model) {
        model.addAttribute("memberFormDto", new MemberFormDto());
        return "addMember"; // 회원가입 폼 템플릿 이름
    }

    @PostMapping("/members/new")
    public String newMember(@Valid MemberFormDto memberFormDto, BindingResult bindingResult, Model model) {

        if (bindingResult.hasErrors()) {
            return "addMember"; // 에러가 있을 경우 회원가입 폼으로 돌아감
        }

        try {
            memberService.join(memberFormDto);
        } catch (Exception e) {
            model.addAttribute("errorMessage", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
            return "addMember";
        }

        return "redirect:/plan"; // 회원가입 후 리다이렉트할 경로
    }

    @GetMapping("/login")
    public String loginPage() {
        return "loginPage";
    }
}
