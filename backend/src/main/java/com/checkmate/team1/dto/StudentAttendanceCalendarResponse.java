package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class StudentAttendanceCalendarResponse {

    private String studentId;
    private int year;
    private int month;
    private List<AttendanceCalendarItem> items;

    @Getter
    @Builder
    public static class AttendanceCalendarItem {
        private LocalDate attendanceDate;
        private LocalDateTime checkInTime;
        private LocalDateTime checkOutTime;
    }
}