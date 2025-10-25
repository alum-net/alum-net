package org.alumnet.application.dtos.responses;

import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class PageableResultResponse<T> extends ResultResponse <List<T>>{
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;

    public static <E, D> PageableResultResponse<D> fromPage(
            Page<E> page,
            List<D> content,
            String message) {

        PageableResultResponse<D> response = new PageableResultResponse<>();

        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());

        response.setMessage(message);
        response.setData(content);

        return response;
    }
}
