package com.checkmate.team1.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Getter
@NoArgsConstructor
public class Student {

    @Id
    @Column(name = "student_id", length = 50)
    private String studentId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "password_yn")
    private Boolean passwordYn;

    @Column(name = "phone_number", length = 100)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "class_id")
    private Integer classId;

    @Column(name = "student_status_code", length = 10)
    private String studentStatusCode;
}