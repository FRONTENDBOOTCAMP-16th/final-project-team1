package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminAttendanceListResponse;
import com.checkmate.team1.entity.Attendance;
import com.checkmate.team1.entity.Classes;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.AttendanceRepository;
import com.checkmate.team1.repository.ClassesRepository;
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
    private final ClassesRepository classesRepository;

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

        LocalDate targetDate = attendanceDate;

        if (targetDate == null && startDate != null) {
            targetDate = startDate;
        }

        if (targetDate == null) {
            targetDate = LocalDate.now();
        }

        LocalDateTime lateBaseTime =
                LocalDateTime.of(targetDate, LocalTime.of(9, 10));

        List<Student> students;

        if (classId != null) {
            students = studentRepository.findByClassId(classId);
        } else {
            students = studentRepository.findAll();
        }

        if (studentId != null && !studentId.isBlank()) {
            students = students.stream()
                    .filter(student -> student.getStudentId().equals(studentId))
                    .toList();
        }

        List<Attendance> attendances =
                attendanceRepository.findByAttendanceDate(targetDate);

        Map<String, Attendance> attendanceMap =
                attendances.stream()
                        .collect(Collectors.toMap(
                                attendance -> attendance.getStudent().getStudentId(),
                                attendance -> attendance,
                                (oldValue, newValue) -> oldValue
                        ));

        LocalDate finalTargetDate = targetDate;

        List<AdminAttendanceListResponse.Item> allItems =
                students.stream()
                        .map(student -> {
                            Attendance attendance =
                                    attendanceMap.get(student.getStudentId());

                            Classes classes = classesRepository
                                    .findById(student.getClassId())
                                    .orElse(null);

                            String status = getAttendanceStatus(attendance, lateBaseTime);
                            String statusName = getAttendanceStatusName(status);

                            return AdminAttendanceListResponse.Item.builder()
                                    .attendanceId(attendance != null ? attendance.getAttendanceId() : null)
                                    .studentId(student.getStudentId())
                                    .studentName(student.getName())
                                    .studentInitial(getInitial(student.getName()))
                                    .classId(student.getClassId())
                                    .className(classes != null ? classes.getClassName() : null)
                                    .attendanceDate(finalTargetDate.toString())
                                    .checkInTime(formatTime(attendance != null ? attendance.getCheckInTime() : null))
                                    .checkOutTime(formatTime(attendance != null ? attendance.getCheckOutTime() : null))
                                    .attendanceStatus(status)
                                    .attendanceStatusName(statusName)
                                    .build();
                        })
                        .filter(item ->
                                attendanceStatus == null
                                        || attendanceStatus.isBlank()
                                        || item.getAttendanceStatus().equals(attendanceStatus)
                        )
                        .sorted(Comparator.comparing(AdminAttendanceListResponse.Item::getStudentId))
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
            LocalDateTime lateBaseTime
    ) {

        if (attendance == null || attendance.getCheckInTime() == null) {
            return "ABSENT";
        }

        if (attendance.getCheckInTime().isAfter(lateBaseTime)) {
            return "LATE";
        }

        return "PRESENT";
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