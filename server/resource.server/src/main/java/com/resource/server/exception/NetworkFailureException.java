package com.resource.server.exception;

public class NetworkFailureException extends RuntimeException {
    public NetworkFailureException(String message) {
        super(message);
    }
}
