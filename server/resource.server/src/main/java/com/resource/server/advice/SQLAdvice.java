package com.resource.server.advice;

import com.resource.server.exception.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class SQLAdvice {

    @ExceptionHandler
    public ResponseEntity<?> handleItemNotFoundException(ItemNotFoundException ex)
    {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    public ResponseEntity<?> handleItemNotCreatedException(ItemsNotCreatedException ex)
    {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_IMPLEMENTED);
    }
}
