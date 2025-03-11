package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Account;
import com.bezkoder.springjwt.models.Customer;
import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.Role;
import com.bezkoder.springjwt.payload.request.LoginRequest;
import com.bezkoder.springjwt.payload.request.SignupRequest;
import com.bezkoder.springjwt.payload.response.*;
import com.bezkoder.springjwt.repository.AccountRepository;
import com.bezkoder.springjwt.repository.CustomerRepository;
import com.bezkoder.springjwt.repository.RoleRepository;
import com.bezkoder.springjwt.security.jwt.JwtUtils;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;
import com.bezkoder.springjwt.services.OTPServices;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private RestTemplate restTemplate;
  @Autowired
  AuthenticationManager authenticationManager;
  @Autowired
  CustomerRepository customerRepository;
  @Autowired
  private OTPServices otpServices;

  @Autowired
  private AccountRepository accountRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    String role = String.valueOf(userDetails.getAuthorities().stream().findFirst().get());
    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(),
                          role));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (accountRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    Account account = new Account(signUpRequest.getUsername(),
               encoder.encode(signUpRequest.getPassword()));
    Role role  = roleRepository.findByName(ERole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));;
    account.setRole(role);
    accountRepository.save(account);
    Customer customer = new Customer(signUpRequest.getFullName(),signUpRequest.getEmail(),signUpRequest.getPhoneNumber(),signUpRequest.getGender(),account);
    customerRepository.save(customer);
    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
  @PostMapping("/save-account-warehouse")
  public ResponseEntity<?> saveAccountWarehouse(@Valid @RequestBody AccountResponse  signupRequest)
  {
    if(ObjectUtils.isEmpty(signupRequest.id)) {
      if (accountRepository.existsByUsername(signupRequest.getUsername())) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
      }
      Account account = new Account(signupRequest.getUsername(), encoder.encode(signupRequest.getPassword()));
      Role role = roleRepository.findByName(ERole.ROLE_WAREHOUSE_OWNER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      account.setRole(role);
      account = accountRepository.save(account);
      return ResponseEntity.ok(account.getId());
    }else{
      Account account = accountRepository.findById(signupRequest.id).get();
      account.setUsername(signupRequest.username);
      account.setPassword(encoder.encode(signupRequest.password));
      account = accountRepository.save(account);
      return ResponseEntity.ok(account.getId());
    }
  }

  @PostMapping("/save-account-shipper")
  public ResponseEntity<?> saveAccountShipper(@Valid @RequestBody AccountResponse  signupRequest)
  {
    if(ObjectUtils.isEmpty(signupRequest.id)) {
      if (accountRepository.existsByUsername(signupRequest.getUsername())) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
      }
      Account account = new Account(signupRequest.getUsername(), encoder.encode(signupRequest.getPassword()));
      Role role = roleRepository.findByName(ERole.ROLE_SHIPPER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      account.setRole(role);
      account = accountRepository.save(account);
      return ResponseEntity.ok(account.getId());
    }else{
      Account account = accountRepository.findById(signupRequest.id).get();
      account.setUsername(signupRequest.username);
      account.setPassword(encoder.encode(signupRequest.password));
      account = accountRepository.save(account);
      return ResponseEntity.ok(account.getId());
    }
  }
  @PostMapping("/check-otp-register")
  public ResponseEntity<ResponseObject> checkOtpRegister(@RequestParam(name = "name") String name, @RequestParam(name = "code") String code){
    otpServices.checkOTPRegister(code,name);
    return ResponseEntity.ok(new ResponseObject(HttpStatus.OK,200,"OTP Hợp lệ",null));
  }
  @GetMapping("/get-info-by-ids")
  public ResponseEntity<List<UserInfoResponse>> getShopNameByIds(@RequestParam(name="ids") List<Long> ids){
    List<Account> accounts = accountRepository.findAllById(ids);
    List<UserInfoResponse> userInfoResponses = new ArrayList<>();
    for (Account account:accounts){
      if(account.getRole().getName() == ERole.ROLE_SELLER){
        String url2 = "http://localhost:8020/file/get-images?objectId=" + account.getSeller().getId() + "&objectName=SellerEntity";
        List<String> image = null;

        try {
          image = restTemplate.exchange(
                  url2,
                  HttpMethod.GET,
                  null,
                  new ParameterizedTypeReference<List<String>>() {}
          ).getBody();
        } catch (Exception e) {
          // Xử lý lỗi hoặc ghi log
          System.err.println("Request failed: " + e.getMessage());
        }

        String imageUrl = (image != null && !image.isEmpty()) ? image.get(0) : null;
        userInfoResponses.add(new UserInfoResponse(account.getId(), account.getSeller().getShopName(), imageUrl));

      }else{
        String url2 = "http://localhost:8020/file/get-images?objectId=" + account.getCustomer().getId() + "&objectName=CustomerEntity";
        List<String> image = null;

        try {
          image = restTemplate.exchange(
                  url2,
                  HttpMethod.GET,
                  null,
                  new ParameterizedTypeReference<List<String>>() {}
          ).getBody();
        } catch (Exception e) {
          // Ghi log hoặc xử lý lỗi
          System.err.println("Request failed: " + e.getMessage());
        }

        String imageUrl = (image != null && !image.isEmpty()) ? image.get(0) : null;
        userInfoResponses.add(new UserInfoResponse(account.getId(), account.getCustomer().getFullName(), imageUrl));

      }
    }
    return ResponseEntity.ok(userInfoResponses);
  }

  @GetMapping("/get-account-info-by-ids")
  public ResponseEntity<List<AccountResponse>> getAccountInfoByIds(@RequestParam("ids")List<Long> ids)
  {
    List<Account> accounts = accountRepository.findAllById(ids);
    List<AccountResponse> responses = new ArrayList<>();
    for (Account account: accounts)
    {
      AccountResponse response = new AccountResponse();
      response.setId(account.getId());
      response.setUsername(account.getUsername());
      response.setPassword(account.getPassword());
      responses.add(response);
    }
    return ResponseEntity.ok(responses);
  }
}
