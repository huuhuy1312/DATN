package com.example.order_service.repository.custom;

import com.example.order_service.dto.response.AddressResponse;
import com.example.order_service.dto.response.WarehouseWithDistanceResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class AddressRepositoryCustomImpl implements AddressRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<WarehouseWithDistanceResponse> findAddressNearAddress(double longitudeAddress, double latitudeAddress, Pageable pageable) {
        String queryStr = "SELECT \n" +
                "    w.id,w.name,a.id,a.city,a.ward,a.district,a.address_details,a.name_user,a.phone_number_user,\n" +
                "    (\n" +
                "        6371 * ACOS(\n" +
                "            COS(RADIANS(:latitudeAddress)) * COS(RADIANS(a.latitude)) *\n" +
                "            COS(RADIANS(a.longitude) - RADIANS(:longitudeAddress)) +\n" +
                "            SIN(RADIANS(:latitudeAddress)) * SIN(RADIANS(a.latitude))\n" +
                "        )\n" +
                "    ) AS distance\n" +
                "FROM warehouses w\n" +
                "JOIN address a ON w.address_id = a.id\n" +
                "WHERE w.is_active = 1\n" +
                "ORDER BY distance ASC;";

        Query query = entityManager.createNativeQuery(queryStr)
                .setParameter("longitudeAddress", longitudeAddress)
                .setParameter("latitudeAddress", latitudeAddress);

        // Set pagination
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        // Fetch results and map them to DTO
        List<Object[]> results = query.getResultList();
        List<WarehouseWithDistanceResponse> addresses = new ArrayList<>();

        for (Object[] result : results) {
            addresses.add(new WarehouseWithDistanceResponse(
                    ((Number) result[0]).longValue(),  // id
                    (String) result[1],                    // city
                    new AddressResponse(
                            ((Number) result[2]).longValue(),
                            (String) result[3],
                            (String) result[4],
                            (String) result[5],
                            (String) result[6],
                            (String) result[7],
                            (String) result[8]
                    ),// phoneNumberUser
                    (Double) result[9]                     // distance
            ));
//            Long id = ((Number) result[0]).longValue();
//            System.out.println(id);
        }

        // Get total count
        Query countQuery = entityManager.createNativeQuery("SELECT count(*) FROM address a WHERE a.seller_id IS NULL AND a.customer_id IS NULL");
        long totalCount = ((Number) countQuery.getSingleResult()).longValue();

        return new PageImpl<>(addresses, pageable, totalCount);
    }
}

