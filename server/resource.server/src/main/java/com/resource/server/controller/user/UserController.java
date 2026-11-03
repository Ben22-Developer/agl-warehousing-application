package com.resource.server.controller.user;

import com.resource.server.entity.user.*;
import com.resource.server.service.user.*;
import lombok.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/secure/user")
    public UserProfile getUserProfile () {
        return userService.getContextUserProfile();
    }

}
