package org.alumnet.infrastructure.exceptions;

public class FileSizeExceededException extends FileException {
    public FileSizeExceededException(String message) {
        super(message);
    }
}
