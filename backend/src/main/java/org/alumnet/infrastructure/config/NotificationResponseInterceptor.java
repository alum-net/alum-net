package org.alumnet.infrastructure.config;

import org.alumnet.application.dtos.responses.ResultResponse;
import org.alumnet.application.dtos.responses.WebNotificationDTO;
import org.alumnet.application.services.NotificationService;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

@RestControllerAdvice
public class NotificationResponseInterceptor implements ResponseBodyAdvice<Object> {

    private final NotificationService notificationService;

    public NotificationResponseInterceptor(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        Class<?> bodyType = returnType.getParameterType();

        if (ResultResponse.class.isAssignableFrom(bodyType)) {
            return true;
        }

        if (ResponseEntity.class.isAssignableFrom(bodyType)) {
            Type genericType = returnType.getGenericParameterType();
            if (genericType instanceof ParameterizedType) {
                ParameterizedType parameterizedType = (ParameterizedType) genericType;
                Type[] actualTypes = parameterizedType.getActualTypeArguments();

                if (actualTypes.length > 0) {
                    Type innerType = actualTypes[0];

                    // 1. Si el tipo interno es una clase simple (ej. ResponseEntity<String>)
                    if (innerType instanceof Class<?> innerClass) {
                        return ResultResponse.class.isAssignableFrom(innerClass);
                    }

                    // 2. Si el tipo interno es otro genérico (ej. ResponseEntity<ResultResponse<T>>)
                    if (innerType instanceof ParameterizedType innerParameterizedType) {
                        // **ESTA ES LA CORRECCIÓN CLAVE**
                        Class<?> rawType = (Class<?>) innerParameterizedType.getRawType();
                        return ResultResponse.class.isAssignableFrom(rawType);
                    }
                }
            }
        }

        return false;
    }

    @Override
    public Object beforeBodyWrite(
            Object body,
            MethodParameter returnType,
            MediaType selectedContentType,
            Class<? extends HttpMessageConverter<?>> selectedConverterType,
            ServerHttpRequest request,
            ServerHttpResponse response) {

        if (body instanceof ResultResponse<?> resultResponse) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null) {
                String userEmail = authentication.getName();

                List<WebNotificationDTO> notifications = notificationService.getAndMarkPendingWebNotifications(userEmail);

                if (!notifications.isEmpty()) {
                    resultResponse.setNotifications(notifications);
                }
            }
            return resultResponse;
        }

        return body;
    }
}