package com.example.product_service.repository.custom.impl;

import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.repository.custom.CustomCategoryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CustomCategoryRepositoryImpl implements CustomCategoryRepository {
    @PersistenceContext
    private EntityManager em;
    @Override
    public List<CategoryResponse> findByName(String name) {
        String queryStr = "WITH RECURSIVE parent_category AS (\n" +
                "    SELECT id, category_parent_id, name\n" +
                "    FROM categories\n" +
                "    WHERE name LIKE CONCAT('%', :name, '%')\n " +
                "    UNION ALL\n" +
                "    SELECT c.id, c.category_parent_id, c.name\n" +
                "    FROM categories c\n" +
                "    INNER JOIN parent_category pc ON c.id = pc.category_parent_id\n" +
                ")\n" +
                "SELECT DISTINCT id,name,(\n" +
                "\tSELECT COUNT(*) FROM categories c WHERE c.category_parent_id = p.id\n" +
                ") AS count_child\n" +
                "FROM parent_category p\n" +
                "WHERE category_parent_id IS NULL;";
        Query query = em.createNativeQuery(queryStr);
        query.setParameter("name",name);
        List<Object[]> result = query.getResultList();
        List<CategoryResponse> categoryResponses = new ArrayList<>();
        for (Object[] item: result){
            Long id = ((Number) item[0]).longValue();
            String nameC = (String) item[1];
            Long countChild = ((Number) item[0]).longValue();
            categoryResponses.add(new CategoryResponse(id,nameC,countChild));
        }
        return categoryResponses;
    }
}
