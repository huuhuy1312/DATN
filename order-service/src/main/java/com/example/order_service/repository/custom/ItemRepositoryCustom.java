package com.example.order_service.repository.custom;
import com.example.order_service.dto.request.SoldQuantityResponse;

import java.util.List;

public interface ItemRepositoryCustom {
    List<SoldQuantityResponse> countSoldQuantity(List<Long> ids);
}
