package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class AdminLeaveRequestListResponse {

    private Summary summary;
    private List<Item> items;
    private int page;
    private int size;
    private long totalCount;

    @Getter
    @Builder
    public static class Summary {
        private long pendingCount;
        private long approvedCount;
        private long rejectedCount;
    }

    @Getter
    @Builder
    public static class Item {
        private Integer leaveRequestId;
        private String studentId;
        private String studentName;
        private String studentInitial;
        private String leaveTypeCode;
        private String leaveTypeName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String periodText;
        private String approvalStatusCode;
        private String approvalStatusName;
    }
}