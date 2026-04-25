package com.checkmate.team1.repository;

import com.checkmate.team1.entity.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClassesRepository extends JpaRepository<Classes, Integer> {
    long countByIsCompletedFalse();

    List<Classes> findByIsCompletedFalse();

    Optional<Classes> findByClassId(Integer classId);

    Page<Classes> findByClassNameContaining(
            String keyword,
            Pageable pageable
    );
}