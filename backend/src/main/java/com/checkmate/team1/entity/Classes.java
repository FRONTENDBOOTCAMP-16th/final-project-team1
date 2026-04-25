package com.checkmate.team1.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "classes")
@Getter
@NoArgsConstructor
public class Classes {

    @Id
    @Column(name = "class_id")
    private Integer classId;

    @Column(name = "class_name", length = 500)
    private String className;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_completed")
    private Boolean isCompleted;
}