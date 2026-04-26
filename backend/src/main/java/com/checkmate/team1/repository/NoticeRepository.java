package com.checkmate.team1.repository;

import com.checkmate.team1.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {

    Page<Notice> findByIsOpenTrueAndIsDeletedFalse(
            Pageable pageable
    );

    Page<Notice> findByIsOpenTrueAndIsDeletedFalseAndTitleContaining(
            String keyword,
            Pageable pageable
    );

    Optional<Notice> findByNoticeIdAndIsOpenTrueAndIsDeletedFalse(Integer noticeId);

    Page<Notice> findByIsDeletedFalse(Pageable pageable);

    Page<Notice> findByIsDeletedFalseAndTitleContaining(
            String keyword,
            Pageable pageable
    );

    long countByIsOpenTrueAndIsDeletedFalse();
}