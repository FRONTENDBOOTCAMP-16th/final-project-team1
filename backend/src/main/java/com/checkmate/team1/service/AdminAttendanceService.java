package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminAttendanceListResponse;
import com.checkmate.team1.entity.Attendance;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.AttendanceRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAttendanceService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public AdminAttendanceListResponse getAttendances(
            String studentId,
            Integer classId,
            String attendanceStatus,
            LocalDate attendanceDate,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size
    ) {

        LocalDate fromDate;
        LocalDate toDate;

        if (attendanceDate != null) {
            fromDate = attendanceDate;
            toDate = attendanceDate;
        } else if (startDate != null && endDate != null) {
            fromDate = startDate;
            toDate = endDate;
        } else if (startDate != null) {
            fromDate = startDate;
            toDate = startDate;
        } else {
            fromDate = LocalDate.now();
            toDate = LocalDate.now();
        }

        List<Student> students;

        if (classId != null) {
            students = studentRepository.findByClassId(classId);
        } else {
            students = studentRepository.findAll();
        }

        List<Student> filteredStudents = students;

        if (studentId != null && !studentId.isBlank()) {
            filteredStudents = students.stream()
                    .filter(student -> student.getStudentId().equals(studentId))
                    .toList();
        }

        final List<Student> finalStudents = filteredStudents;

        List<Attendance> attendances =
                attendanceRepository.findByAttendanceDateBetween(fromDate, toDate);

        Map<String, Attendance> attendanceMap =
                attendances.stream()
                        .collect(Collectors.toMap(
                                attendance -> attendance.getStudent().getStudentId()
                                        + "_"
                                        + attendance.getAttendanceDate(),
                                attendance -> attendance,
                                (oldValue, newValue) -> oldValue
                        ));

        List<AdminAttendanceListResponse.Item> allItems =
                fromDate.datesUntil(toDate.plusDays(1))
                        .flatMap(date ->
                                finalStudents.stream().map(student -> {

                                    String key = student.getStudentId() + "_" + date;

                                    Attendance attendance = attendanceMap.get(key);

                                    String status = getAttendanceStatus(attendance, date);
                                    String statusName = getAttendanceStatusName(status);

                                    return AdminAttendanceListResponse.Item.builder()
                                            .attendanceId(attendance != null ? attendance.getAttendanceId() : null)
                                            .studentId(student.getStudentId())
                                            .studentName(student.getName())
                                            .studentInitial(getInitial(student.getName()))
                                            .classId(student.getClassId())
                                            .className("")
                                            .attendanceDate(date.toString())
                                            .checkInTime(formatTime(attendance != null ? attendance.getCheckInTime() : null))
                                            .checkOutTime(formatTime(attendance != null ? attendance.getCheckOutTime() : null))
                                            .attendanceStatus(status)
                                            .attendanceStatusName(statusName)
                                            .build();
                                })
                        )
                        .filter(item ->
                                attendanceStatus == null
                                        || attendanceStatus.isBlank()
                                        || item.getAttendanceStatus().equals(attendanceStatus)
                        )
                        .sorted(
                                Comparator.comparing(AdminAttendanceListResponse.Item::getAttendanceDate)
                                        .reversed()
                                        .thenComparing(AdminAttendanceListResponse.Item::getStudentId)
                        )
                        .toList();

        int startIndex = (page - 1) * size;
        int endIndex = Math.min(startIndex + size, allItems.size());

        List<AdminAttendanceListResponse.Item> pageItems =
                startIndex >= allItems.size()
                        ? List.of()
                        : allItems.subList(startIndex, endIndex);

        return AdminAttendanceListResponse.builder()
                .items(pageItems)
                .page(page)
                .size(size)
                .totalCount(allItems.size())
                .build();
    }

    private String getAttendanceStatus(
            Attendance attendance,
            LocalDate attendanceDate
    ) {

        if (attendance == null
                || attendance.getCheckInTime() == null
                || attendance.getCheckOutTime() == null) {
            return "ABSENT";
        }

        LocalDateTime checkInBaseTime =
                LocalDateTime.of(attendanceDate, LocalTime.of(9, 10));

        LocalDateTime checkOutBaseTime =
                LocalDateTime.of(attendanceDate, LocalTime.of(18, 0));

        if (!attendance.getCheckInTime().isAfter(checkInBaseTime)
                && !attendance.getCheckOutTime().isBefore(checkOutBaseTime)) {
            return "PRESENT";
        }

        return "LATE";
    }

    private String getAttendanceStatusName(String status) {

        if ("PRESENT".equals(status)) return "출석완료";
        if ("LATE".equals(status)) return "지각";
        if ("ABSENT".equals(status)) return "결석";

        return "";
    }

    private String formatTime(LocalDateTime dateTime) {

        if (dateTime == null) {
            return "00:00";
        }

        return dateTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    private String getInitial(String name) {

        if (name == null || name.isBlank()) {
            return "";
        }

        return name.substring(0, 1);
    }
}