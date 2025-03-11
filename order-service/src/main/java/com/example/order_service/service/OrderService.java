package com.example.order_service.service;

import com.example.order_service.dto.request.AddOrderLineRequest;
import com.example.order_service.dto.request.AddOrderRequest;
import com.example.order_service.dto.request.FilterOrderRequest;
import com.example.order_service.dto.response.*;
import com.example.order_service.entity.*;
import com.example.order_service.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;
    private final VoucherRepository voucherRepository;
    private final ShippingMethodsRepository shippingMethodsRepository;
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;
    private final AddressRepository addressRepository;
    private final OrderLineService orderLineService;
    private final RestTemplate restTemplate;
    private final WarehouseRepository warehouseRepository;

    public String generateShortUUID() {
        UUID uuid = UUID.randomUUID();
        String shortUUID = uuid.toString().replace("-", "").substring(0, 8).toUpperCase();
        return shortUUID;
    }

    @Transactional
    public void addOrder(AddOrderRequest addOrderRequest) {
        Order order = new Order();
        List<Voucher> voucherList = voucherRepository.findAllById(addOrderRequest.voucherIds);
        order.setVouchers(new HashSet<>(voucherList));
        order.setCustomerId(addOrderRequest.customerId);
        order.setTotalAmount(addOrderRequest.totalAmount);
        order.setPaymentMethod(addOrderRequest.paymentMethod);
        order.setCode(generateShortUUID());
        order.setStatus("Chờ xác nhận");
        Address address = addressRepository.findById(addOrderRequest.getAddressShipId()).orElseThrow(
                () -> new RuntimeException("Not found Address with id=" + addOrderRequest.getAddressShipId())
        );

        order.setAddress(address);

        Order orderSaved = orderRepository.save(order);


        for (AddOrderLineRequest addOrderLineRequest : addOrderRequest.getAddOrderLineRequests()) {

            List<Item> items = itemRepository.findByIds(addOrderLineRequest.getItemIds());

            OrderLine orderLine = new OrderLine(addOrderLineRequest.getSellerId(), "Chờ xác nhận", addOrderLineRequest.getCustomerMessage(), orderSaved);
            orderLine.setTotalPrice(addOrderLineRequest.getTotalPrice());
            orderLine.setRevenue(addOrderLineRequest.getRevenue());
            OrderLine orderLineSaved = orderLineRepository.save(orderLine);
            ShippingMethods shippingMethods = shippingMethodsRepository.findById(addOrderLineRequest.getShippingMethodId())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay shipping methods cos id=" + addOrderLineRequest.getShippingMethodId()));
            orderLine.setShippingMethods(shippingMethods);
            orderLine.setShipCost(addOrderLineRequest.getShipCost());

            items.forEach((item -> {
                item.setOrderLine(orderLineSaved);
                item.setCustomerId(null);
            }));
            itemRepository.saveAll(items);
        }
    }

    public List<OrderResponse> convertOrdersToOrdersResponse(List<Order> orders) throws JsonProcessingException {
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);

            List<OrderLineResponse> orderLineResponses = orderLineService.convertOrderLinesToOrderResponses(order.getOrderLineList());
            orderResponse.setOrderLines(orderLineResponses);
            orderResponse.setAddressCustomer(modelMapper.map(order.getAddress(), AddressResponse.class));
            responses.add(orderResponse);
        }
        return responses;
    }

    public List<OrderResponse> convertOrdersToOrdersResponseBySellerId(List<Order> orders, Long idSeller) throws JsonProcessingException {
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            OrderResponse orderResponse = modelMapper.map(order, OrderResponse.class);

            List<OrderLine> orderLines = new ArrayList<>();
            for (OrderLine orderLine : order.getOrderLineList()) {
                if (orderLine.getSellerId().equals(idSeller)) {
                    orderLines.add(orderLine);
                }
            }
            orderResponse.setOrderLines(orderLineService.convertOrderLinesToOrderResponses(orderLines));

            orderResponse.setAddressCustomer(modelMapper.map(order.getAddress(), AddressResponse.class));
            responses.add(orderResponse);
        }
        return responses;
    }

    public List<OrderResponse> search(FilterOrderRequest request) throws JsonProcessingException {
        List<Order> orders = orderRepository.findOrders(request);
        return convertOrdersToOrdersResponse(orders);
    }

    public List<StaticWarehouseResponse> staticOrderOfWarehouses(List<Long> ids) throws JsonProcessingException {
        List<Warehouse> warehouses;
        if (!ids.isEmpty()) {
            warehouses = warehouseRepository.findByAccountIds(ids);
        } else {
            warehouses = warehouseRepository.findAll();
        }

        List<StaticWarehouseResponse> responses = new ArrayList<>();
        for (Warehouse warehouse : warehouses) {
            StaticWarehouseResponse warehouseResponse = new StaticWarehouseResponse();
            List<OrderLine> orderLines = orderLineRepository.staticByIdWarehouse(warehouse.getId());
            warehouseResponse.setOrderLines(orderLineService.convertOrderLinesToOrderResponses(orderLines));
            WarehouseWithDistanceResponse warehouse1 = new WarehouseWithDistanceResponse();
            warehouse1.setWarehouseName(warehouse.getName());
            warehouse1.setId(warehouse.getId());
            warehouse1.setAddressResponse(modelMapper.map(warehouse.getAddress(), AddressResponse.class));
            warehouseResponse.setWarehouse(warehouse1);
            responses.add(warehouseResponse);
        }
        return responses;
    }

    public List<StaticSellerAdminResponse> staticOrderOfSeller() throws JsonProcessingException {
        String url = "http://localhost:8080/api/seller/findAll";
        ResponseEntity<List<SellerResponse>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );
        List<SellerResponse> sellers = response.getBody();
        List<StaticSellerAdminResponse> responses = new ArrayList<>();
        for (SellerResponse seller : sellers) {
            Address address = addressRepository.findBySellerId(seller.id);
            AddressResponse addressResponse = modelMapper.map(address, AddressResponse.class);
            List<Order> orders = orderRepository.staticByIdSeller(seller.id);
            List<OrderResponse> orderResponses = convertOrdersToOrdersResponseBySellerId(orders, seller.id);
            StaticSellerAdminResponse response1 = new StaticSellerAdminResponse(seller, orderResponses, addressResponse);
            responses.add(response1);
        }
        return responses;
    }





}
