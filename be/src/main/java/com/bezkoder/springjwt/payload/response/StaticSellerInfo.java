package com.bezkoder.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class StaticSellerInfo {
    public Long id;
    public String ownerName;
    public String phoneNumber;
    public String shopName;
    public LocalDateTime createdAt;
    public Boolean isActive;
    public Boolean isDeleted;
    public String CIN;
    public String imageCICard;
    public String imageHoldCICard;
    public String reasonLock;
    public LocalDateTime dateLock;

    public Long idAccount;
    public StaticSellerInfo(Long id, String ownerName, String phoneNumber, String shopName, LocalDateTime createdAt, Boolean isActive, Boolean isDeleted) {
        this.id = id;
        this.ownerName = ownerName;
        this.phoneNumber = phoneNumber;
        this.shopName = shopName;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.isDeleted = isDeleted;
    }
}
