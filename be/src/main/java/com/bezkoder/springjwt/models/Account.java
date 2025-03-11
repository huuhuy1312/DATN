package com.bezkoder.springjwt.models;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Setter
@Table(name = "accounts",
    uniqueConstraints = { 
      @UniqueConstraint(columnNames = "username")
    })
public class Account {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;


  @NotBlank
  @Size(max = 120)
  private String password;

  @OneToOne
  @JoinColumn(name = "role_id")
  private Role role;

  @OneToOne(mappedBy = "account")
  private Customer customer;

  @OneToOne(mappedBy = "account")
  private Seller seller;

  public Account() {
  }

  public Account(String username, String password) {
    this.username = username;
    this.password = password;
  }

}
