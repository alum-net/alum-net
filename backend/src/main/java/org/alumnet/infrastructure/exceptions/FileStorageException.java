package org.alumnet.infrastructure.exceptions;


import lombok.Getter;

@Getter
public class FileStorageException extends FileException {
    private final String action;

    public FileStorageException(String message, String action) {
        super(message);
        this.action = action;
    }
}
