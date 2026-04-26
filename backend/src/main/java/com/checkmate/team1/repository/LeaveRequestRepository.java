package com.checkmate.team1.repository;

import com.checkmate.team1.entity.LeaveRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDate;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Integer> {

    Page<LeaveRequest> findByStudentId(
            String studentId,
            Pageable pageable
    );

    Page<LeaveRequest> findByStudentIdAndApprovalStatusCode(
            String studentId,
            String approvalStatusCode,
            Pageable pageable
    );

    boolean existsByStudentIdAndStartDateAndEndDate(
            String studentId,
            LocalDate startDate,
            LocalDate endDate
    );

    long countByApprovalStatusCode(String approvalStatusCode);

    List<LeaveRequest> findTop6ByOrderByLeaveRequestIdDesc();

    List<LeaveRequest> findAllByOrderByLeaveRequestIdDesc();
}