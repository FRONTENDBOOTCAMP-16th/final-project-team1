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
import com.checkmate.team1.dto.AdminClassDetailResponse;
import com.checkmate.team1.dto.CreateClassRequest;
import com.checkmate.team1.dto.CreateClassResponse;
import com.checkmate.team1.dto.UpdateClassRequest;
import com.checkmate.team1.dto.UpdateClassResponse;
import com.checkmate.team1.dto.DeleteClassResponse;

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

    public AdminClassDetailResponse getClassDetail(Integer classId) {

        Classes classes = classesRepository.findById(classId)
                .orElse(null);

        if (classes == null) {
            return AdminClassDetailResponse.builder()
                    .classId(classId)
                    .className(null)
                    .startDate(null)
                    .endDate(null)
                    .isCompleted(null)
                    .completedStatusName(null)
                    .message("존재하지 않는 강의입니다.")
                    .build();
        }

        return AdminClassDetailResponse.builder()
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
                .message("강의 상세 조회 성공")
                .build();
    }

    public CreateClassResponse createClass(CreateClassRequest request) {

        boolean exists = classesRepository.existsByClassName(request.getClassName());

        if (exists) {
            return CreateClassResponse.builder()
                    .classId(null)
                    .className(request.getClassName())
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .isCompleted(request.getIsCompleted())
                    .completedStatusName(null)
                    .message("이미 존재하는 강의명입니다.")
                    .build();
        }

        Classes classes = new Classes(
                request.getClassName(),
                request.getStartDate(),
                request.getEndDate(),
                request.getIsCompleted()
        );

        Classes savedClass = classesRepository.save(classes);

        return CreateClassResponse.builder()
                .classId(savedClass.getClassId())
                .className(savedClass.getClassName())
                .startDate(savedClass.getStartDate())
                .endDate(savedClass.getEndDate())
                .isCompleted(savedClass.getIsCompleted())
                .completedStatusName(
                        Boolean.TRUE.equals(savedClass.getIsCompleted())
                                ? "수강완료"
                                : "진행중"
                )
                .message("강의 등록 성공")
                .build();
    }

    public UpdateClassResponse updateClass(
            Integer classId,
            UpdateClassRequest request
    ) {

        Classes classes = classesRepository.findById(classId)
                .orElse(null);

        if (classes == null) {
            return UpdateClassResponse.builder()
                    .classId(classId)
                    .className(null)
                    .startDate(null)
                    .endDate(null)
                    .isCompleted(null)
                    .completedStatusName(null)
                    .message("존재하지 않는 강의입니다.")
                    .build();
        }

        classes.updateClass(
                request.getClassName(),
                request.getStartDate(),
                request.getEndDate(),
                request.getIsCompleted()
        );

        classesRepository.save(classes);

        return UpdateClassResponse.builder()
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
                .message("강의 수정 성공")
                .build();
    }

    public DeleteClassResponse deleteClass(Integer classId) {

        Classes classes = classesRepository.findById(classId)
                .orElse(null);

        if (classes == null) {
            return DeleteClassResponse.builder()
                    .classId(classId)
                    .message("존재하지 않는 강의입니다.")
                    .build();
        }

        long studentCount = studentRepository.countByClassId(classId);

        if (studentCount > 0) {
            return DeleteClassResponse.builder()
                    .classId(classId)
                    .message("해당 강의에 소속된 학생이 있어 삭제할 수 없습니다.")
                    .build();
        }

        classesRepository.delete(classes);

        return DeleteClassResponse.builder()
                .classId(classId)
                .message("강의 삭제 성공")
                .build();
    }
}