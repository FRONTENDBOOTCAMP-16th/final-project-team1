package com.checkmate.team1.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Getter
@NoArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leave_request_id")
    private Integer leaveRequestId;

    @Column(name = "student_no", length = 50)
    private String studentId;

    @Column(name = "leave_type_code", length = 10)
    private String leaveTypeCode;

    @Column(name = "lea_start_date")
    private LocalDate startDate;

    @Column(name = "lea_end_date")
    private LocalDate endDate;

    @Column(name = "approval_status_code", length = 10)
    private String approvalStatusCode;

    public LeaveRequest(
            String studentId,
            String leaveTypeCode,
            LocalDate startDate,
            LocalDate endDate,
            String approvalStatusCode
    ) {
        this.studentId = studentId;
        this.leaveTypeCode = leaveTypeCode;
        this.startDate = startDate;
        this.endDate = endDate;
        this.approvalStatusCode = approvalStatusCode;
    }

    public void updateApprovalStatusCode(String approvalStatusCode) {
        this.approvalStatusCode = approvalStatusCode;
    }
}