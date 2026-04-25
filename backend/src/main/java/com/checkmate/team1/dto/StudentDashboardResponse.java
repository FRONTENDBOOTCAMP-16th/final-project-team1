package com.checkmate.team1.dto;

import com.checkmate.team1.entity.Attendance;
import com.checkmate.team1.entity.Classes;
import com.checkmate.team1.entity.Student;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class StudentDashboardResponse {

    private StudentInfo studentInfo;
    private TodayAttendance todayAttendance;

    @Getter
    @Builder
    public static class StudentInfo {

        private String studentId;
        private String name;
        private String className;
        private String studentStatusCode;
        private String studentStatusName;
    }

    @Getter
    @Builder
    public static class TodayAttendance {

        private LocalDate attendanceDate;
        private LocalDateTime checkInTime;
        private LocalDateTime checkOutTime;
    }

    public static StudentDashboardResponse from(
            Student student,
            Classes classes,
            Attendance attendance
    ) {

        return StudentDashboardResponse.builder()
                .studentInfo(
                        StudentInfo.builder()
                                .studentId(student.getStudentId())
                                .name(student.getName())
                                .className(classes != null ? classes.getClassName() : null)
                                .studentStatusCode(student.getStudentStatusCode())
                                .studentStatusName(convertStatus(student.getStudentStatusCode()))
                                .build()
                )
                .todayAttendance(
                        attendance == null
                                ? null
                                : TodayAttendance.builder()
                                .attendanceDate(attendance.getAttendanceDate())
                                .checkInTime(attendance.getCheckInTime())
                                .checkOutTime(attendance.getCheckOutTime())
                                .build()
                )
                .build();
    }

    private static String convertStatus(String code) {

        if ("S001".equals(code)) return "수료";
        if ("S002".equals(code)) return "중도포기";
        if ("S003".equals(code)) return "강의중";

        return "";
    }
}