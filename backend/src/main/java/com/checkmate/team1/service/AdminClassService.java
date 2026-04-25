package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminClassAttendanceResponse;
import com.checkmate.team1.entity.Classes;
import com.checkmate.team1.repository.AttendanceRepository;
import com.checkmate.team1.repository.ClassesRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.checkmate.team1.dto.AdminClassListResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@Service
@RequiredArgsConstructor
public class AdminClassService {

    private final ClassesRepository classesRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public List<AdminClassAttendanceResponse> getClassAttendances() {

        LocalDate today = LocalDate.now();

        LocalDateTime lateBaseTime =
                LocalDateTime.of(today, LocalTime.of(9, 10));

        List<Classes> classesList =
                classesRepository.findByIsCompletedFalse();

        return classesList.stream()
                .map(classes -> {
                    Integer classId = classes.getClassId();

                    long totalCount =
                            studentRepository.countByClassId(classId);

                    long presentCount =
                            attendanceRepository.countPresentByClassId(
                                    classId,
                                    today,
                                    lateBaseTime
                            );

                    long lateCount =
                            attendanceRepository.countLateByClassId(
                                    classId,
                                    today,
                                    lateBaseTime
                            );

                    long absentCount =
                            totalCount - presentCount - lateCount;

                    if (absentCount < 0) {
                        absentCount = 0;
                    }

                    return AdminClassAttendanceResponse.builder()
                            .classId(classId)
                            .className(classes.getClassName())
                            .totalCount(totalCount)
                            .presentCount(presentCount)
                            .lateCount(lateCount)
                            .absentCount(absentCount)
                            .build();
                })
                .toList();
    }

    public AdminClassListResponse getClasses(
            String keyword,
            int page,
            int size
    ) {

        PageRequest pageRequest = PageRequest.of(page - 1, size);

        Page<Classes> classPage;

        if (keyword == null || keyword.isBlank()) {
            classPage = classesRepository.findAll(pageRequest);
        } else {
            classPage = classesRepository.findByClassNameContaining(
                    keyword,
                    pageRequest
            );
        }

        return AdminClassListResponse.builder()
                .items(
                        classPage.getContent()
                                .stream()
                                .map(classes -> AdminClassListResponse.Item.builder()
                                        .classId(classes.getClassId())
                                        .className(classes.getClassName())
                                        .startDate(classes.getStartDate())
                                        .endDate(classes.getEndDate())
                                        .isCompleted(classes.getIsCompleted())
                                        .completedStatusName(
                                                Boolean.TRUE.equals(classes.getIsCompleted())
                                                        ? "수강완료"
                                                        : "진행중"
                                        )
                                        .build()
                                )
                                .toList()
                )
                .page(page)
                .size(size)
                .totalCount(classPage.getTotalElements())
                .build();
    }
}