package com.checkmate.team1.repository;

import com.checkmate.team1.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    Optional<Attendance> findByStudent_StudentIdAndAttendanceDate(
            String studentId,
            LocalDate attendanceDate
    );

    @Query("""
        SELECT COUNT(a)
        FROM Attendance a
        WHERE a.attendanceDate = :today
        AND a.checkInTime IS NOT NULL
        AND a.checkInTime <= :lateBaseTime
        """)
    long countPresent(
            @Param("today") LocalDate today,
            @Param("lateBaseTime") LocalDateTime lateBaseTime
    );

    @Query("""
        SELECT COUNT(a)
        FROM Attendance a
        WHERE a.attendanceDate = :today
        AND a.checkInTime IS NOT NULL
        AND a.checkInTime > :lateBaseTime
        """)
    long countLate(
            @Param("today") LocalDate today,
            @Param("lateBaseTime") LocalDateTime lateBaseTime
    );

    @Query("""
        SELECT COUNT(a)
        FROM Attendance a
        WHERE a.student.classId = :classId
        AND a.attendanceDate = :today
        AND a.checkInTime IS NOT NULL
        AND a.checkInTime <= :lateBaseTime
        """)
    long countPresentByClassId(
            @Param("classId") Integer classId,
            @Param("today") LocalDate today,
            @Param("lateBaseTime") LocalDateTime lateBaseTime
    );

    @Query("""
        SELECT COUNT(a)
        FROM Attendance a
        WHERE a.student.classId = :classId
        AND a.attendanceDate = :today
        AND a.checkInTime IS NOT NULL
        AND a.checkInTime > :lateBaseTime
        """)
    long countLateByClassId(
            @Param("classId") Integer classId,
            @Param("today") LocalDate today,
            @Param("lateBaseTime") LocalDateTime lateBaseTime
    );

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    List<Attendance> findByStudent_StudentIdAndAttendanceDateBetweenOrderByAttendanceDateAsc(
            String studentId,
            LocalDate startDate,
            LocalDate endDate
    );
}