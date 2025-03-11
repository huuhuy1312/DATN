package com.example.product_service.repository;

import com.example.product_service.entity.TypeOfProduct;
import com.example.product_service.repository.custom.CustomTypeOfProductRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface TypeOfProductRepository extends JpaRepository<TypeOfProduct,Long>, CustomTypeOfProductRepository {
    @Query("SELECT t.id FROM types_of_product t WHERE t.label1 = :label1 AND (t.label2 = :label2 OR :label2 IS NULL) AND t.product.id = :pid AND isDeleted = false")
    Long getIdByLabel1AndLabel2AndProductId(@Param(value = "label1") String label1,
                                            @Param(value = "label2") String label2,
                                            @Param(value = "pid") Long productId);

    @Query("SELECT t FROM types_of_product t WHERE t.product.id = :productId AND isDeleted=false")
    List<TypeOfProduct> findByProductId(@Param(value = "productId") Long productId);

    @Query("SELECT t FROM types_of_product t WHERE t.product.sellerId = :sellerId AND isDeleted=false")
    List<TypeOfProduct> findBySellerId(@Param(value = "sellerId") Long sellerID);

    // Có thể tạo thêm phương thức để cập nhật trạng thái isDeleted
    @Modifying
    @Transactional
    @Query("UPDATE types_of_product t SET t.isDeleted = true WHERE t.product.id = :productId AND t.isDeleted = false")
    void softDeleteByProductId(@Param("productId") Long productId);

}
