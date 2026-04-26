package com.checkmate.team1.dto;

import com.checkmate.team1.entity.Notice;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Getter
@Builder
public class AdminNoticeListResponse {

    private List<Item> items;
    private int page;
    private int size;
    private long totalCount;
    private long openCount;

    @Getter
    @Builder
    public static class Item {

        private Long displayNo;
        private Integer noticeId;
        private String title;
        private LocalDate createdDate;
        private Boolean isOpen;
        private String openStatusName;
    }

    public static AdminNoticeListResponse from(
            Page<Notice> noticePage,
            long openCount,
            int requestPage,
            int size
    ) {
        long totalCount = noticePage.getTotalElements();
        AtomicInteger index = new AtomicInteger(0);

        List<Item> items = noticePage.getContent()
                .stream()
                .map(notice -> {
                    long displayNo =
                            totalCount - ((long) (requestPage - 1) * size) - index.getAndIncrement();

                    return Item.builder()
                            .displayNo(displayNo)
                            .noticeId(notice.getNoticeId())
                            .title(notice.getTitle())
                            .createdDate(notice.getCreatedDate())
                            .isOpen(notice.getIsOpen())
                            .openStatusName(Boolean.TRUE.equals(notice.getIsOpen()) ? "공개" : "비공개")
                            .build();
                })
                .toList();

        return AdminNoticeListResponse.builder()
                .items(items)
                .page(requestPage)
                .size(size)
                .totalCount(totalCount)
                .openCount(openCount)
                .build();
    }
}