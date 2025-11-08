package org.alumnet.application.mapper;

import org.alumnet.application.dtos.responses.UserActivityLogDTO;
import org.alumnet.domain.UserActivityLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ActivityMapper {

    @Mapping(source = "user.email", target = "userEmail") // Mapea el email del usuario
    UserActivityLogDTO toUserActivityLogDTO(UserActivityLog source);
}