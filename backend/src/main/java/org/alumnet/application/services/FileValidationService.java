package org.alumnet.application.services;

import org.alumnet.infrastructure.exceptions.FileException;
import org.alumnet.infrastructure.exceptions.FileSizeExceededException;
import org.alumnet.infrastructure.exceptions.InvalidExtensionException;
import org.springframework.stereotype.Component;
import org.springframework.util.InvalidMimeTypeException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class FileValidationService {
    private static final Map<String, List<String>> ALLOWED_EXTENSIONS = Map.of(
            "pdf", List.of("application/pdf"),
            "pptx", List.of("application/vnd.openxmlformats-officedocument.presentationml.presentation"),
            "xlsx", List.of("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
            "mp4", List.of("video/mp4"),
            "jpg", List.of("image/jpeg"),
            "jpeg", List.of("image/jpeg"),
            "png", List.of("image/png"),
            "docx", List.of("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
            "doc", List.of("application/msword"),
            "zip", List.of("application/zip", "application/x-zip-compressed")
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public void validateFiles(List<MultipartFile> files) throws FileException {
        for (MultipartFile file : files) {
            validateFile(file);
        }
    }

    private void validateFile(MultipartFile file) throws FileException {
        String extension = getFileExtension(file.getOriginalFilename());
        String contentType = file.getContentType();

        if (!ALLOWED_EXTENSIONS.containsKey(extension.toLowerCase())) {
            throw new InvalidExtensionException(
                    String.format("Extensión '%s' no permitida. Extensiones válidas: %s",
                            extension, ALLOWED_EXTENSIONS.keySet())
            );
        }

        if (contentType != null && !ALLOWED_EXTENSIONS.get(extension.toLowerCase()).contains(contentType)) {
            throw new InvalidMimeTypeException(contentType,
                    String.format("Tipo MIME '%s' no coincide con la extensión '%s'", contentType, extension)
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileSizeExceededException(
                    String.format("El archivo '%s' excede el tamaño máximo de %d MB",
                            file.getOriginalFilename(), MAX_FILE_SIZE / (1024 * 1024))
            );
        }
    }

    private String getFileExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1))
                .orElse("");
    }
}