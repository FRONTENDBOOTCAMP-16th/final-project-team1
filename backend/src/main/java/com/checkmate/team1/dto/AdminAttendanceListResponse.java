package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AdminAttendanceListResponse {

    private List<Item> items;
    private int page;
    private int size;
    private long totalCount;

    @Getter
    @Builder
    public static class Item {

        private Integer attendanceId;
        private String studentId;
        private String studentName;
        private String studentInitial;
        private Integer classId;
        private String className;
        private String attendanceDate;
        private String checkInTime;
        private String checkOutTime;
        private String attendanceStatus;
        private String attendanceStatusName;
    }
}