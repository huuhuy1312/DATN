package com.example.order_service.service;

import com.example.order_service.dto.request.FilterCountOrderLineRequest;
import com.example.order_service.dto.request.FilterOrderLineRequest;
import com.example.order_service.dto.request.ItemDetailResponse;
import com.example.order_service.dto.request.UpdateOrderLineRequest;
import com.example.order_service.dto.response.*;
import com.example.order_service.entity.*;
import com.example.order_service.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderLineService {
    private final OrderLineRepository orderLineRepository;
    private final ModelMapper modelMapper;
    private final ItemRepository itemRepository;
    private final RestTemplate restTemplate;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final WarehouseRepository warehouseRepository;
    public List<OrderLineResponseInAdminStaticPage> staticByAdmin()
    {
        List<OrderLine> orderLines = orderLineRepository.getOrderLineNoCancel();
        List<OrderLineResponseInAdminStaticPage> response = new ArrayList<>();
        for (OrderLine ol : orderLines) {
            OrderLineResponseInAdminStaticPage ols = new OrderLineResponseInAdminStaticPage(
                    ol.getId(),
                    ol.getTotalPrice(),
                    ol.getDeliveryWarehouse() != null ? ol.getDeliveryWarehouse().getId() : null,
                    ol.getPickupWarehouse() != null ? ol.getPickupWarehouse().getId() : null,
                    ol.getDeliveryShipper() != null ? ol.getDeliveryShipper().getId() : null,
                    ol.getPickupShipper() != null ? ol.getPickupShipper().getId() : null,
                    ol.getStatus(),
                    ol.getOrder().getCreatedAt(),
                    ol.getRevenue()
            );
            response.add(ols);
        }

        return response;
    }
    public List<OrderLineResponse> convertOrderLinesToOrderResponses(List<OrderLine> orderLines) throws JsonProcessingException {
        List<Item> items = orderLines.stream()
                .flatMap(orderLine -> orderLine.getItemList().stream()) // Lấy tất cả các item từ mỗi orderLine
                .toList(); // Gộp tất cả các item vào một danh sách duy nhất

        List<Long> topIds = items.stream().map(Item::getTypeOfProductId).toList();
        String topIdsString = topIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        String url = "http://localhost:8083/api/type-of-product/get-details-in-cart?top_ids=" + topIdsString;

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        ObjectMapper objectMapper = new ObjectMapper();
        List<ItemDetailResponse> responses = objectMapper.readValue(response.getBody(), new TypeReference<List<ItemDetailResponse>>() {});
        List<ItemDetailResponse> itemDetailResponses = new ArrayList<>();

        for (Item item : items) {
            // Tìm kiếm itemDetailResponse tương ứng với item dựa trên typeOfProductId
            ItemDetailResponse matchingItem = responses.stream()
                    .filter(i -> Objects.equals(i.getTopId(), item.getTypeOfProductId()))
                    .findFirst()
                    .orElse(null);

            ItemDetailResponse itemDetailResponse = new ItemDetailResponse(
                    item.getId(),
                    item.getOrderLine().getWaybillCode(),
                    item.getQuantity(),
                    item.getTypeOfProductId(),
                    matchingItem.getLabel1(),
                    matchingItem.getLabel2(),
                    matchingItem.getProductName(),
                    matchingItem.getProductId(),
                    matchingItem.getSellerId(),
                    matchingItem.getPrice(),
                    matchingItem.getListClassifications1(),
                    matchingItem.getListClassifications2(),
                    matchingItem.getShopName(),
                    matchingItem.getMaxQuantity(),
                    matchingItem.getOriginalPrice(),
                    matchingItem.getWeight(),
                    matchingItem.getOwner(),
                    matchingItem.getImage(),
                    matchingItem.getCost(),
                    item.getIsRated()
            );
            itemDetailResponses.add(itemDetailResponse);
        }
        List<OrderLineResponse> orderLineResponses = new ArrayList<>();
        for (OrderLine orderLine : orderLines) {
            OrderLineResponse orderLineResponse = modelMapper.map(orderLine, OrderLineResponse.class);
            orderLineResponse.setIdDeliveryShipper(orderLine.getDeliveryShipper() != null ? orderLine.getDeliveryShipper().getId() : null);
            orderLineResponse.setIdDeliveryWarehouse(orderLine.getDeliveryWarehouse() != null ? orderLine.getDeliveryWarehouse().getId() : null);
            orderLineResponse.setIdPickupShipper(orderLine.getPickupShipper() != null ? orderLine.getPickupShipper().getId() : null);
            orderLineResponse.setIdPickupWarehouse(orderLine.getPickupWarehouse() != null ? orderLine.getPickupWarehouse().getId() : null);
            orderLineResponse.setCode(orderLine.getWaybillCode());
            orderLineResponse.setOrderCode(orderLine.getOrder().getCode());
            orderLineResponse.setCreatedAt(orderLine.getOrder().getCreatedAt());
            orderLineResponse.setShipCost(orderLine.getShipCost());

            orderLineResponse.addressCustomer = modelMapper.map(orderLine.getOrder().getAddress(),AddressResponse.class);
            Address addressSeller = addressRepository.findBySellerId(orderLine.getSellerId());
            orderLineResponse.addressSeller = modelMapper.map(addressSeller,AddressResponse.class);
            List<ItemDetailResponse> itemDetailResponses1 = new ArrayList<>();
            // Lọc các ItemDetailResponse có id nằm trong danh sách Item của orderLine
            for (Item item : orderLine.getItemList()) {
                itemDetailResponses.stream()
                        .filter(detail -> detail.getId().equals(item.getId())) // So sánh id
                        .forEach(itemDetailResponses1::add); // Thêm vào danh sách itemDetailResponses1
            }
            Long totalAmount = itemDetailResponses1.stream()
                    .mapToLong(detail -> detail.getPrice() * detail.getQuantity())
                    .sum();
            orderLineResponse.setTotalAmount(totalAmount);
            orderLineResponse.setItems(itemDetailResponses1);
            orderLineResponses.add(orderLineResponse);// Giả sử bạn có setter cho itemDetails
            List<Voucher> vouchers = orderLine.getOrder().getVouchers().stream().toList();
            // Tìm voucher giảm tiền ship
            Optional<Voucher> optionalShippingVoucher = vouchers.stream()
                    .filter(v -> "Giảm tiền ship".equals(v.getType()))
                    .findFirst();

            // Tìm voucher giảm tiền hàng
            Optional<Voucher> optionalAmountVoucher = vouchers.stream()
                    .filter(v -> "Giảm tiền hàng".equals(v.getType()))
                    .findFirst();

            // Xử lý kết quả
            Voucher voucherShipping = optionalShippingVoucher.orElse(null);
            Voucher voucherAmount = optionalAmountVoucher.orElse(null);

            // Tính reduceAmount (kiểm tra null trước khi sử dụng)
            Long reduceAmount = 0L;
            if (voucherAmount != null && voucherShipping != null) {
                reduceAmount = (long) (
                        Math.min(voucherAmount.getPercentReduce() * totalAmount / 100, voucherAmount.getReduceMaxAmount())
                                + Math.min(voucherShipping.getReduceMaxAmount(), orderLine.getShipCost())
                );
            } else if (voucherAmount != null) {
                reduceAmount = (long) Math.min(voucherAmount.getPercentReduce() * totalAmount / 100, voucherAmount.getReduceMaxAmount());
            } else if (voucherShipping != null) {
                reduceAmount = Math.min(voucherShipping.getReduceMaxAmount(), orderLine.getShipCost());
            }

            orderLineResponse.setReduceAmount(reduceAmount);

        }
        return orderLineResponses;
    }
    public List<OrderLineResponse> search(FilterOrderLineRequest filterOrderLineRequest) throws JsonProcessingException, JsonProcessingException {
        List<OrderLine> orderLines = orderLineRepository.findByCondition( filterOrderLineRequest);
        return convertOrderLinesToOrderResponses(orderLines);

    }

    @Transactional
    public void updateOrderLine (UpdateOrderLineRequest request){
        OrderLine orderLine = orderLineRepository.findById(request.getId())
                .orElseThrow(()->new RuntimeException("Not found order line with id="+request.getId()));

        if(!ObjectUtils.isEmpty(request.getWaybillCode()))
            orderLine.setWaybillCode(request.getWaybillCode());
        if(!ObjectUtils.isEmpty(request.getReasonCancel()))
            orderLine.setReasonCancel(request.getReasonCancel());
        if(!ObjectUtils.isEmpty(request.getStatus())) {
            orderLine.setStatus(request.getStatus());
        }
        if(!ObjectUtils.isEmpty(request.getShipperPickupTime()))
            orderLine.setShipperPickupTime(request.getShipperPickupTime());
        if (!ObjectUtils.isEmpty(request.getConfirmTime())) {
            LocalDateTime confirmTime = request.getConfirmTime();
            ZonedDateTime zonedDateTime = confirmTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
            orderLine.setConfirmTime(zonedDateTime.toLocalDateTime());
        }
        if (!ObjectUtils.isEmpty(request.getIdDeliveryWarehouse())){
            Warehouse warehouse= warehouseRepository.findById(request.getIdDeliveryWarehouse()).get();
            orderLine.setDeliveryWarehouse(warehouse);
        }
        if (!ObjectUtils.isEmpty(request.getShipperDeliveryTime()))
        {
            orderLine.setShipperDeliveryTime(request.getShipperDeliveryTime());
        }
        if(!ObjectUtils.isEmpty(request.getDeliveryWarehouseReceiveTime()))
            orderLine.setDeliveryWarehouseReceiveTime(request.getDeliveryWarehouseReceiveTime());
        if (!ObjectUtils.isEmpty(request.getDoneTime()))
        {
            orderLine.setDoneTime(request.getDoneTime());
        }
        if (!ObjectUtils.isEmpty(request.getSellerPickupRequestDate()))
            orderLine.setSellerPickupRequestDate(request.getSellerPickupRequestDate());
        orderLineRepository.save(orderLine);
        orderLineRepository.updateOrderLine(request.getIdPickupShipper(), request.getIdPickupWarehouse(),  request.getIdDeliveryShipper(), request.getId());
        updateStatusOrder(orderLine.getOrder().getId());
    }

    public void updateStatusOrder(Long id) {
        List<String> listStatus = Arrays.asList(
                "Chờ xác nhận",    // 0
                "Đã xác nhận",    // 1
                "Đang xử lý",     // 2
                "Đang lấy hàng",  // 3
                "Đã lấy hàng",    // 4
                "Đang vận chuyển tới kho đích", // 5
                "Đã tới kho đích", // 6
                "Đang vận chuyển tới người nhận", // 7
                "Đã hoàn thành"   // 8
        );
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found order"));
        List<String> orderLineStatuses = order.getOrderLineList().stream()
                .map(OrderLine::getStatus)
                .toList();
        if (orderLineStatuses.isEmpty()) {
            throw new RuntimeException("Order không có orderLine nào!");
        }
        int minStatusIndex = orderLineStatuses.stream()
                .map(listStatus::indexOf)
                .min(Integer::compareTo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái hợp lệ!"));
        if (minStatusIndex == 1) {
            order.setStatus("Đã xác nhận");
        } else if (minStatusIndex >= 2 && minStatusIndex < 6) {
            order.setStatus("Đang vận chuyển");
        } else if (minStatusIndex >= 6 && minStatusIndex < 8) {
            order.setStatus("Chờ giao hàng");
        } else if (minStatusIndex == 8) {
            order.setStatus("Đã hoàn thành");
        }
        orderRepository.save(order);
    }


    public CountOrderLineByTypeResponse countOrderLineByType(Long idAccountWarehouse){
        return orderLineRepository.countOrderLineByType(idAccountWarehouse);
    }

    public CountOrderLineByTypeResponse countOrderLineOfShipperByType(Long idAccountShipper){
        return orderLineRepository.countOrderLineByTypeShipper(idAccountShipper);
    }


    public OrderAndCustomerOfSellerResponse orderAndCustomerOfSeller(Long idSeller) throws JsonProcessingException {
        List<OrderLine>  orderLines = orderLineRepository.findBySellerId(idSeller);
        FilterOrderLineRequest filterOrderLineRequest = new FilterOrderLineRequest();
        filterOrderLineRequest.setSellerId(idSeller);
        List<OrderLineResponse> orderLineResponses = search(filterOrderLineRequest);
        Set<Address> addresses = orderLines.stream()
                .map(orderLine -> orderLine.getOrder().getAddress())
                .collect(Collectors.toSet());
        return new OrderAndCustomerOfSellerResponse(orderLineResponses,addresses.stream().toList());
    }

    public List<ProcessOrderLineItemResponse> getProcess(Long id) {
        List<ProcessOrderLineItemResponse> responses = new ArrayList<>();
        OrderLine orderLine = orderLineRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Not found OrderLine with id ="+id)
        );
        responses.add(new ProcessOrderLineItemResponse(orderLine.getOrder().getCreatedAt(),"Đơn hàng đã được đặt","Đặt hàng thành công"));
        if(!ObjectUtils.isEmpty(orderLine.getConfirmTime()))
        {
            responses.add(new ProcessOrderLineItemResponse(orderLine.getConfirmTime(),"Người gửi đang chuẩn bị hàng","Đang được chuẩn bị"));
        }
        if (!ObjectUtils.isEmpty(orderLine.getShipperPickupTime()))
        {
            responses.add(new ProcessOrderLineItemResponse(orderLine.getShipperPickupTime(),"Đơn hàng đã đến "+orderLine.getPickupWarehouse().getName(),"Đã tới kho lấy hàng"));
        }
        if(!ObjectUtils.isEmpty(orderLine.getDeliveryWarehouseReceiveTime()))
        {
            responses.add(new ProcessOrderLineItemResponse(orderLine.getDeliveryWarehouseReceiveTime(),"Đơn hàng đã đến "+orderLine.getDeliveryWarehouse().getName(),"Đã tới kho giao hàng"));
        }
        if (!ObjectUtils.isEmpty(orderLine.getShipperDeliveryTime()))
        {
            responses.add(new ProcessOrderLineItemResponse(orderLine.getShipperDeliveryTime(),"Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại","Đang vận chuyển"));
        }
        if (!ObjectUtils.isEmpty(orderLine.getDoneTime()))
        {
            responses.add(new ProcessOrderLineItemResponse(orderLine.getDoneTime(),"Giao hàng thành công","Đã giao"));
        }

        return responses;
    }
}
