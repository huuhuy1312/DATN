package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Customer;
import com.bezkoder.springjwt.payload.response.CustomerResponse;
import com.bezkoder.springjwt.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;
    @GetMapping("/get-info")
    public ResponseEntity<CustomerResponse> getInfoShip(@RequestParam(name = "customerId")Long customerId)
    {
        Customer customer = customerRepository.findByAccountId(customerId);
        CustomerResponse  customerResponse = new CustomerResponse(
                customerId,
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhoneNumber(),
                customer.getGender(),
                customer.getAccount().getUsername(),
                customer.getAccount().getId()
        );
        return ResponseEntity.ok(customerResponse);
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAll (){
        List<Customer> customerList = customerRepository.findAll();
        List<CustomerResponse> responses = new ArrayList<>();
        for (Customer customer: customerList){
            responses.add(new CustomerResponse(
                    customer.getId(),
                    customer.getFullName(),
                    customer.getEmail(),
                    customer.getPhoneNumber(),
                    customer.getGender(),
                    customer.getAccount().getUsername(),
                    customer.getAccount().getId()
            ));

        }
        return ResponseEntity.ok(responses);

    }
}
