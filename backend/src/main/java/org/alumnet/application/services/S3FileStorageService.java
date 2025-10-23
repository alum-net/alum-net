package org.alumnet.application.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.alumnet.infrastructure.config.AmazonS3Config;
import org.alumnet.infrastructure.exceptions.FileStorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.ServerSideEncryption;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3FileStorageService {

    private final S3Client s3Client;
    private final AmazonS3Config.S3Properties s3Properties;
    private final S3Presigner s3Presigner;

    public String store(MultipartFile file, String fileExtension, String filePath) throws FileStorageException {
        try {
            String key = generateS3Key(fileExtension,filePath);

            Map<String, String> metadata = Map.of(
                    "original-filename", file.getOriginalFilename(),
                    "content-type", file.getContentType()
            );

            PutObjectResponse response = s3Client.putObject(createPutObjectRequest(file, key, metadata), createAWSrequestBody(file));

            log.info("Archivo subido exitosamente a S3: bucket={}, key={}, etag={}",
                    s3Properties.getBucketName(), key, response.eTag());

            return key;

        } catch (Exception e) {
            log.error("Error subiendo archivo a S3: {}", file.getOriginalFilename(), e);
            throw new FileStorageException(
                    String.format("Error almacenando archivo en S3: %s", file.getOriginalFilename()),
                    "upload"
            );
        }
    }

    private static RequestBody createAWSrequestBody(MultipartFile file) throws IOException {
        return RequestBody.fromInputStream(
                file.getInputStream(), file.getSize()
        );
    }

    private PutObjectRequest createPutObjectRequest(MultipartFile file, String key, Map<String, String> metadata) {
        return PutObjectRequest.builder()
                .bucket(s3Properties.getBucketName())
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .metadata(metadata)
                .serverSideEncryption(ServerSideEncryption.AES256)
                .build();
    }

    private String generateS3Key(String fileExtension,String filePath) {
        String uniqueId = UUID.randomUUID().toString();

        return String.format("%s/%s_%s",
                filePath,uniqueId,
                fileExtension.isEmpty() ? "" : "." + fileExtension
        );
    }
    public String generatePresignedUrl(String key, Duration expiration) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(s3Properties.getBucketName())
                .key(key)
                .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(r ->
                r.signatureDuration(expiration)
                        .getObjectRequest(getObjectRequest));

        return presignedRequest.url().toString();
    }
}
