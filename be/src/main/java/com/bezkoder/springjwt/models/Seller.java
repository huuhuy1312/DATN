package com.bezkoder.springjwt.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "seller")
public class Seller {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @Column(name="email",nullable = false)
    private String email;

    @Column(name="phone_number",nullable = false)
    private String phoneNumber;

    private String CIN;
    private String fullName;
    @OneToOne
    @JoinColumn(name = "account_id")
    @JsonIgnore
    private Account account;

    private LocalDateTime createdAt;
    private Boolean isActive;

    private String reasonLock;

    private LocalDateTime dateLock;
    private Boolean isDeleted=false;

}
