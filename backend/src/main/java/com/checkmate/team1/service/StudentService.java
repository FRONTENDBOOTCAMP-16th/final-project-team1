package com.checkmate.team1.service;

import com.checkmate.team1.dto.StudentAddRequest;
import com.checkmate.team1.dto.StudentAddResponse;
import com.checkmate.team1.entity.Student;
import com.checkmate.team1.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentAddResponse addStudent(StudentAddRequest request) {
        boolean existsStudent = studentRepository.existsByStudentId(request.getStudentId());

        if (existsStudent) {
            throw new IllegalArgumentException("이미 존재하는 학번입니다.");
        }

        Student student = new Student(
                request.getStudentId(),
                request.getName(),
                request.getPassword(),
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