package com.checkmate.team1.service;

import com.checkmate.team1.dto.CheckInResponse;
import com.checkmate.team1.dto.CheckOutResponse;
import com.checkmate.team1.entity.Attendance;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.AttendanceRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public CheckInResponse checkIn(String studentId) {

        LocalDate today = LocalDate.now();

        Attendance attendance =
                attendanceRepository
                        .findByStudent_StudentIdAndAttendanceDate(studentId, today)
                        .orElse(null);

        // 이미 입실한 경우
        if (attendance != null) {
            return CheckInResponse.builder()
                    .attendanceDate(attendance.getAttendanceDate())
                    .checkInTime(attendance.getCheckInTime())
                    .message("이미 입실 처리되었습니다.")
                    .build();
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("학생 정보를 찾을 수 없습니다."));

        LocalDateTime now = LocalDateTime.now();

        Attendance newAttendance =
                new Attendance(student, today, now, null);

        attendanceRepository.save(newAttendance);

        return CheckInResponse.builder()
                .attendanceDate(today)
                .checkInTime(now)
                .message("입실 처리 완료")
                .build();
    }

    public CheckOutResponse checkOut(String studentId) {

        LocalDate today = LocalDate.now();

        Attendance attendance =
                attendanceRepository
                        .findByStudent_StudentIdAndAttendanceDate(studentId, today)
                        .orElse(null);

        if (attendance == null) {
            return CheckOutResponse.builder()
                    .attendanceDate(today)
                    .checkInTime(null)
                    .checkOutTime(null)
                    .message("입실 기록이 없습니다.")
                    .build();
        }

        if (attendance.getCheckOutTime() != null) {
            return CheckOutResponse.builder()
                    .attendanceDate(attendance.getAttendanceDate())
                    .checkInTime(attendance.getCheckInTime())
                    .checkOutTime(attendance.getCheckOutTime())
                    .message("이미 퇴실 처리되었습니다.")
                    .build();
        }

        LocalDateTime now = LocalDateTime.now();

        attendance.checkOut(now);

        attendanceRepository.save(attendance);

        return CheckOutResponse.builder()
                .attendanceDate(attendance.getAttendanceDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(now)
                .message("퇴실 처리 완료")
                .build();
    }
}