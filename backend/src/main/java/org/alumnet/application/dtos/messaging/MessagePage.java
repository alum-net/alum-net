package org.alumnet.application.dtos.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagePage {
    private List<MessageDTO> items;
    private boolean hasMore;
    private long totalUnread;
}