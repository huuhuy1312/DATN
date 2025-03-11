package com.example.product_service.repository;

import com.example.product_service.dto.response.ProductNotDetailsResponse;
import com.example.product_service.dto.response.StaticProductBySellerReponse;
import com.example.product_service.entity.Product;
import com.example.product_service.repository.custom.CustomProductRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, CustomProductRepository {

    // Tìm sản phẩm chưa bị xóa (isDeleted = false)
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND (:sellerId IS NULL OR p.sellerId = :sellerId)")
    List<Product> findBySellerId(Long sellerId);

    // Lấy các sản phẩm chưa có chi tiết và chưa bị xóa (isDeleted = false)
    @Query(value = "SELECT new com.example.product_service.dto.response.ProductNotDetailsResponse(p.id, p.name, MIN(top.price), p.origin) " +
            "FROM Product p " +
            "LEFT JOIN types_of_product top ON top.product = p " +
            "WHERE p.isDeleted = false " +
            "GROUP BY p.id")
    List<ProductNotDetailsResponse> findNotDetailsProduct();

    // Cập nhật trạng thái sản phẩm thành "đã xóa mềm" (isDeleted = true)
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.isDeleted = true WHERE p.id IN :ids")
    void softDeleteProductsByIds(List<Long> ids);

    // Lấy tất cả sản phẩm chưa bị xóa (isDeleted = false)
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false")
    List<Product> findAllActiveProducts();

    // Lọc sản phẩm theo các điều kiện và trạng thái isDeleted = false
    @Query("SELECT p FROM Product p WHERE p.isDeleted = false AND (:categoryId IS NULL OR p.category.id = :categoryId) AND (:supplierId IS NULL OR p.supplier.id = :supplierId)")
    List<Product> findByCondition(Long categoryId, Long supplierId);

    @Query(value = """
    SELECT new com.example.product_service.dto.response.StaticProductBySellerReponse(
        p.sellerId,
        COUNT(DISTINCT p.id),
        COUNT(r.id),
        COALESCE(AVG(r.rateStar), 0))
    FROM Product p
    LEFT JOIN p.typesOfProducts t
    LEFT JOIN t.rates r
    GROUP BY p.sellerId
    """)
    List<StaticProductBySellerReponse> getSellerStatistics();


}
