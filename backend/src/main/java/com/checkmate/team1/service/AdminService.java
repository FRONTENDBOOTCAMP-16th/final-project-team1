package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminLoginRequest;
import com.checkmate.team1.dto.AdminLoginResponse;
import com.checkmate.team1.entity.Admin;
import com.checkmate.team1.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.checkmate.team1.dto.AdminResetPasswordRequest;
import org.springframework.transaction.annotation.Transactional;
import com.checkmate.team1.security.JwtTokenProvider;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public AdminLoginResponse login(AdminLoginRequest request) {

        Admin admin = adminRepository.findById(request.getAdminId())
                .orElse(null);

        if (admin == null) {
            return null;
        }

        if (!admin.getPassword().equals(request.getPassword())) {
            return null;
        }

        String accessToken = jwtTokenProvider.createToken(
                admin.getAdminId(),
                "ADMIN"
        );

        return new AdminLoginResponse(
                admin.getAdminId(),
                admin.getName(),
                "ADMIN",
                accessToken
        );
    }

    @Transactional
    public boolean resetPassword(
            String adminId,
            AdminResetPasswordRequest request) {
        return adminRepository.findById(adminId)
                .map(admin -> {
                    admin.changePassword(request.getNewPassword());
                    return true;
                })
                .orElse(false);
    }
}