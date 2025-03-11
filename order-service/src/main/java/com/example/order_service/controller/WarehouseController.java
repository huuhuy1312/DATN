package com.example.order_service.controller;

import com.example.order_service.dto.WarehouseDto;
import com.example.order_service.dto.request.AddAccountRequest;
import com.example.order_service.dto.response.StaticWarehouseResponse;
import com.example.order_service.entity.Address;
import com.example.order_service.entity.Warehouse;
import com.example.order_service.repository.AddressRepository;
import com.example.order_service.repository.WarehouseRepository;
import com.example.order_service.service.WarehouseService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/warehouse")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class WarehouseController {

    private final WarehouseService warehouseService;
    private final AddressRepository addressRepository;
    private final WarehouseRepository warehouseRepository;
    private final RestTemplate restTemplate;
    @GetMapping("/static-admin")
    public ResponseEntity<?> staticAdmin() throws JsonProcessingException {
        return ResponseEntity.ok(warehouseService.staticShipProviderAdmin());
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll(){
        return ResponseEntity.ok(warehouseRepository.findAll());
    }
    @PostMapping("/save")
    public ResponseEntity<?> saveWarehouse(@RequestBody WarehouseDto request){
        if(ObjectUtils.isEmpty(request.id))
        {
            //Save address
            Address address = new Address(request.city,request.district,request.ward,request.addressDetails,request.nameUser,request.phoneNumberUser);
            address=addressRepository.save(address);
            //Save account
            AddAccountRequest addAccountRequest = new AddAccountRequest(request.username, request.password);
            String url = "http://localhost:8080/api/auth/save-account-warehouse";

            // Tạo HttpEntity chứa body
            HttpEntity<AddAccountRequest> requestEntity = new HttpEntity<>(addAccountRequest);

            ResponseEntity<Long> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity, // Sử dụng HttpEntity làm tham số
                    Long.class // Kiểu dữ liệu trả về
            );

            Long idAccount = response.getBody();
            Warehouse warehouse = new Warehouse(request.nameUser,address,true,idAccount);
            warehouseRepository.save(warehouse);
        }else{
            Warehouse warehouse = warehouseRepository.findById(request.id).get();
            warehouse.setName(request.nameUser);
            warehouseRepository.save(warehouse);
            Address address = warehouse.getAddress();
            address.setPhoneNumberUser(request.phoneNumberUser);
            address.setNameUser(request.nameUser);
            address.setCity(request.city);
            address.setWard(request.ward);
            address.setDistrict(request.district);
            address.setAddressDetails(request.addressDetails);
            addressRepository.save(address);
            if(!ObjectUtils.isEmpty(request.changePassword)){
                AddAccountRequest addAccountRequest = new AddAccountRequest(warehouse.getIdAccount(),request.username, request.changePassword);
                String url = "http://localhost:8080/api/auth/save-account-warehouse";
                HttpEntity<AddAccountRequest> requestEntity = new HttpEntity<>(addAccountRequest);
                ResponseEntity<Long> response = restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        requestEntity, // Sử dụng HttpEntity làm tham số
                        Long.class // Kiểu dữ liệu trả về
                );
            }
        }
        return ResponseEntity.ok("Lưu thông tin kho thành công");
    }
//    public ResponseEntity<List<StaticWarehouseResponse>> staticWarehouseAmin(){
//        return ResponseEntity.ok(warehouseService.staticWarehouseAdmin());
//    }

    @DeleteMapping("/delete-by-id")
    public ResponseEntity<?> deleteById(@RequestParam("id") Long id)
    {
        warehouseRepository.deleteById(id);
        return ResponseEntity.ok("Xóa kho hàng thành công");
    }
}
