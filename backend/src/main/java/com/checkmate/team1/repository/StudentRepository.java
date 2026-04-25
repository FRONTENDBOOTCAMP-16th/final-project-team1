package com.checkmate.team1.repository;

import com.checkmate.team1.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {

    Optional<Student> findByStudentId(String studentId);

    boolean existsByStudentId(String studentId);

    @Query("""
        SELECT COUNT(s)
        FROM Student s
        WHERE s.classId IN (
            SELECT c.classId
            FROM Classes c
            WHERE c.isCompleted = false
        )
        """)
    long countActiveClassStudents();

    long countByClassId(Integer classId);

    Page<Student> findByClassId(Integer classId, Pageable pageable);

    Page<Student> findByNameContainingOrStudentIdContaining(
            String name,
            String studentId,
            Pageable pageable
    );

    Page<Student> findByStudentStatusCode(
            String studentStatusCode,
            Pageable pageable
    );

    List<Student> findByClassId(Integer classId);
}