package org.alumnet.application.dtos.responses;

import java.util.Optional;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OneSignalCreateNotificationDTO {
  private Optional<String> id;
  private Optional<String> external_id;
}
