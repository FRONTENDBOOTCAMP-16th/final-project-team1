package com.checkmate.team1.repository;

import com.checkmate.team1.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, String> {
}