package com.example.order_service.service;


import com.example.order_service.dto.request.AddItemRequest;
import com.example.order_service.dto.request.ItemDetailResponse;

import com.example.order_service.dto.request.SoldQuantityResponse;
import com.example.order_service.dto.request.UpdateItemRequest;
import com.example.order_service.dto.response.ShopGroupedItemsResponse;
import com.example.order_service.entity.Address;
import com.example.order_service.entity.Item;
import com.example.order_service.repository.AddressRepository;
import com.example.order_service.repository.ItemRepository;
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
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final RestTemplate restTemplate;
    private final ItemRepository itemRepository;
    private final AddressRepository addressRepository;
    private final ModelMapper modelMapper;
    // Grouping items by shop and applying voucher logic
    public List<ShopGroupedItemsResponse> groupItemsByShop(List<ItemDetailResponse> items) {
        Map<String, ShopGroupedItemsResponse> shopMap = new HashMap<>();

        for (ItemDetailResponse item : items) {
            String shopKey = item.getShopName();

            if (!shopMap.containsKey(shopKey)) {
                // Initialize a new group for the shop
                ShopGroupedItemsResponse shopGroup = new ShopGroupedItemsResponse();
                System.out.println(item.getSellerId());
                Address address = addressRepository.findBySellerId(item.getSellerId());
                shopGroup.setCity(address.getCity());
                shopGroup.setDistrict(address.getDistrict());
                shopGroup.setWard(address.getWard());
                shopGroup.setLatitude(address.getLatitude());
                shopGroup.setLongitude(address.getLongitude());
                shopGroup.setSellerId(item.getSellerId());
                shopGroup.setShopName(item.getShopName());

                shopGroup.setTotalWeight(0);
                shopGroup.setTotalPrice(0);
                shopGroup.setItems(new ArrayList<>());
                shopGroup.setReduceShipCost(0);  // Initial value

                shopMap.put(shopKey, shopGroup);
            }

            // Get the shop group and update values
            ShopGroupedItemsResponse shopGroup = shopMap.get(shopKey);

            // Update total weight and total price
            shopGroup.setTotalWeight(shopGroup.getTotalWeight() + item.getWeight() * item.getQuantity());
            shopGroup.setTotalPrice(shopGroup.getTotalPrice() + item.getPrice() * item.getQuantity());

            // Add the item to the shop's item list
            shopGroup.getItems().add(item);

        }

        // Convert the map to a list and return
        return new ArrayList<>(shopMap.values());
    }

    // Fetch detailed cart items and group them by shop
    public List<ItemDetailResponse> getDetailsCart(long customerId) throws JsonProcessingException {
        // Fetch the items by customer ID
        List<Item> items = itemRepository.findByCustomerId(customerId);
        List<Long> topIds = items.stream().map(Item::getTypeOfProductId).toList();

        // Fetch the detailed item responses
        List<ItemDetailResponse> itemDetailResponses = findTOPs(topIds, items);

        // Group the items by shop and apply voucher logic
        return itemDetailResponses;
    }

    // Fetch the detailed ItemDetailResponse objects for the given product type IDs (top_ids)
    public List<ItemDetailResponse> findTOPs(List<Long> topIds, List<Item> items) throws JsonProcessingException {
        String topIdsString = topIds.stream().map(String::valueOf).collect(Collectors.joining(","));
        String url = "http://localhost:8083/api/type-of-product/get-details-in-cart?top_ids=" + topIdsString;

        // Call the external service to fetch the item details
        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        // Deserialize the response into a list of ItemDetailResponse
        ObjectMapper objectMapper = new ObjectMapper();
        List<ItemDetailResponse> itemDetailResponses = objectMapper.readValue(response.getBody(), new TypeReference<>() {});

        // Match the detailed items with the original items to set the quantity and ID
        for (ItemDetailResponse itemDetail : itemDetailResponses) {
            Item matchingItem = items.stream()
                    .filter(i -> Objects.equals(i.getTypeOfProductId(), itemDetail.getTopId()))
                    .findFirst()
                    .orElse(null);

//            itemDetail.setCreatedAt(matchingItem.getOrderLine().getOrder().getCreatedAt());
//            itemDetail.setDoneTime(matchingItem.getOrderLine().getDoneTime());
//            itemDetail.setPaymentTime(matchingItem.getOrderLine().getPaymentTime());
//            itemDetail.setShipperPickUpTime(matchingItem.getOrderLine().getShipperPickupTime());
//            itemDetail.setCodeOrder(matchingItem.getOrderLine().getOrder().getCode());
            if (matchingItem != null) {
                itemDetail.setQuantity(matchingItem.getQuantity());
                itemDetail.setId(matchingItem.getId());
            }
        }

        return itemDetailResponses;
    }

    // Fetch items by their IDs
    public List<ShopGroupedItemsResponse> findByIds(List<Long> ids) throws JsonProcessingException {
        // Fetch the items by their IDs
        List<Item> items = itemRepository.findByIds(ids);
        List<Long> topIds = items.stream().map(Item::getTypeOfProductId).toList();
        // Fetch the detailed item responses
        return groupItemsByShop(findTOPs(topIds, items));
    }


    @Transactional
    public ItemDetailResponse updateItem(UpdateItemRequest updateItemRequest) throws JsonProcessingException {
        if(Objects.isNull(updateItemRequest.getIsRated())) {
            StringBuilder urlBuilder = new StringBuilder("http://localhost:8083/api/type-of-product/get-id-by-label?label1=")
                    .append(updateItemRequest.getLabel1())
                    .append("&productId=")
                    .append(updateItemRequest.getProductId());

            if (updateItemRequest.getLabel2() != null) {
                urlBuilder.append("&label2=").append(updateItemRequest.getLabel2());
            }

            String url = urlBuilder.toString();

            ResponseEntity<Long> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<Long>() {
                    }
            );
            itemRepository.save(new Item(updateItemRequest.getId(), response.getBody(), updateItemRequest.getCustomerId(), updateItemRequest.getQuantity()));
        }else{
            Item item = itemRepository.findById(updateItemRequest.getId()).get();
            item.setIsRated(updateItemRequest.getIsRated());
            itemRepository.save(item);
        }
        return null;
    }

    public List<ItemDetailResponse> getBySellerId(long sellerId) throws JsonProcessingException {
        List<Item> items = itemRepository.findBySellerId(sellerId);
        List<Long> topIds = items.stream().map(Item::getTypeOfProductId).toList();
        return findTOPs(topIds,items);
    }

    public Long countSoldQuantity(Long typeOfProductId){
        return itemRepository.countSoldQuantity(typeOfProductId);
    }

    public Item addItem(AddItemRequest request) {
        // Tìm kiếm bản ghi với customerId và typeOfProductId
        Item existingItem = itemRepository.findByCustomerIdAndTypeOfProductId(request.getCustomerId(), request.getTypeOfProductId());

        if (existingItem != null) {
            // Nếu bản ghi tồn tại, tăng số lượng quantity
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity().intValue());
            return itemRepository.save(existingItem);
        } else {
            // Nếu bản ghi không tồn tại, tạo mới
            Item newItem = new Item();
            newItem.setTypeOfProductId(request.getTypeOfProductId());
            newItem.setCustomerId(request.getCustomerId());
            newItem.setQuantity(request.getQuantity().intValue());
            newItem.setIsActive(true); // hoặc giá trị mặc định nếu có
            return itemRepository.save(newItem);
        }
    }
    public List<SoldQuantityResponse> countSoldQuantity(List<Long> ids){
        return itemRepository.countSoldQuantity(ids);
    }

    public void deleteById(Long itemId) {
        itemRepository.deleteById(itemId);
    }
}
