package com.example.product_service.repository.custom.impl;

import com.example.product_service.common.UploadFile;
import com.example.product_service.dto.response.SellerInfoResponse;
import com.example.product_service.dto.response.TypeOfProductInItemResponse;
import com.example.product_service.repository.custom.CustomTypeOfProductRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Repository
public class CustomTypeOfProductRepositoryImpl  implements CustomTypeOfProductRepository {
    @PersistenceContext
    private EntityManager em;

    @Autowired
    private UploadFile uploadFile;

    @Autowired
    private RestTemplate restTemplate;
    @Override
    public List<TypeOfProductInItemResponse> findTOPInCartCustom(List<Long> list_top_ids) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT tp.id, tp.label1, tp.label2, p.name, p.id AS product_id, p.seller_id, tp.price, \n" +
                "       GROUP_CONCAT(DISTINCT tp1.label1) AS listClassifications1, \n" +
                "       GROUP_CONCAT(DISTINCT tp1.label2) AS listClassifications2, \n" +
                "       tp.quantity AS maxQuantity, tp.original_price, tp.weight, \n" +
                "       IFNULL(ic.id, 0) AS icId, \n" +
                "       tp.cost\n" +
                "FROM types_of_product tp\n" +
                "JOIN products p ON tp.product_id = p.id\n" +
                "LEFT JOIN types_of_product tp1 ON tp1.product_id = p.id\n" +
                "LEFT JOIN image_classifications ic ON ic.product_id = tp.product_id AND ic.classification1 = tp.label1\n" +
                "WHERE tp.id IN :list_top_ids \n" +
                "AND tp.is_deleted = 0\n" +
                "AND (ic.is_deleted = 0 OR ic.is_deleted IS NULL) \n" +
                "GROUP BY tp.id, tp.label1, tp.label2, p.name, p.id, p.seller_id, tp.price, tp.quantity, tp.original_price, tp.weight, ic.id;");
        Query query = em.createNativeQuery(sql.toString());
        query.setParameter("list_top_ids",list_top_ids);

        List<Object[]> result = query.getResultList();
        List<TypeOfProductInItemResponse> listResult = new ArrayList<>();
        for (Object[] item:result){
            long id = ((Number) item[0]).longValue(); // cast the id to long
            String label1 = (String) item[1];
            String label2 = (String) item[2];
            String productName = (String) item[3];
            Long productId = ((Number) item[4]).longValue();
            long seller_id = ((Number) item[5]).longValue();
            long price = ((Number) item[6]).longValue(); // cast the price to double
            List<String> listClassifications1 = ObjectUtils.isEmpty((String) item[7])?null:Arrays.stream(((String) item[7]).split(",")).toList();
            List<String> listClassifications2 = ObjectUtils.isEmpty((String) item[8])?null:Arrays.stream(((String) item[8]).split(",")).toList();
            Long maxQuantity = ((Number) item[9]).longValue();
            Long originalPrice = ((Number) item[10]).longValue();
            Long weight = ((Number) item[11]).longValue();
            Long cost = ((Number) item[13]).longValue();
            String imageClass = "";
            if(!ObjectUtils.isEmpty(label1)) {
                String url2 = "http://localhost:8020/file/get-images?objectId=" + ((Number) item[12]).longValue() + "&objectName=ImageClassificationImage";
                List<String> imageClassificationRes = restTemplate.exchange(
                        url2,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<String>>() {
                        }
                ).getBody();
                imageClass = imageClassificationRes.get(0);
            }else{
                String url2 = "http://localhost:8020/file/get-images?objectId=" + productId + "&objectName=ProductImage";
                List<String> imageProducts = restTemplate.exchange(
                        url2,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<String>>() {
                        }
                ).getBody();
                imageClass = imageProducts.get(0);
            }
            String url = "http://localhost:8020/api/seller/get-info-by-id?id=" + seller_id;
            SellerInfoResponse seller = restTemplate.getForObject(url, SellerInfoResponse.class);
            System.out.println(cost);
            TypeOfProductInItemResponse response = new TypeOfProductInItemResponse(
                    id,label1,label2,productName,productId,seller_id,price,listClassifications1,listClassifications2,seller.shopName,maxQuantity,originalPrice,weight,seller.getOwner(),imageClass,cost
            );
            listResult.add(response);
        }
        return listResult;
    }
}
