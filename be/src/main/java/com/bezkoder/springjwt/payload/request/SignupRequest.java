package com.bezkoder.springjwt.payload.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
  @NotBlank
  private String fullName;

  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  private String role;

  private String phoneNumber;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;

  @NotBlank
  private String gender;

}
