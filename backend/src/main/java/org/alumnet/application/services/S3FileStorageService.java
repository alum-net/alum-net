package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.alumnet.infrastructure.config.AmazonS3Config;
import org.alumnet.infrastructure.exceptions.FileStorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.ServerSideEncryption;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3FileStorageService {

    private final S3Client s3Client;
    private final AmazonS3Config.S3Properties s3Properties;

    public void store(MultipartFile file) throws FileStorageException {
        try {
            String key = generateS3Key(file.getOriginalFilename());

            Map<String, String> metadata = Map.of(
                    "original-filename", file.getOriginalFilename(),
                    "content-type", file.getContentType()
            );

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(s3Properties.getBucketName())
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .metadata(metadata)
                    .serverSideEncryption(ServerSideEncryption.AES256)
                    .build();

            RequestBody requestBody = RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()
            );

            PutObjectResponse response = s3Client.putObject(putRequest, requestBody);

            log.info("Archivo subido exitosamente a S3: bucket={}, key={}, etag={}",
                    s3Properties.getBucketName(), key, response.eTag());


        } catch (Exception e) {
            log.error("Error subiendo archivo a S3: {}", file.getOriginalFilename(), e);
            throw new FileStorageException(String.format("Error almacenando archivo en S3: %s", file.getOriginalFilename()), "upload");
        }
    }
    private String generateS3Key(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String uniqueId = UUID.randomUUID().toString();

        return String.format("%s_%s",
                uniqueId,
                extension.isEmpty() ? "" : "." + extension
        );
    }


    private String getFileExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf(".") + 1))
                .orElse("");
    }
}
