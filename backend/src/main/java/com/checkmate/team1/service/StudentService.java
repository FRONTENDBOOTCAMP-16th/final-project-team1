package com.checkmate.team1.service;

import com.checkmate.team1.dto.StudentAddRequest;
import com.checkmate.team1.dto.StudentAddResponse;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional
    public StudentAddResponse addStudent(StudentAddRequest request) {

        boolean existsPhone =
                studentRepository.existsByPhoneNumber(request.getPhoneNumber());

        if (existsPhone) {
            throw new IllegalArgumentException("이미 등록된 핸드폰 번호입니다.");
        }

        String today = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyMMdd"));

        Optional<Student> lastStudent =
                studentRepository.findTopByStudentIdStartingWithOrderByStudentIdDesc(today);

        int nextNumber = 1;

        if (lastStudent.isPresent()) {
            String lastId = lastStudent.get().getStudentId();
            String lastNumberStr = lastId.substring(6);
            nextNumber = Integer.parseInt(lastNumberStr) + 1;
        }

        String newStudentId = today + String.format("%03d", nextNumber);

        Student student = new Student(
                newStudentId,
                request.getName(),
                newStudentId,
                true,
                request.getPhoneNumber(),
                request.getEmail(),
                request.getClassId(),
                request.getStudentStatusCode()
        );

        Student savedStudent = studentRepository.save(student);

        return new StudentAddResponse(
                savedStudent.getStudentId(),
                savedStudent.getName(),
                savedStudent.getPhoneNumber(),
                savedStudent.getEmail(),
                savedStudent.getClassId(),
                savedStudent.getStudentStatusCode()
        );
    }
}