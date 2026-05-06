package com.checkmate.team1.service;

import com.checkmate.team1.dto.LoginRequest;
import com.checkmate.team1.dto.LoginResponse;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.checkmate.team1.dto.FindPasswordRequest;
import com.checkmate.team1.dto.FindPasswordResponse;
import java.util.Optional;
import com.checkmate.team1.dto.ResetPasswordRequest;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;

    public LoginResponse login(LoginRequest request) {
        Student student = studentRepository.findByStudentId(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 학생입니다."));

        if (!student.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return new LoginResponse(
                student.getStudentId(),
                student.getName(),
                "STUDENT",
                student.getPasswordYn(),
                "jwt-token"
        );
    }

    public Optional<FindPasswordResponse> findPassword(FindPasswordRequest request) {

        return studentRepository
                .findByNameAndPhoneNumber(
                        request.getName(),
                        request.getPhoneNumber()
                )
                .map(student ->
                        new FindPasswordResponse(student.getStudentId())
                );
    }

    @Transactional
    public boolean resetPassword(ResetPasswordRequest request) {

        return studentRepository.findById(request.getStudentId())
                .map(student -> {
                    student.changePassword(request.getNewPassword());
                    return true;
                })
                .orElse(false);
    }
}