package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminDashboardResponse;
import com.checkmate.team1.repository.AttendanceRepository;
import com.checkmate.team1.repository.ClassesRepository;
import com.checkmate.team1.repository.LeaveRequestRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final StudentRepository studentRepository;
    private final ClassesRepository classesRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public AdminDashboardResponse getDashboard() {

        LocalDate today = LocalDate.now();

        LocalDateTime lateBaseTime =
                LocalDateTime.of(today, LocalTime.of(9, 10));

        long studentCount = studentRepository.countActiveClassStudents();

        long classCount = classesRepository.countByIsCompletedFalse();

        long presentCount =
                attendanceRepository.countPresent(today, lateBaseTime);

        long lateCount =
                attendanceRepository.countLate(today, lateBaseTime);

        long absentCount =
                studentCount - presentCount - lateCount;

        if (absentCount < 0) {
            absentCount = 0;
        }

        long pendingLeaveCount =
                leaveRequestRepository.countByApprovalStatusCode("V001");

        double attendanceRate = 0;

        if (studentCount > 0) {
            attendanceRate =
                    Math.round(((double) (presentCount + lateCount) / studentCount) * 10000) / 100.0;
        }

        return AdminDashboardResponse.builder()
                .studentCount(studentCount)
                .classCount(classCount)
                .attendanceRate(attendanceRate)
                .presentCount(presentCount)
                .lateCount(lateCount)
                .absentCount(absentCount)
                .pendingLeaveCount(pendingLeaveCount)
                .build();
    }
}