package com.example.order_service.repository.custom;

import com.example.order_service.dto.request.FilterOrderLineRequest;
import com.example.order_service.dto.response.CountOrderLineByTypeResponse;
import com.example.order_service.entity.OrderLine;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Repository
public class OrderLineRepositoryCustomImpl implements OrderLineRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private  ModelMapper modelMapper;
    @Override
    public CountOrderLineByTypeResponse countOrderLineByType(Long idAccountWarehouse) {
        StringBuilder queryStr = new StringBuilder();
        queryStr.append("SELECT\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "    ) AS count_wait_confirm_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        WHERE  ol.status = \"Chờ xác nhận\"\n" +
                "    ) AS count_wait_confirm_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        WHERE ol.status = \"Đã xác nhận\"\n" +
                "    ) AS count_confirmed_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        JOIN warehouses w ON ol.pickup_warehouse_id = w.id\n" +
                "        WHERE (:idAccountWarehouse IS NULL OR w.id_account = :idAccountWarehouse) AND ol.status = \"Đang xử lý\"\n" +
                "    ) AS count_processing_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        JOIN warehouses w ON ol.pickup_warehouse_id = w.id\n" +
                "        WHERE (:idAccountWarehouse IS NULL OR w.id_account = :idAccountWarehouse) AND ol.status = \"Đang lấy hàng\"\n" +
                "    ) AS count_picking_orders,\n" +
                "      (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        JOIN warehouses w ON ol.pickup_warehouse_id = w.id\n" +
                "        WHERE (:idAccountWarehouse IS NULL OR w.id_account = :idAccountWarehouse) AND ol.status = \"Đã lấy hàng\"\n" +
                "    ) AS count_picking_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        JOIN orders o ON ol.order_id = o.id " +
                "        JOIN warehouses w ON o.delivery_warehouse_id = w.id\n" +
                "        WHERE (:idAccountWarehouse IS NULL OR w.id_account = :idAccountWarehouse) AND ol.status = \"Đang vận chuyển tới kho đích\"\n" +
                "    ) AS count_shipping_to_dest_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        JOIN orders o ON ol.order_id = o.id " +
                "        JOIN warehouses w ON o.delivery_warehouse_id = w.id\n" +
                "        WHERE (:idAccountWarehouse IS NULL OR w.id_account = :idAccountWarehouse) AND ol.status = \"Đã tới kho đích\"\n" +
                "    ) AS count_arrived_at_dest_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        JOIN orders o ON ol.order_id = o.id " +
                "        JOIN warehouses w ON o.delivery_warehouse_id = w.id\n" +
                "        WHERE (:idAccountWarehouse IS NULL OR w.id_account = :idAccountWarehouse) AND ol.status = \"Đang vận chuyển tới người nhận\"\n" +
                "    ) AS count_shipping_to_customer_orders,\n" +
                "    (\n" +
                "        SELECT COUNT(*)\n" +
                "        FROM order_lines ol\n" +
                "        JOIN orders o ON ol.order_id = o.id " +
                "        JOIN warehouses w ON o.delivery_warehouse_id = w.id\n" +
                "        WHERE (:idAccountWarehouse IS NULL OR w.id_account = :idAccountWarehouse) AND ol.status = \"Đã hoàn thành\"\n" +
                "    ) AS count_completed_orders;\n");

        Query query = entityManager.createNativeQuery(queryStr.toString());

        query.setParameter("idAccountWarehouse",idAccountWarehouse);

        // Get a single result
        Object[] result = (Object[]) query.getSingleResult();

        // Map result to CountOrderLineByTypeResponse
        CountOrderLineByTypeResponse response = new CountOrderLineByTypeResponse(
                ((Number) result[0]).longValue(),       // total
                ((Number) result[1]).longValue(),
                ((Number) result[2]).longValue(),
                ((Number) result[3]).longValue(),
                ((Number) result[4]).longValue(),
                ((Number) result[5]).longValue(),
                ((Number) result[6]).longValue(),
                ((Number) result[7]).longValue(),
                ((Number) result[8]).longValue(),
                ((Number) result[9]).longValue()
                );

        return response;
    }


    @Override
    public CountOrderLineByTypeResponse countOrderLineByTypeShipper(Long idAccountShipper) {
        String sbQuery = "SELECT \n" +
                "    (SELECT COUNT(*) FROM order_lines ol JOIN shippers s ON s.id = ol.pickup_shipper_id WHERE status = \"Đang lấy hàng\" AND s.id_account = :id) AS pickuping,\n" +
                "    (SELECT COUNT(*) FROM order_lines ol JOIN shippers s ON s.id = ol.delivery_shipper_id WHERE status = \"Đang vận chuyển tới người nhận\" AND s.id_account = :id) AS deliveringToReceiver,\n" +
                "    (SELECT COUNT(*) FROM order_lines ol JOIN shippers s ON s.id = ol.delivery_shipper_id WHERE status = \"Đã hoàn thành\" AND s.id_account = :id) AS done,\n" +
                "    \t(SELECT COUNT(*) FROM order_lines ol JOIN shippers s ON s.id = ol.pickup_shipper_id  JOIN shippers s2 ON s2.id = ol.delivery_shipper_id WHERE s.id_account = :id OR s2.id_account = :id) AS total;";
        Query query = entityManager.createNativeQuery(sbQuery);
        query.setParameter("id",idAccountShipper);
        Object[] result = (Object[]) query.getSingleResult();
        CountOrderLineByTypeResponse response = new CountOrderLineByTypeResponse();
        response.setWaitPickUp(((Number) result[0]).longValue());
        response.setDeliveringToReceiver(((Number) result[1]).longValue());
        response.setDone(((Number) result[2]).longValue());
        response.setTotal(((Number) result[3]).longValue());
        return response;

    }
    @Override
    public List<OrderLine> findByCondition(FilterOrderLineRequest request) {
        StringBuilder queryStr = new StringBuilder();
        queryStr.append("SELECT ol FROM OrderLine ol JOIN Order o ON ol.order.id = o.id WHERE 1=1 ");

        if (!ObjectUtils.isEmpty(request.getFromCreatedAt()))
        {
            queryStr.append(" AND ol.order.createdAt >= :fromCreatedAt");
        }
        if (!ObjectUtils.isEmpty(request.getToCreatedAt()))
        {
            queryStr.append(" AND ol.order.createdAt <= :toCreatedAt");
        }
        if(!ObjectUtils.isEmpty(request.getCode()))
        {
            queryStr.append(" AND ol.waybillCode LIKE :code");
        }
        if(!ObjectUtils.isEmpty(request.getCustomerId()))
        {
            queryStr.append(" AND ol.order.customerId = :customerId");
        }
        if(!ObjectUtils.isEmpty(request.getListStatus()))
        {
            queryStr.append(" AND ol.status IN :listStatus");
        }
        if (!ObjectUtils.isEmpty(request.getStatus())) {
            queryStr.append(" AND ol.status = :status");
        }
        if (!ObjectUtils.isEmpty(request.getSellerId())) {
            queryStr.append(" AND ol.sellerId = :sellerId");
        }
        if (!ObjectUtils.isEmpty(request.getId())) {
            queryStr.append(" AND ol.id = :id");
        }
        if (!ObjectUtils.isEmpty(request.getShipperPickupDate())) {
            queryStr.append(" AND FUNCTION('DATE', ol.shipperPickupTime) = :shipperPickupDate");
        }
        if (!ObjectUtils.isEmpty(request.getConfirmDate())) {
            queryStr.append(" AND FUNCTION('DATE', ol.confirmTime) = :confirmDate");
        }
        if (!ObjectUtils.isEmpty(request.getDoneDate())) {
            queryStr.append(" AND FUNCTION('DATE', ol.doneTime) = :doneDate");
        }
        if (!ObjectUtils.isEmpty(request.getPaymentDate())) {
            queryStr.append(" AND FUNCTION('DATE', ol.paymentTime) = :paymentDate");
        }
        if (!ObjectUtils.isEmpty(request.getIdPickupShipper())) {
            queryStr.append(" AND ol.pickupShipper.idAccount = :idPickupShipper");
        }
        if (!ObjectUtils.isEmpty(request.getIdPickupWarehouse())) {
            queryStr.append(" AND ol.pickupWarehouse.idAccount = :idPickupWarehouse");
        }
        if (!ObjectUtils.isEmpty(request.getIdDeliveryShipper())) {
            queryStr.append(" AND ol.deliveryShipper.idAccount = :idDeliveryShipper");
        }
        if (!ObjectUtils.isEmpty(request.getIdDeliveryWarehouse())) {
            queryStr.append(" AND ol.deliveryWarehouse.idAccount = :idDeliveryWarehouse");
        }

        TypedQuery<OrderLine> query = entityManager.createQuery(queryStr.toString(), OrderLine.class);

        // Set parameters based on conditions
        if (!ObjectUtils.isEmpty(request.getCode())) {
            // Add the '%' wildcards around the code value when setting the parameter
            String codeWithWildcards = "%" + request.getCode() + "%";
            query.setParameter("code", codeWithWildcards);
        }
        if (!ObjectUtils.isEmpty(request.getFromCreatedAt())) {
            query.setParameter("fromCreatedAt", request.getFromCreatedAt());
        }
        if (!ObjectUtils.isEmpty(request.getToCreatedAt())) {
            query.setParameter("toCreatedAt", request.getToCreatedAt());
        }
        if (!ObjectUtils.isEmpty(request.getCustomerId())) {
            query.setParameter("customerId", request.getCustomerId());
        }
        if (!ObjectUtils.isEmpty(request.getListStatus())) {
            query.setParameter("listStatus", request.getListStatus());
        }
        if (!ObjectUtils.isEmpty(request.getStatus())) {
            query.setParameter("status", request.getStatus());
        }
        if (!ObjectUtils.isEmpty(request.getSellerId())) {
            query.setParameter("sellerId", request.getSellerId());
        }
        if (!ObjectUtils.isEmpty(request.getId())) {
            query.setParameter("id", request.getId());
        }
        if (!ObjectUtils.isEmpty(request.getShipperPickupDate())) {
            query.setParameter("shipperPickupDate", request.getShipperPickupDate());
        }
        if (!ObjectUtils.isEmpty(request.getConfirmDate())) {
            query.setParameter("confirmDate", request.getConfirmDate());
        }
        if (!ObjectUtils.isEmpty(request.getDoneDate())) {
            query.setParameter("doneDate", request.getDoneDate());
        }
        if (!ObjectUtils.isEmpty(request.getPaymentDate())) {
            query.setParameter("paymentDate", request.getPaymentDate());
        }
        if (!ObjectUtils.isEmpty(request.getIdPickupShipper())) {
            query.setParameter("idPickupShipper", request.getIdPickupShipper());
        }
        if (!ObjectUtils.isEmpty(request.getIdPickupWarehouse())) {
            query.setParameter("idPickupWarehouse", request.getIdPickupWarehouse());
        }
        if (!ObjectUtils.isEmpty(request.getIdDeliveryShipper())) {
            query.setParameter("idDeliveryShipper", request.getIdDeliveryShipper());
        }
        if (!ObjectUtils.isEmpty(request.getIdDeliveryWarehouse())) {
            query.setParameter("idDeliveryWarehouse", request.getIdDeliveryWarehouse());
        }

        return query.getResultList();
    }

}
