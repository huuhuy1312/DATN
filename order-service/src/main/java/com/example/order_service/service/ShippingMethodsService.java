package com.example.order_service.service;

import com.example.order_service.dto.ShippingMethodsDto;
import com.example.order_service.entity.ShippingMethods;
import com.example.order_service.repository.ShippingMethodsRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShippingMethodsService {
    private final ShippingMethodsRepository shippingMethodsRepository;
    private final ModelMapper modelMapper;
    public List<ShippingMethodsDto> getAllShippingMethods() {
        List<ShippingMethods> shippingMethodsList = shippingMethodsRepository.findAll();
        return shippingMethodsList.stream()
                .map(item -> new ShippingMethodsDto(item.getId(),item.getPriceFrom0To1kg(),item.getPriceFrom1To1_5kg(),item.getPriceFrom1_5To2kg(),item.getPriceNext0_5kg(),item.getPricePer1Km(),item.getDescription(),item.getName(),item.getDayStandard(),item.getVoucherOffset().getId(),item.getVoucherOffset().getReduceMaxAmount()))
                .collect(Collectors.toList());

    }

}
