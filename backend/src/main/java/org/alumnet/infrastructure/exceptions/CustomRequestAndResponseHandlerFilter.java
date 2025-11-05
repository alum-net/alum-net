package org.alumnet.infrastructure.exceptions;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;

@Component
@Order(1)
public class CustomRequestAndResponseHandlerFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(CustomRequestAndResponseHandlerFilter.class);
    private static final int MAX_PAYLOAD_LENGTH = 1000;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        boolean isMultipart = isMultipartRequest(httpRequest);

        if (isMultipart) {
            logMultipartRequest(httpRequest);

            ContentCachingResponseWrapper responseWrapper =
                    new ContentCachingResponseWrapper(httpResponse);

            try {
                chain.doFilter(httpRequest, responseWrapper);
            } finally {
                logResponse(httpRequest, responseWrapper);
                responseWrapper.copyBodyToResponse();
            }
        } else {
            ContentCachingRequestWrapper requestWrapper =
                    new ContentCachingRequestWrapper(httpRequest, MAX_PAYLOAD_LENGTH);
            ContentCachingResponseWrapper responseWrapper =
                    new ContentCachingResponseWrapper(httpResponse);

            try {
                logRequest(requestWrapper);
                chain.doFilter(requestWrapper, responseWrapper);
            } finally {
                logResponse(requestWrapper, responseWrapper);
                responseWrapper.copyBodyToResponse();
            }
        }
    }

    private boolean isMultipartRequest(HttpServletRequest request) {
        String contentType = request.getContentType();
        return contentType != null && contentType.toLowerCase().startsWith("multipart/");
    }

    private void logMultipartRequest(HttpServletRequest request) {
        logger.info("═══════════════════════════════════════════════════");
        logger.info("Incoming MULTIPART Request: [{}] {}", request.getMethod(), request.getRequestURI());
        logger.info("═══════════════════════════════════════════════════");

        logHeaders(request);

        try {
            Collection<Part> parts = request.getParts();
            logger.info("Total Parts: {}", parts.size());
            logger.info("---------------------------------------------------");

            int partIndex = 0;
            for (Part part : parts) {
                partIndex++;
                logPart(part, partIndex);
            }
        } catch (Exception e) {
            logger.error("Error reading multipart parts: {}", e.getMessage());
        }

        logger.info("═══════════════════════════════════════════════════");
    }

    private void logPart(Part part, int index) throws IOException {
        String partName = part.getName();
        String fileName = part.getSubmittedFileName();
        String contentType = part.getContentType();
        long size = part.getSize();

        logger.info("Part #{}: {}", index, partName);

        if (fileName != null && !fileName.isEmpty()) {
            logger.info("  ├─ Type: FILE");
            logger.info("  ├─ Filename: {}", fileName);
            logger.info("  ├─ Content-Type: {}", contentType);
            logger.info("  ├─ Size: {} bytes ({} KB)", size, String.format("%.2f", size / 1024.0));


            String extension = getFileExtension(fileName);
            if (extension != null) {
                logger.info("  ├─ Extension: {}", extension);
            }

            for (String headerName : part.getHeaderNames()) {
                logger.info("  ├─ Header [{}]: {}", headerName, part.getHeader(headerName));
            }

            logger.info("  └─ [File content not logged - too large]");
        } else {

            logger.info("  ├─ Type: FORM FIELD");

            String value = new String(part.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            if (value.length() > MAX_PAYLOAD_LENGTH) {
                value = value.substring(0, MAX_PAYLOAD_LENGTH) + "... (truncated)";
            }

            logger.info("  └─ Value: {}", value);
        }

        logger.info("---------------------------------------------------");
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < fileName.length() - 1) {
            return fileName.substring(lastDotIndex + 1).toLowerCase();
        }
        return null;
    }

    private void logRequest(ContentCachingRequestWrapper request) {
        logger.info("═══════════════════════════════════════════════════");
        logger.info("Incoming Request: [{}] {}", request.getMethod(), request.getRequestURI());
        logger.info("═══════════════════════════════════════════════════");

        logHeaders(request);

        // Log request body
        byte[] content = request.getContentAsByteArray();
        if (content.length > 0) {
            String body = new String(content, StandardCharsets.UTF_8);
            if (body.length() > MAX_PAYLOAD_LENGTH) {
                body = body.substring(0, MAX_PAYLOAD_LENGTH) + "... (truncated)";
            }
            logger.info("Request Body: {}", body);
        }

        logger.info("═══════════════════════════════════════════════════");
    }

    private void logHeaders(HttpServletRequest request) {
        logger.info("Headers:");
        request.getHeaderNames().asIterator().forEachRemaining(header -> {
            String value = request.getHeader(header);
            if (isSensitiveHeader(header)) {
                value = "***MASKED***";
            }
            logger.info("  ├─ {}: {}", header, value);
        });
    }

    private void logResponse(HttpServletRequest request, ContentCachingResponseWrapper response) {
        logger.info("═══════════════════════════════════════════════════");
        logger.info("Outgoing Response for [{}] {}: Status = {}",
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus());
        logger.info("═══════════════════════════════════════════════════");

        // Log response body
        byte[] content = response.getContentAsByteArray();
        if (content.length > 0) {
            String body = new String(content, StandardCharsets.UTF_8);
            if (body.length() > MAX_PAYLOAD_LENGTH) {
                body = body.substring(0, MAX_PAYLOAD_LENGTH) + "... (truncated)";
            }
            logger.info("Response Body: {}", body);
        }

        logger.info("═══════════════════════════════════════════════════");
    }

    private boolean isSensitiveHeader(String headerName) {
        String lowerCaseHeader = headerName.toLowerCase();
        return lowerCaseHeader.contains("authorization") ||
                lowerCaseHeader.contains("password") ||
                lowerCaseHeader.contains("token") ||
                lowerCaseHeader.contains("secret") ||
                lowerCaseHeader.contains("api-key") ||
                lowerCaseHeader.contains("cookie");
    }
}
