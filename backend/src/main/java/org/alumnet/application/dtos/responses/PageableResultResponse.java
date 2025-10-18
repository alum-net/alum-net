package org.alumnet.application.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

        response.setSuccess(true);
        response.setMessage(message);
        response.setData(content);

        return response;
    }
}
