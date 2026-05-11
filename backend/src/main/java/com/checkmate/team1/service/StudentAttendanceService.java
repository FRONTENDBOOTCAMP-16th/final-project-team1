package com.checkmate.team1.service;

import com.checkmate.team1.dto.StudentAttendanceCalendarResponse;
import com.checkmate.team1.entity.Attendance;
import com.checkmate.team1.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentAttendanceService {

    private final AttendanceRepository attendanceRepository;

    public StudentAttendanceCalendarResponse getAttendanceCalendar(
            String studentId,
            int year,
            int month
    ) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Attendance> attendances =
                attendanceRepository.findByStudent_StudentIdAndAttendanceDateBetweenOrderByAttendanceDateAsc(
                        studentId,
                        startDate,
                        endDate
                );

        List<StudentAttendanceCalendarResponse.AttendanceCalendarItem> items =
                attendances.stream()
                        .map(attendance ->
                                StudentAttendanceCalendarResponse.AttendanceCalendarItem.builder()
                                        .attendanceDate(attendance.getAttendanceDate())
                                        .checkInTime(attendance.getCheckInTime())
                                        .checkOutTime(attendance.getCheckOutTime())
                                        .build()
                        )
                        .toList();

        return StudentAttendanceCalendarResponse.builder()
                .studentId(studentId)
                .year(year)
                .month(month)
                .items(items)
                .build();
    }
}