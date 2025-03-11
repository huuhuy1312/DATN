package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.services.EmailServices;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {
    private final EmailServices emailServices;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@Valid @Email @RequestParam("email") String email){
        emailServices.sendEmailOTP(email);
        return ResponseEntity.ok("Gửi Email thành công");
    }

}
