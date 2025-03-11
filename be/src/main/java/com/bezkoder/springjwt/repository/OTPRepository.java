package com.bezkoder.springjwt.repository;

import com.bezkoder.springjwt.models.OTPs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OTPRepository  extends JpaRepository<OTPs,Long> {

    @Query(value = "SELECT * \n" +
            "FROM otps \n" +
            "WHERE action = 'Registration_Verification' \n" +
            "AND otp_code = :code\n" +
            "AND info_related = :email\n" +
            "AND is_actived = 1 \n" +
            "AND DATE_ADD(created_at, INTERVAL 5 MINUTE) >= CURRENT_TIME();",nativeQuery = true)
    OTPs checkOTPRegister(@Param(value = "code") String code, @Param(value = "email")String email);
}