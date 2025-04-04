package com.darkdragon.capstone.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BoardController {

    @GetMapping("/api/data")
    public String testData() {
        return "Hello World";
    }
}
