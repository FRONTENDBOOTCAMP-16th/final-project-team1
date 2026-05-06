package com.checkmate.team1.dto;

import com.checkmate.team1.entity.LeaveRequest;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class StudentLeaveRequestListResponse {

    private List<Item> items;
    private int page;
    private int size;
    private long totalCount;

    @Getter
    @Builder
    public static class Item {

        private Integer leaveRequestId;
        private String studentId;
        private String leaveTypeCode;
        private String leaveTypeName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String approvalStatusCode;
        private String approvalStatusName;
    }

    public static StudentLeaveRequestListResponse from(
            Page<LeaveRequest> leaveRequestPage,
            int requestPage,
            int size
    ) {

        List<Item> items = leaveRequestPage.getContent()
                .stream()
                .map(leaveRequest -> Item.builder()
                        .leaveRequestId(leaveRequest.getLeaveRequestId())
                        .studentId(leaveRequest.getStudentId())
                        .leaveTypeCode(leaveRequest.getLeaveTypeCode())
                        .leaveTypeName(convertLeaveTypeName(leaveRequest.getLeaveTypeCode()))
                        .startDate(leaveRequest.getStartDate())
                        .endDate(leaveRequest.getEndDate())
                        .approvalStatusCode(leaveRequest.getApprovalStatusCode())
                        .approvalStatusName(convertApprovalStatusName(leaveRequest.getApprovalStatusCode()))
                        .build())
                .toList();

        return StudentLeaveRequestListResponse.builder()
                .items(items)
                .page(requestPage)
                .size(size)
                .totalCount(leaveRequestPage.getTotalElements())
                .build();
    }

    private static String convertLeaveTypeName(String code) {

        if ("H001".equals(code)) return "개인사유";
        if ("H002".equals(code)) return "병결";
        if ("H003".equals(code)) return "공결";

        return "";
    }

    private static String convertApprovalStatusName(String code) {

        if ("V001".equals(code)) return "승인 대기";
        if ("V002".equals(code)) return "승인 완료";
        if ("V003".equals(code)) return "반려";

        return "";
    }
}