package com.example.order_service.service;

import com.example.order_service.dto.request.AddAddressRequest;
import com.example.order_service.dto.response.WarehouseWithDistanceResponse;
import com.example.order_service.entity.Address;
import com.example.order_service.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {
    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;
    public List<Address> findByCustomerId(Long customerId){
        return addressRepository.findByCustomerId(customerId);
    }

    public Address findBySellerId(Long sellerId){
        return addressRepository.findBySellerId(sellerId);
    }
    public Page<WarehouseWithDistanceResponse> findAddressNearAddress(Long addressId, Pageable pageable){
        Address addressSource = addressRepository.findById(addressId).orElseThrow(()->new RuntimeException("Not found address with id="+addressId));
        return addressRepository.findAddressNearAddress(addressSource.getLongitude(),addressSource.getLatitude(),pageable);
    }

    @Transactional
    public void add(AddAddressRequest addAddressRequest) {
        if(ObjectUtils.isEmpty(addAddressRequest.getId()))
        {
            Address address = modelMapper.map(addAddressRequest,Address.class);
            addressRepository.save(address);
        }else{
            Address address = addressRepository.findById(addAddressRequest.getId()).orElseThrow(
                    ()->new RuntimeException("Not found Address with id="+addAddressRequest.id)
            );


            if(addAddressRequest.getIsDefault())
            {
                addressRepository.updateDefaultAddress(addAddressRequest.getId(),addAddressRequest.customerId);
            }else{
                address.setCity(addAddressRequest.city);
                address.setDistrict(addAddressRequest.getDistrict());
                address.setWard(addAddressRequest.getWard());
                address.setAddressDetails(addAddressRequest.getAddressDetails());
                address.setNameUser(addAddressRequest.getNameUser());
                address.setPhoneNumberUser(addAddressRequest.getPhoneNumberUser());
                address.setIsDeleted(addAddressRequest.getIsDeleted());
                Address address1 =addressRepository.save(address);
            }
        }


    }



}
