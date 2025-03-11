package com.example.order_service.repository.custom;

import com.example.order_service.dto.response.WarehouseWithDistanceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AddressRepositoryCustom {
    Page<WarehouseWithDistanceResponse> findAddressNearAddress(double longitudeAddress, double latitudeAddress, Pageable pageable);
}
