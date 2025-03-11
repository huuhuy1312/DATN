package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "otps")
public class OTPs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "action")
    private String action;

    @Column(name = "info_related")
    private String infoRelated;

    @Column(name = "is_actived")
    private boolean isActived ;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Timestamp createdAt;  // ánh xạ TIMESTAMP thành Timestamp

    public OTPs(String otpCode, String action, String infoRelated,boolean isActived) {
        this.otpCode = otpCode;
        this.action = action;
        this.infoRelated = infoRelated;
        this.isActived = isActived;
    }
}
