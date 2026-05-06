package com.checkmate.team1.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "classes")
@Getter
@NoArgsConstructor
public class Classes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    public Classes(
            String className,
            LocalDate startDate,
            LocalDate endDate,
            Boolean isCompleted
    ) {
        this.className = className;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isCompleted = isCompleted;
    }

    public void updateClass(
            String className,
            LocalDate startDate,
            LocalDate endDate,
            Boolean isCompleted
    ) {
        this.className = className;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isCompleted = isCompleted;
    }
}