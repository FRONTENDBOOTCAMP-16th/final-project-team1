package com.checkmate.team1.controller;

import com.checkmate.team1.dto.ApiResponse;
import com.checkmate.team1.dto.LoginRequest;
import com.checkmate.team1.dto.LoginResponse;
import com.checkmate.team1.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
}