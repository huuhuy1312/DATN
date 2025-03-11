package com.example.order_service.repository;

import com.example.order_service.entity.Address;
import com.example.order_service.repository.custom.AddressRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address,Long>, AddressRepositoryCustom {


    List<Address> findByCustomerId(Long customerId);

    @Query("SELECT a FROM Address a WHERE a.sellerId=:sellerId")
    Address findBySellerId(Long sellerId);

//    @Query(value = "SELECT a.id, a.city, a.district, a.ward, a.address_details AS addressDetails, a.name_user AS nameUser, a.phone_number_user AS phoneNumberUser, " +
//            "    (6371 * acos(" +
//            "        cos(radians(:latitudeAddress)) " +
//            "        * cos(radians(a.latitude)) " +
//            "        * cos(radians(a.longitude) - radians(:longitudeAddress)) " +
//            "        + sin(radians(:latitudeAddress)) " +
//            "        * sin(radians(a.latitude))" +
//            "    )) AS distance " +
//            "FROM address a WHERE a.seller_id IS NULL AND a.customer_id IS NULL " +
//            "ORDER BY distance",
//            countQuery = "SELECT count(*) FROM address a",
//            nativeQuery = true)
//    Page<AddressWithDistanceResponse> findAddressNearAddress(@Param("longitudeAddress") double longitudeAddress,
//                                                             @Param("latitudeAddress") double latitudeAddress,
//                                                             Pageable pageable);

    @Modifying
    @Query(value = "UPDATE Address a SET a.isDefault = CASE WHEN a.id = :id THEN true ELSE false END " +
            "WHERE a.customerId = :customerId")
    void updateDefaultAddress(@Param("id") Long id, @Param("customerId") Long customerId);
}
