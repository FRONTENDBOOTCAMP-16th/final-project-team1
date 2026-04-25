package com.checkmate.team1.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "notices")
@Getter
@NoArgsConstructor
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Integer noticeId;

    @Column(name = "title", length = 100)
    private String title;

    @Column(name = "content", length = 1000)
    private String content;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "is_open")
    private Boolean isOpen;

    @Column(name = "is_deleted")
    private Boolean isDeleted;
}