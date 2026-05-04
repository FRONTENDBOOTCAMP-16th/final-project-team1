package com.checkmate.team1.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FindPasswordRequest {

    private String name;
    private String phoneNumber;
}