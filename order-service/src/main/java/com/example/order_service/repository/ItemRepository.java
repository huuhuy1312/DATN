package com.example.order_service.repository;

import com.example.order_service.entity.Item;
import com.example.order_service.repository.custom.ItemRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item,Long>, ItemRepositoryCustom {
    List<Item> findByCustomerId(Long customerId);

    @Query("SELECT i FROM items i WHERE i.id in :ids")
    List<Item>  findByIds(List<Long> ids);

    @Query("SELECT i FROM items i WHERE i.orderLine.sellerId =:sellerId")
    List<Item> findBySellerId(Long sellerId);

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM items i WHERE i.typeOfProductId = :topId")
    Long countSoldQuantity(Long topId);

    Item findByCustomerIdAndTypeOfProductId(Long customerId, Long typeOfProductId);



}
