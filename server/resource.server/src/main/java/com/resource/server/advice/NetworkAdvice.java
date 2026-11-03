package com.resource.server.advice;

import com.resource.server.exception.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class NetworkAdvice {

    @ExceptionHandler
    public ResponseEntity<?> handleItemNotCreatedException(NetworkFailureException ex)
    {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.SERVICE_UNAVAILABLE);
    }
}
