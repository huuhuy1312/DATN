package com.example.order_service.repository.custom;

import com.example.order_service.dto.request.SoldQuantityResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ItemRepositoryCustomImpl implements ItemRepositoryCustom{
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<SoldQuantityResponse> countSoldQuantity(List<Long> ids) {
        String queryStr = "SELECT \n" +
                "    i.type_of_product_id,\n" +
                "    EXTRACT(YEAR FROM o.created_at) AS year,\n" +
                "    EXTRACT(MONTH FROM o.created_at) AS month,\n" +
                "    SUM(i.quantity) AS total_quantity\n" +
                "FROM \n" +
                "    items i\n" +
                "\n" +
                "JOIN \n" +
                "    order_lines ol ON i.order_line_id = ol.id\n" +
                "JOIN \n" +
                "    orders o ON ol.order_id = o.id \n" +
                "WHERE i.type_of_product_id IN :ids\n" +
                "GROUP BY \n" +
                "    i.type_of_product_id,\n" +
                "    EXTRACT(YEAR FROM o.created_at),\n" +
                "    EXTRACT(MONTH FROM o.created_at)\n" +
                "ORDER BY \n" +
                "    i.type_of_product_id,\n" +
                "    year,\n" +
                "    month;\n";
        Query query = entityManager.createNativeQuery(queryStr);
        query.setParameter("ids",ids);
        List<Object[]> results = query.getResultList();
        List<SoldQuantityResponse> revenueBySellerIdRequests = new ArrayList<>();
        for (Object[] result:results){
            revenueBySellerIdRequests.add(
                    new SoldQuantityResponse(
                            ((Number) result[0]).longValue(),
                            ((Number) result[1]).intValue(),
                            ((Number) result[2]).intValue(),
                            ((Number) result[3]).longValue()
                    )
            );
        }
        return revenueBySellerIdRequests;
    }
}
