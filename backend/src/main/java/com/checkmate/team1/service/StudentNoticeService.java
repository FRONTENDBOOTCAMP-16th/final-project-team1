package com.checkmate.team1.service;

import com.checkmate.team1.dto.StudentNoticeDetailResponse;
import com.checkmate.team1.dto.StudentNoticeListResponse;
import com.checkmate.team1.entity.Notice;
import com.checkmate.team1.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentNoticeService {

    private final NoticeRepository noticeRepository;

    public StudentNoticeListResponse getNotices(
            int page,
            int size,
            String keyword
    ) {
        int pageIndex = page - 1;

        PageRequest pageRequest = PageRequest.of(pageIndex, size);

        Page<Notice> noticePage;

        if (keyword == null || keyword.isBlank()) {
            noticePage = noticeRepository.findByIsOpenTrueAndIsDeletedFalse(pageRequest);
        } else {
            noticePage = noticeRepository.findByIsOpenTrueAndIsDeletedFalseAndTitleContaining(
                    keyword,
                    pageRequest
            );
        }

        return StudentNoticeListResponse.from(
                noticePage,
                page,
                size
        );
    }

    public StudentNoticeDetailResponse getNoticeDetail(Integer noticeId) {

        Notice notice =
                noticeRepository
                        .findByNoticeIdAndIsOpenTrueAndIsDeletedFalse(noticeId)
                        .orElse(null);

        if (notice == null) {

            return StudentNoticeDetailResponse.builder()
                    .noticeId(null)
                    .title(null)
                    .content(null)
                    .createdDate(null)
                    .message("조회할 수 없는 공지사항입니다.")
                    .build();
        }

        return StudentNoticeDetailResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .createdDate(notice.getCreatedDate())
                .message("공지사항 상세 조회 성공")
                .build();
    }
}