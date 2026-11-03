package com.authorization.server.controller;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
//@RequestMapping("/api/v1/all")
public class MyController
{
    @GetMapping("/login")
    public String login() {
        return "login";
    }
}
