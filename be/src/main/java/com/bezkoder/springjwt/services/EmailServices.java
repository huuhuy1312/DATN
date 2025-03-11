package com.bezkoder.springjwt.services;

import com.bezkoder.springjwt.models.OTPs;
import com.bezkoder.springjwt.repository.OTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import java.util.Random;

@Service
public class EmailServices {
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;
    @Autowired
    private OTPRepository otpRepository;

    // Method to send email
    public void sendMail(String emailTo, String content, String subject) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(sender);
        mailMessage.setTo(emailTo);
        mailMessage.setText(content);
        mailMessage.setSubject(subject);
        javaMailSender.send(mailMessage);
    }

    // Method to generate a 6-digit OTP
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Generates a number between 100000 and 9999đ
        return String.valueOf(otp);
    }

    // Method to send OTP to user's email
    public void sendEmailOTP(String email) {
        String otp = generateOTP();  // Generate the OTP
        String content = "Mã OTP của bạn là: " + otp + "\nVui lòng sử dụng mã này để hoàn tất xác thực.";
        sendMail(email, content, "Xác thực OTP");  // Send OTP email
        otpRepository.save(new OTPs(otp,"Registration_Verification",email,true));

    }
}
