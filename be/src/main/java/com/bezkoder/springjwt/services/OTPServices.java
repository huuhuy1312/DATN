package com.bezkoder.springjwt.services;

import com.bezkoder.springjwt.repository.OTPRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OTPServices {
    private final OTPRepository otpRepository;

    public void checkOTPRegister(String code, String email) {
        System.out.println(code);
        System.out.println(email);
        if (otpRepository.checkOTPRegister(code, email) == null) {
            throw new RuntimeException("OTP không hợp lệ hoặc đã hết hạn."); // Thông báo lỗi cụ thể
        }
    }

}
