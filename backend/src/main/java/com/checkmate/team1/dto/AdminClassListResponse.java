package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
public class AdminClassListResponse {

    private List<Item> items;
    private int page;
    private int size;
    private long totalCount;

    @Getter
    @Builder
    public static class Item {

        private Integer classId;
        private String className;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean isCompleted;
        private String completedStatusName;
    }
}