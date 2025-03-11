package com.bezkoder.springjwt.repository.custom.impl;

import com.bezkoder.springjwt.payload.response.ItemInCartDetailsResponse;
import com.bezkoder.springjwt.payload.response.SectionOfCartResponse;
import com.bezkoder.springjwt.repository.custom.CustomItemInCartRepository;
import com.bezkoder.springjwt.services.FileService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CustomItemInCartRepositoryImpl implements CustomItemInCartRepository {
    @PersistenceContext
    private EntityManager em;

    @Autowired
    private FileService fileService;
    @Override
    public List<ItemInCartDetailsResponse> findItemsInCartByCartId(long cart_id) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT \n" +
                "    iic.id, \n" +
                "    ic.image, \n" +
                "    p.name,\n" +
                "    p.`seller_id`,\n" +
                "    s.shop_name,\n" +
                "    tp.price, \n" +
                "    iic.quantity,\n" +
                "    GROUP_CONCAT(DISTINCT tp1.label1) AS listClassifications1, \n" +
                "    GROUP_CONCAT(DISTINCT tp1.label2) AS listClassifications2,\n" +
                "    tp.id,\n" +
                "\tCONCAT(tp.label1, ', ', tp.label2) AS label\n" +
                "FROM \n" +
                "    item_in_cart iic\n" +
                "JOIN \n" +
                "    types_of_product tp ON iic.top_id = tp.id\n" +
                "JOIN \n" +
                "    product p ON tp.product_id = p.id \n" +
                "JOIN \n" +
                "    seller s ON s.id = p.seller_id\n" +
                "JOIN \n" +
                "    image_classifications1 ic ON ic.product_id = tp.product_id AND ic.classification1 = tp.label1 \n" +
                "LEFT JOIN \n" +
                "    types_of_product tp1 ON tp1.product_id = p.id\n" +
                "\n" +
                "WHERE \n" +
                "    iic.cart_id = :cart_id\n" +
                "GROUP BY \n" +
                "    iic.id, ic.image, p.name, tp.price, iic.quantity;\n");
        Query query = em.createNativeQuery(sql.toString());
        query.setParameter("cart_id",cart_id);

        List<Object[]> result = query.getResultList();
        List<ItemInCartDetailsResponse> listResult = new ArrayList<>();
        for (Object[] item:result){
            long id = ((Number) item[0]).longValue(); // cast the id to long
            String image = fileService.readImage((String) item[1]);
            String name = (String) item[2];
            long seller_id = ((Number) item[3]).longValue();
            String shopName = (String) item[4];
            long price = ((Number) item[5]).longValue(); // cast the price to double
            int quantity = ((Number) item[6]).intValue(); // cast the quantity to int
            String listClassifications1 = (String) item[7];
            String listClassifications2 = (String) item[8];
            long topId = ((Number) item[9]).longValue();
            String label = (String) item[10];
            // Tạo đối tượng response
            ItemInCartDetailsResponse response = new ItemInCartDetailsResponse(
                    id,
                    image,
                    name,
                    seller_id,
                    shopName,
                    price,
                    quantity,
                    listClassifications1,
                    listClassifications2,
                    topId,
                    label
            );
            listResult.add(response);
        }
        return listResult;
    }
}
