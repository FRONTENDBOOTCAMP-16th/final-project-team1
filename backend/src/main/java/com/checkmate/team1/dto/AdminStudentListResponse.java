package com.checkmate.team1.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AdminStudentListResponse {

    private List<Item> items;
    private int page;
    private int size;
    private long totalCount;

    @Getter
    @Builder
    public static class Item {

        private String studentId;
        private String name;
        private String className;
        private String phoneNumber;
        private String statusCode;
        private String statusName;
    }
}