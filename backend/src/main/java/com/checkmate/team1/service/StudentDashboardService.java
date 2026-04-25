package com.checkmate.team1.service;

import com.checkmate.team1.dto.ChangePasswordRequest;
import com.checkmate.team1.dto.ChangePasswordResponse;
import com.checkmate.team1.dto.StudentDashboardResponse;
import com.checkmate.team1.entity.Attendance;
import com.checkmate.team1.entity.Classes;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.AttendanceRepository;
import com.checkmate.team1.repository.ClassesRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.checkmate.team1.dto.StudentSettingsResponse;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class StudentDashboardService {

    private final StudentRepository studentRepository;
    private final ClassesRepository classesRepository;
    private final AttendanceRepository attendanceRepository;

    public StudentDashboardResponse getDashboard(String studentId) {

        // 1️⃣ 학생 조회
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("학생 없음"));

        // 2️⃣ 강의 조회
        Classes classes = classesRepository.findById(student.getClassId())
                .orElse(null);

        // 3️⃣ 오늘 출결 조회
        LocalDate today = LocalDate.now();

        Attendance attendance =
                attendanceRepository
                        .findByStudent_StudentIdAndAttendanceDate(studentId, today)
                        .orElse(null);

        // 4️⃣ DTO 변환
        return StudentDashboardResponse.from(student, classes, attendance);
    }

    public StudentSettingsResponse getSettings(String studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("학생 정보를 찾을 수 없습니다."));

        Classes classes = classesRepository.findById(student.getClassId())
                .orElse(null);

        return StudentSettingsResponse.builder()
                .name(student.getName())
                .phoneNumber(student.getPhoneNumber())
                .studentId(student.getStudentId())
                .className(classes != null ? classes.getClassName() : null)
                .email(student.getEmail())
                .build();
    }

    public ChangePasswordResponse changePassword(ChangePasswordRequest request) {

        Student student = studentRepository.findById(request.getStudentId())
                .orElse(null);

        if (student == null) {
            return ChangePasswordResponse.builder()
                    .changed(false)
                    .message("학생 정보를 찾을 수 없습니다.")
                    .build();
        }

        if (!student.getPassword().equals(request.getCurrentPassword())) {
            return ChangePasswordResponse.builder()
                    .changed(false)
                    .message("현재 비밀번호가 일치하지 않습니다.")
                    .build();
        }

        if (student.getPassword().equals(request.getNewPassword())) {
            return ChangePasswordResponse.builder()
                    .changed(false)
                    .message("기존 비밀번호와 동일한 비밀번호입니다.")
                    .build();
        }

        student.changePassword(request.getNewPassword());

        studentRepository.save(student);

        return ChangePasswordResponse.builder()
                .changed(true)
                .message("비밀번호가 변경되었습니다.")
                .build();
    }
}