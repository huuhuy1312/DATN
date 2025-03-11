package com.bezkoder.springjwt.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String username;
  private String role;

  public JwtResponse(String accessToken, Long id, String username, String role) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.role = role;
  }



}
