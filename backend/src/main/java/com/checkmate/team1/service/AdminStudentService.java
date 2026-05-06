package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminStudentListResponse;
import com.checkmate.team1.entity.Classes;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.ClassesRepository;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.checkmate.team1.dto.AdminStudentDetailResponse;
import com.checkmate.team1.dto.UpdateStudentRequest;
import com.checkmate.team1.dto.UpdateStudentResponse;
import com.checkmate.team1.dto.DeleteStudentResponse;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminStudentService {

    private final StudentRepository studentRepository;
    private final ClassesRepository classesRepository;

    public AdminStudentListResponse getStudents(
            Integer classId,
            String keyword,
            String statusCode,
            int page,
            int size
    ) {

        PageRequest pageable = PageRequest.of(page - 1, size);

        Page<Student> studentPage;

        if (classId != null) {

            studentPage = studentRepository.findByClassId(classId, pageable);

        } else if (keyword != null && !keyword.isBlank()) {

            studentPage = studentRepository
                    .findByNameContainingOrStudentIdContaining(
                            keyword,
                            keyword,
                            pageable
                    );

        } else if (statusCode != null) {

            studentPage = studentRepository
                    .findByStudentStatusCode(statusCode, pageable);

        } else {

            studentPage = studentRepository.findAll(pageable);
        }

        return AdminStudentListResponse.builder()
                .items(studentPage.getContent().stream()
                        .map(student -> {

                            Classes classes = classesRepository
                                    .findByClassId(student.getClassId())
                                    .orElse(null);

                            String className =
                                    classes != null ? classes.getClassName() : null;

                            return AdminStudentListResponse.Item.builder()
                                    .studentId(student.getStudentId())
                                    .name(student.getName())
                                    .className(className)
                                    .phoneNumber(student.getPhoneNumber())
                                    .statusCode(student.getStudentStatusCode())
                                    .statusName(convertStatusName(student.getStudentStatusCode()))
                                    .build();
                        })
                        .toList())
                .page(page)
                .size(size)
                .totalCount(studentPage.getTotalElements())
                .build();
    }

    private String convertStatusName(String code) {

        if ("S001".equals(code)) return "중도포기";
        if ("S002".equals(code)) return "수료완료";
        if ("S003".equals(code)) return "수료중";

        return "";
    }

    public AdminStudentDetailResponse getStudentDetail(String studentId) {

        Student student = studentRepository.findById(studentId)
                .orElse(null);

        if (student == null) {
            return null;
        }

        Classes classes = classesRepository.findById(student.getClassId())
                .orElse(null);

        return AdminStudentDetailResponse.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .phoneNumber(student.getPhoneNumber())
                .email(student.getEmail())
                .classId(student.getClassId())
                .className(classes != null ? classes.getClassName() : null)
                .statusCode(student.getStudentStatusCode())
                .statusName(convertStatusName(student.getStudentStatusCode()))
                .build();
    }

    @Transactional
    public UpdateStudentResponse updateStudent(
            String studentId,
            UpdateStudentRequest request
    ) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 학생입니다."));

        Classes classes = classesRepository.findById(request.getClassId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의입니다."));

        boolean existsPhone =
                studentRepository.existsByPhoneNumberAndStudentIdNot(
                        request.getPhoneNumber(),
                        studentId
                );

        if (existsPhone) {
            throw new IllegalArgumentException("이미 등록된 핸드폰 번호입니다.");
        }

        student.updateStudent(
                request.getName(),
                request.getPhoneNumber(),
                request.getEmail(),
                request.getClassId(),
                request.getStudentStatusCode()
        );

        studentRepository.save(student);

        return UpdateStudentResponse.builder()
                .studentId(student.getStudentId())
                .name(student.getName())
                .classId(student.getClassId())
                .studentStatusCode(student.getStudentStatusCode())
                .message("학생 정보 수정 성공")
                .build();
    }

    public DeleteStudentResponse deleteStudent(String studentId) {

        Student student = studentRepository.findById(studentId)
                .orElse(null);

        if (student == null) {
            return DeleteStudentResponse.builder()
                    .studentId(studentId)
                    .message("존재하지 않는 학생입니다.")
                    .build();
        }

        studentRepository.delete(student);

        return DeleteStudentResponse.builder()
                .studentId(studentId)
                .message("학생 삭제 성공")
                .build();
    }
}