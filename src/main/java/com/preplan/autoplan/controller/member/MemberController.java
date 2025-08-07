package com.preplan.autoplan.controller.member;

import com.preplan.autoplan.domain.member.Member;
import com.preplan.autoplan.domain.member.Role;
import com.preplan.autoplan.dto.MemberFormDto;
import com.preplan.autoplan.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

// @RequestMapping("/members")
@Controller
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping(value = "/members/new")
    public String memberForm(Model model) {
        model.addAttribute("memberFormDto", new MemberFormDto());
        return "addMember"; // 회원가입 폼 템플릿 이름
    }

    @PostMapping(value = "/members/new")
    public String newMember(@Valid MemberFormDto memberFormDto, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            return "addMember"; // 에러 발생 시 회원가입 폼으로 다시 이동
        }

        try {
            Member member = Member.builder()
                    .name(memberFormDto.getName())
                    .email(memberFormDto.getEmail())
                    .password(memberFormDto.getPassword())
                    .phoneNumber(memberFormDto.getPhoneNumber())
                    .birthYear(memberFormDto.getBirthYear())
                    .sex(memberFormDto.getSex())
                    .role(Role.USER) // 기본적으로 USER 권한 부여
                    .build();
            memberService.join(member);
        } catch (IllegalStateException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "addMember"; // 중복 이메일 등 에러 발생 시 메시지 전달 후 폼으로 이동
        }

        return "redirect:/plan"; // 회원가입 성공 시 메인 페이지로 리다이렉트
    }

    @GetMapping("/login")
    public String loginPage() {
        return "loginPage";
    }
}
