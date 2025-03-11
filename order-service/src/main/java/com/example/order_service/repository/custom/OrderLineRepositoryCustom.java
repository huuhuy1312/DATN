package com.example.order_service.repository.custom;

import com.example.order_service.dto.request.FilterOrderLineRequest;
import com.example.order_service.dto.response.CountOrderLineByTypeResponse;
import com.example.order_service.entity.OrderLine;

import java.util.List;

public interface OrderLineRepositoryCustom {

    CountOrderLineByTypeResponse countOrderLineByType(Long idAccountWarehouse);

    CountOrderLineByTypeResponse countOrderLineByTypeShipper(Long idAccountShipper);

    List<OrderLine> findByCondition(FilterOrderLineRequest request);


}
