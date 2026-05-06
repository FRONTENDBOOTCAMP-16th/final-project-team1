package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.LoginRequest;
import com.checkmate.team1.dto.LoginResponse;
import com.checkmate.team1.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.checkmate.team1.dto.FindPasswordRequest;
import com.checkmate.team1.dto.FindPasswordResponse;
import com.checkmate.team1.dto.ResetPasswordRequest;
import java.util.Optional;

@Tag(name = "Auth", description = "인증 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "학생 로그인", description = "학번과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.success("로그인 성공", response);
    }

    @PostMapping("/find-password")
    public ApiResponse<FindPasswordResponse> findPassword(
            @RequestBody FindPasswordRequest request
    ) {

        Optional<FindPasswordResponse> result =
                authService.findPassword(request);

        if (result.isEmpty()) {
            return ApiResponse.fail("일치하는 회원 정보가 없습니다.");
        }

        return ApiResponse.success(
                "회원 정보가 조회되었습니다.",
                result.get()
        );
    }

    @PatchMapping("/reset-password")
    public ApiResponse<Void> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {

        boolean result = authService.resetPassword(request);

        if (!result) {
            return ApiResponse.fail("존재하지 않는 학생입니다.");
        }

        return ApiResponse.success("비밀번호가 재설정되었습니다.", null);
    }
}