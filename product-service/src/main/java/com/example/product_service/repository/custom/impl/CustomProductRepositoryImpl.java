package com.example.product_service.repository.custom.impl;

import com.example.product_service.dto.request.FilterProductRequest;
import com.example.product_service.repository.custom.CustomProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Repository
public class CustomProductRepositoryImpl implements CustomProductRepository {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public List<Long> findByCondition(FilterProductRequest request) {
        StringBuilder sql = new StringBuilder();

        // Start the recursive category hierarchy if categoryId is provided
        if (!ObjectUtils.isEmpty(request.getCategoryId())) {
            sql.append("WITH RECURSIVE category_hierarchy AS (\n" +
                    "    SELECT id\n" +
                    "    FROM categories\n" +
                    "    WHERE id = :categoryId\n" +  // Use :categoryId instead of hardcoding '11'
                    "    UNION ALL\n" +
                    "    SELECT c.id\n" +
                    "    FROM categories c\n" +
                    "    JOIN category_hierarchy ch ON c.category_parent_id = ch.id\n" +
                    ")");
        }

        // Main SQL query for fetching products
        sql.append("SELECT p.id FROM products p " +
                "LEFT JOIN types_of_product top ON top.product_id = p.id " +
                "LEFT JOIN rates r ON r.type_of_product_id = top.id " +
                "WHERE TRUE ");

        // Add category filter if categoryId is provided
        if (!ObjectUtils.isEmpty(request.getCategoryId())) {
            sql.append("AND p.category_id IN (SELECT id FROM category_hierarchy) ");
        }

        // Add productName filter if provided
        if (!ObjectUtils.isEmpty(request.getProductName())) {
            sql.append("AND p.name LIKE CONCAT('%', :productName , '%') ");
        }

        // Group by product ID (needed for aggregates like MIN and COUNT)
        sql.append("GROUP BY p.id ");

        // Apply aggregation conditions in HAVING clause
        sql.append("HAVING TRUE ");

        // Price filter: Ensure conditions on MIN(top.price) are applied correctly
        if (!ObjectUtils.isEmpty(request.getPriceMin())) {
            sql.append("AND MIN(top.price) >= :priceMin ");
        }
        if (!ObjectUtils.isEmpty(request.getPriceMax())) {
            sql.append("AND MIN(top.price) <= :priceMax ");  // Corrected comparison to <= for max price
        }
        if(!ObjectUtils.isEmpty(request.getRateStar())) {
            sql.append("AND AVG(r.rate_star) >= :rateStar ");
        }

        // Rating count filter: Handle COUNT of ratings based on the request
        if (!ObjectUtils.isEmpty(request.getCountRates())) {
            if (request.getCountRates() == 0) {
                sql.append("AND COUNT(r.id) = 0 ");  // No ratings
            } else {
                sql.append("AND COUNT(r.id) >= :countRates ");  // At least the specified number of ratings
            }
        }

        // Apply LIMIT and OFFSET for pagination
        if (request.getPage() != null && request.getPageSize() != null) {
            int offset = (request.getPage() - 1) * request.getPageSize();  // Calculate offset for pagination
            sql.append("LIMIT :pageSize OFFSET :offset");
        }

        // Prepare the query and set parameters dynamically
        Query query = em.createNativeQuery(sql.toString());

        // Set parameters for product name and categoryId
        if (!ObjectUtils.isEmpty(request.getCategoryId())) {
            query.setParameter("categoryId", request.getCategoryId());
        }
        if (!ObjectUtils.isEmpty(request.getProductName())) {
            query.setParameter("productName", request.getProductName());
        }
        if (!ObjectUtils.isEmpty(request.getPriceMin())) {
            query.setParameter("priceMin", request.getPriceMin());
        }
        if (!ObjectUtils.isEmpty(request.getPriceMax())) {
            query.setParameter("priceMax", request.getPriceMax());
        }
        if (!ObjectUtils.isEmpty(request.getCountRates()) && request.getCountRates() != 0) {
            query.setParameter("countRates", request.getCountRates());
        }
        if (!ObjectUtils.isEmpty(request.getRateStar())) {
            query.setParameter("rateStar", request.getRateStar());
        }
        if (request.getPageSize() != null) {
            query.setParameter("pageSize", request.getPageSize()); // Set pageSize for LIMIT
        }
        if (request.getPage() != null && request.getPageSize()!=null) {
            int offset = (request.getPage() - 1) * request.getPageSize();
            query.setParameter("offset", offset); // Set offset for pagination
        }

        List<Long> ids = query.getResultList();
        return ids;
    }



}

