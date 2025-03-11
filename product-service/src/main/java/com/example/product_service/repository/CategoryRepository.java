package com.example.product_service.repository;

import com.example.product_service.dto.response.CategoryResponse;
import com.example.product_service.entity.Category;
import com.example.product_service.repository.custom.CustomCategoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long>, CustomCategoryRepository {

    @Query("SELECT c FROM Category c WHERE c.categoryParent IS NULL")
    List<Category> findParentCategories();

    @Query("SELECT new com.example.product_service.dto.response.CategoryResponse(c.id, c.name, COUNT(sc)) " +
            "FROM Category c " +
            "LEFT JOIN c.subcategories sc " +
            "WHERE c.categoryParent.id = :idParent " +
            "GROUP BY c.id, c.name")
    List<CategoryResponse> findByIdParent(@Param("idParent") long idParent);



    @Query("SELECT c FROM Category c WHERE c.categoryParent IS NOT  NULL")
    List<Category> findChildCategories();




}
