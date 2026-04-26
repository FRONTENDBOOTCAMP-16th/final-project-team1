package com.checkmate.team1.service;

import com.checkmate.team1.dto.AdminNoticeListResponse;
import com.checkmate.team1.entity.Notice;
import com.checkmate.team1.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.checkmate.team1.dto.AdminNoticeDetailResponse;
import com.checkmate.team1.dto.CreateNoticeRequest;
import com.checkmate.team1.dto.CreateNoticeResponse;
import com.checkmate.team1.dto.UpdateNoticeRequest;
import com.checkmate.team1.dto.UpdateNoticeResponse;
import java.time.LocalDate;
import com.checkmate.team1.dto.DeleteNoticeResponse;

@Service
@RequiredArgsConstructor
public class AdminNoticeService {

    private final NoticeRepository noticeRepository;

    public AdminNoticeListResponse getNotices(
            String keyword,
            int page,
            int size
    ) {
        PageRequest pageRequest = PageRequest.of(page - 1, size);

        Page<Notice> noticePage;

        if (keyword == null || keyword.isBlank()) {
            noticePage = noticeRepository.findByIsDeletedFalse(pageRequest);
        } else {
            noticePage = noticeRepository.findByIsDeletedFalseAndTitleContaining(
                    keyword,
                    pageRequest
            );
        }

        long openCount = noticeRepository.countByIsOpenTrueAndIsDeletedFalse();

        return AdminNoticeListResponse.from(
                noticePage,
                openCount,
                page,
                size
        );
    }

    public AdminNoticeDetailResponse getNoticeDetail(Integer noticeId) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElse(null);

        if (notice == null || Boolean.TRUE.equals(notice.getIsDeleted())) {
            return AdminNoticeDetailResponse.builder()
                    .noticeId(noticeId)
                    .title(null)
                    .content(null)
                    .createdDate(null)
                    .isOpen(null)
                    .openStatusName(null)
                    .message("존재하지 않는 공지사항입니다.")
                    .build();
        }

        return AdminNoticeDetailResponse.builder()
                .noticeId(notice.getNoticeId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .createdDate(notice.getCreatedDate())
                .isOpen(notice.getIsOpen())
                .openStatusName(Boolean.TRUE.equals(notice.getIsOpen()) ? "공개" : "비공개")
                .message("공지사항 상세 조회 성공")
                .build();
    }

    public CreateNoticeResponse createNotice(CreateNoticeRequest request) {

        Notice notice = new Notice(
                request.getTitle(),
                request.getContent(),
                LocalDate.now(),
                true,
                false
        );

        Notice savedNotice = noticeRepository.save(notice);

        return CreateNoticeResponse.builder()
                .noticeId(savedNotice.getNoticeId())
                .title(savedNotice.getTitle())
                .createdDate(savedNotice.getCreatedDate())
                .isOpen(savedNotice.getIsOpen())
                .openStatusName(Boolean.TRUE.equals(savedNotice.getIsOpen()) ? "공개" : "비공개")
                .message("공지사항 등록 성공")
                .build();
    }

    public UpdateNoticeResponse updateNotice(
            Integer noticeId,
            UpdateNoticeRequest request
    ) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElse(null);

        if (notice == null || Boolean.TRUE.equals(notice.getIsDeleted())) {
            return UpdateNoticeResponse.builder()
                    .noticeId(noticeId)
                    .title(null)
                    .createdDate(null)
                    .isOpen(null)
                    .openStatusName(null)
                    .message("존재하지 않는 공지사항입니다.")
                    .build();
        }

        notice.updateNotice(
                request.getTitle(),
                request.getContent(),
                request.getIsOpen()
        );

        Notice savedNotice = noticeRepository.save(notice);

        return UpdateNoticeResponse.builder()
                .noticeId(savedNotice.getNoticeId())
                .title(savedNotice.getTitle())
                .createdDate(savedNotice.getCreatedDate())
                .isOpen(savedNotice.getIsOpen())
                .openStatusName(Boolean.TRUE.equals(savedNotice.getIsOpen()) ? "공개" : "비공개")
                .message("공지사항 수정 성공")
                .build();
    }

    public DeleteNoticeResponse deleteNotice(Integer noticeId) {

        Notice notice = noticeRepository.findById(noticeId)
                .orElse(null);

        if (notice == null || Boolean.TRUE.equals(notice.getIsDeleted())) {

            return DeleteNoticeResponse.builder()
                    .noticeId(noticeId)
                    .message("존재하지 않는 공지사항입니다.")
                    .build();
        }

        notice.deleteNotice();

        noticeRepository.save(notice);

        return DeleteNoticeResponse.builder()
                .noticeId(notice.getNoticeId())
                .message("공지사항 삭제 성공")
                .build();
    }
}