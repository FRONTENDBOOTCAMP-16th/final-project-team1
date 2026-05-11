package com.checkmate.team1.service;

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

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("학생 없음"));

        Classes classes = classesRepository.findById(student.getClassId())
                .orElse(null);

        LocalDate today = LocalDate.now();

        Attendance attendance =
                attendanceRepository
                        .findByStudent_StudentIdAndAttendanceDate(studentId, today)
                        .orElse(null);

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
}