package com.example.order_service.service;

import com.example.order_service.dto.ShipperDto;
import com.example.order_service.dto.request.AddAccountRequest;
import com.example.order_service.dto.response.AccountResponse;
import com.example.order_service.dto.response.StaticShipperResponse;
import com.example.order_service.entity.Shipper;
import com.example.order_service.repository.ShipperRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShipperService {
    private final ShipperRepository shipperRepository;
    private final RestTemplate restTemplate;
    public List<StaticShipperResponse> convertShipperToStaticShipperResponse(List<Shipper> shippers)
    {
        String idsParam = shippers.stream()
                .map(shipper -> String.valueOf(shipper.getIdAccount()))  // Chuyển Long thành String
                .collect(Collectors.joining(","));
        String url = "http://localhost:8020/api/auth/get-account-info-by-ids?ids=" + idsParam;
        ResponseEntity<List<AccountResponse>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<AccountResponse>>() {}
        );
        List<AccountResponse> accountResponses = response.getBody();
        List<StaticShipperResponse> responses = new ArrayList<>();
        for (Shipper shipper : shippers) {
            StaticShipperResponse shipperResponse = new StaticShipperResponse();
            shipperResponse.setId(shipper.getId());
            shipperResponse.setCode(shipper.getCode());
            shipperResponse.setName(shipper.getName());
            shipperResponse.setNote(shipper.getNote());
            shipperResponse.setPhoneNumber(shipper.getPhoneNumber());
            shipperResponse.setShippingOrdersCount(shipper.getDeliveryOrderLines().stream()
                    .filter(orderLine -> orderLine.getStatus().equals("Đang vận chuyển tới người nhận")).count());
            shipperResponse.setDoneOrdersCount(shipper.getDeliveryOrderLines().stream()
                    .filter(orderLine -> orderLine.getStatus().equals("Đã hoàn thành")).count());
            shipperResponse.setPickingUpOrdersCount(shipper.getPickupOrderLines().stream()
                    .filter(orderLine -> orderLine.getStatus().equals("Đang lấy hàng")).count());
            for (AccountResponse account : accountResponses) {
                if (shipper.getIdAccount().equals(account.getId())) {
                    shipperResponse.setUsername(account.getUsername());
                    break;
                }
            }
            responses.add(shipperResponse);
        }
        return responses;
    }
    public List<StaticShipperResponse> findByWarehouseId(Long whId){
        return convertShipperToStaticShipperResponse(shipperRepository.findByWarehouseId(whId));
    }

    public List<StaticShipperResponse> findByAccountWarehouseId(Long accountId){
        return convertShipperToStaticShipperResponse(shipperRepository.findByWarehouseIdAccount(accountId));
    }
    public List<StaticShipperResponse> staticByWarehouseId(Long whId) {
        List<Shipper> shippers = shipperRepository.findByWarehouseIdAccount(whId);
        return convertShipperToStaticShipperResponse(shippers);
    }

    public void add(ShipperDto shipperDto) {
        if(ObjectUtils.isEmpty(shipperDto.id)) {
            Shipper shipper = new Shipper();
            if (ObjectUtils.isEmpty(shipperDto.code)) {
                shipper.setCode(shipperRepository.nextCode());
            } else {
                shipper.setCode(shipperDto.code);
            }
            shipper.setName(shipperDto.name);
            shipper.setPhoneNumber(shipperDto.getPhoneNumber());
            AddAccountRequest addAccountRequest = new AddAccountRequest(shipperDto.username, shipperDto.password);
            String url = "http://localhost:8020/api/auth/save-account-shipper";

            // Tạo HttpEntity chứa body
            HttpEntity<AddAccountRequest> requestEntity = new HttpEntity<>(addAccountRequest);

            ResponseEntity<Long> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    requestEntity, // Sử dụng HttpEntity làm tham số
                    Long.class // Kiểu dữ liệu trả về
            );

            Long idAccount = response.getBody();
            shipper.setIdAccount(idAccount);
            shipper.setNote(shipperDto.getNote());
            shipperRepository.save(shipper);
        }else{
            Shipper shipper = shipperRepository.findById(shipperDto.getId()).get();
            shipper.setNote(shipperDto.getNote());
            shipper.setName(shipperDto.name);
            shipper.setPhoneNumber(shipperDto.getPhoneNumber());
            if(!ObjectUtils.isEmpty(shipperDto.newPassword)){
                AddAccountRequest addAccountRequest = new AddAccountRequest(shipper.getIdAccount(),shipperDto.username, shipperDto.newPassword);
                String url = "http://localhost:8080/api/auth/save-account-shipper";
                HttpEntity<AddAccountRequest> requestEntity = new HttpEntity<>(addAccountRequest);
                ResponseEntity<Long> response = restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        requestEntity, // Sử dụng HttpEntity làm tham số
                        Long.class // Kiểu dữ liệu trả về
                );
            }
            shipperRepository.save(shipper);
        }
    }
}
