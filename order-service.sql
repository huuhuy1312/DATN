DROP SCHEMA IF EXISTS `order_service`;
CREATE SCHEMA `order_service`;
USE `order_service`;
CREATE TABLE `address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `address_details` varchar(255) DEFAULT NULL,
  `name_user` varchar(50) DEFAULT NULL,
  `phone_number_user` varchar(12) DEFAULT NULL,
  `seller_id` bigint DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `is_deleted` tinyint default 0,
  `is_default` tinyint,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `vouchers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `reduce_max_amount` bigint DEFAULT NULL,
  `condition_amount` bigint DEFAULT NULL,
  `percent_reduce` double DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `max_quantity` bigint DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `shipping_methods` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price_from_0_to_1kg` bigint DEFAULT NULL,
  `price_from_1_to_1_5kg` bigint DEFAULT NULL,
  `price_from_1_5_to_2kg` bigint DEFAULT NULL,
  `price_next_0_5kg` bigint DEFAULT NULL,
  `price_per_1km` bigint DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `voucher_offset_id` bigint DEFAULT NULL,
  `day_standard` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shipping_methods_voucher` (`voucher_offset_id`),
  CONSTRAINT `fk_shipping_methods_voucher` FOREIGN KEY (`voucher_offset_id`) REFERENCES `vouchers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `warehouses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `address_id` bigint DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `id_account` bigint,
  PRIMARY KEY (`id`),
  KEY `fk_warehouses_address` (`address_id`),
  CONSTRAINT `fk_warehouses_address` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
   `status` varchar(100),
  `address_ship_id` bigint DEFAULT NULL,
  `total_amount` bigint DEFAULT NULL,
  `payment_method` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`address_ship_id`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- ALTER TABLE order_service.orders
-- DROP FOREIGN KEY fk_order_lines_warehouse_delivery;

-- alter table order_service.orders
-- drop column delivery_warehouse_id;

CREATE TABLE `shippers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
	phone_number varchar(15),
  `note` varchar(255),
  `warehouse_id` bigint DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT NULL,
  `id_account` bigint,
  PRIMARY KEY (`id`),
  KEY `fk_shipper_warehouse` (`warehouse_id`),
  CONSTRAINT `fk_shipper_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `order_lines` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `seller_id` bigint DEFAULT NULL,
  `reason_cancel` varchar(255) DEFAULT NULL,
  `shipper_pickup_time` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `customer_message` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `confirm_time` datetime DEFAULT NULL,
  `waybill_code` varchar(15) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `seller_pickup_request_date` date DEFAULT NULL,
  `pickup_warehouse_id` bigint DEFAULT NULL,
  `pickup_shipper_id` bigint DEFAULT NULL,
  delivery_warehouse_receive_time datetime,
  `shipping_method_id` bigint DEFAULT NULL,
  shipper_delivery_time datetime,
  `done_time` datetime DEFAULT NULL,
  `delivery_shipper_id` bigint DEFAULT NULL,
`payment_time` datetime DEFAULT NULL,
      `delivery_warehouse_id` bigint DEFAULT NULL,
  ship_cost bigint,
  PRIMARY KEY (`id`),
  KEY `fk_order_lines_warehouse_pickup` (`pickup_warehouse_id`),
  KEY `fk_order_lines_shipper_pickup` (`pickup_shipper_id`),
  KEY `fk_order_lines_orders` (`order_id`),
  CONSTRAINT `fk_order_lines_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_lines_shipper_pickup` FOREIGN KEY (`pickup_shipper_id`) REFERENCES `shippers` (`id`),
  CONSTRAINT `fk_order_lines_warehouse_pickup` FOREIGN KEY (`pickup_warehouse_id`) REFERENCES `warehouses` (`id`),
	CONSTRAINT `fk_order_lines_warehouse_delivery` FOREIGN KEY (`delivery_warehouse_id`) REFERENCES `warehouses` (`id`),
  CONSTRAINT `fk_order_lines_shipping_methods` FOREIGN KEY (`shipping_method_id`) REFERENCES `shipping_methods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

alter table order_service.order_lines
add column `payment_time` datetime DEFAULT NULL;

ALTER TABLE order_service.order_lines
ADD COLUMN `delivery_warehouse_id` BIGINT DEFAULT NULL;

ALTER TABLE order_service.order_lines
ADD CONSTRAINT `fk_order_lines_warehouse_delivery`
    FOREIGN KEY (`delivery_warehouse_id`) REFERENCES `warehouses` (`id`);






CREATE TABLE `vouchers_orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `voucher_id` bigint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_vouchers_orders_orders` (`order_id`),
  KEY `fk_vouchers_orders_vouchers` (`voucher_id`),
  CONSTRAINT `fk_vouchers_orders_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_vouchers_orders_vouchers` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type_of_product_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `order_line_id` bigint DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_items_order_lines` (`order_line_id`),
  CONSTRAINT `fk_items_order_lines` FOREIGN KEY (`order_line_id`) REFERENCES `order_lines` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO order_service.`vouchers` (id,`type`,`reduce_max_amount`,`condition_amount`,`percent_reduce`,`start_date`,`end_date`,`max_quantity`,is_active) 
VALUES (1,'Giảm tiền ship',45000,0,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',NULL,1),
(2,'Giảm tiền ship',25000,50000,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',2,1),
(3,'Giảm tiền ship',150000,100000,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',9,1),
(4,'Giảm tiền ship',300000,100000,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',NULL,1),
(5,'Giảm tiền ship',40000,100000,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',10,1),
(6,'Giảm tiền ship',300000,500000,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',10,1),
(7,'Giảm tiền hàng',45000,0,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',10,1),
(8,'Giảm tiền hàng',80000,0,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',10,1),
(9,'Giảm tiền hàng',10000,0,10,'2024-10-01 00:00:00','2024-12-30 23:59:59',10,1),
(10,'Giảm tiền hàng',25000,0,50,'2024-10-01 00:00:00','2024-12-30 23:59:59',10,1),
(11,'Giảm tiền hàng',25000,25000,12,'2024-10-01 00:00:00','2024-12-30 23:59:59',10,1),
(12,'Giảm tiền hàng',15000,0,NULL,'2024-10-01 00:00:00','2024-12-30 23:59:59',NULL,1);
INSERT INTO order_service.`vouchers` (id,`type`,`reduce_max_amount`,`condition_amount`,`percent_reduce`,`start_date`,`end_date`,`max_quantity`,is_active) 
values
(13,'Giảm tiền hàng',45000,0,12.5,'2024-10-01 00:00:00','2024-12-30 23:59:59',NULL,1);

INSERT INTO order_service.address(id,city,district,ward,address_details,name_user,phone_number_user,seller_id,customer_id,longitude,latitude)
VALUES 
(1,'Hà Nội','Thanh Xuân','Thanh Xuân Nam','74, Ngõ 42, Phố Triều Khúc','Nguyễn Hữu Huy','0868703608',NULL,2,105.79712,20.9853304),
(2,'Hà Nội','Hà Đông','Mộ Lao','Ngõ 4 Đường Thanh Bình','Trần Hữu Nhật','0987654321',2,NULL,105.78111,20.97635),
(3,'Hà Nội','Cầu Giấy','Dịch Vọng Hậu','36, Phố Dịch Vọng Hậu','Phạm Minh Thắng','0971237812',1,NULL,105.78707,21.0327),
(4,'Hà Nội','Hà Đông ','Yết Kiêu','4, Phố Tiểu Công Nghệ','Kho vận Yết Kiêu','0936179876',NULL,NULL,105.77979,20.97422),
(5,'Hà Nội','Hà Đông','Vạn Phúc','12, Ngô Quyền','Kho vận chuyển Vạn Phúc','0817239881',NULL,NULL,105.77608,20.97582),
(6,'Hà Nội','Cầu Giấy','Trung Hòa','42 Phố Lưu Quang Vũ','Kho vận chuyển Trung Hòa','0912813713',NULL,NULL,105.80228,21.01707),
(7,'Hà Nội','Mễ Trì','Mễ Trì Thượng','Số 9','Kho vận chuyển Mễ Trì Thượng','0981222268',NULL,NULL,105.77851,21.00505),
(8,'Hà Nội','Hà Đông','Khu đô thị Xa La','Kiot2 Ct2A','Kho vận chuyển Xa La','0992831981',NULL,NULL,105.79536,20.96273),
(9,'Hà Nội','Thanh Xuân','Hạ Đình','182 Đường Nguyễn Xiển','Kho vận chuyển Nguyễn Xiền','0991239813',NULL,NULL,105.80561,20.98777);
INSERT INTO order_service.`shipping_methods` VALUES 
(1,10000,11000,12000,100,100,NULL,'Tiết Kiệm',12,4),
(2,12000,13000,14000,100,150,NULL,'Nhanh',12,3),
(3,14000,15000,16000,150,200,NULL,'Hỏa Tốc',12,2);


INSERT INTO `order_service`.`warehouses` VALUES (1,'Kho vận chuyển Yết Kiêu',4,1,4),(2,'Kho vận chuyển Vạn Phúc',5,1,5);
INSERT INTO `order_service`.`warehouses` (`id`, `name`, `address_id`, `is_active`,id_account) VALUES ('3', 'Kho vận chuyển Trung Hòa', '6', '1',6);
INSERT INTO `order_service`.`warehouses` (`id`, `name`, `address_id`, `is_active`,id_account) VALUES ('4', 'Kho vận chuyển Mễ Trì Thượng', '7', '1',7);
INSERT INTO `order_service`.`warehouses` (`id`, `name`, `address_id`, `is_active`,id_account) VALUES ('5 ', 'Kho vận chuyển Khu đô thị Xa La', '8', '1',8);
INSERT INTO `order_service`.`warehouses` (`id`, `name`, `address_id`, `is_active`,id_account) VALUES ('6', 'Kho vận chuyển Nguyễn Xiển', '9', '1',9);
INSERT INTO `order_service`.`shippers` (`id`, `code`, `name`, `warehouse_id`, `is_active`, `is_deleted`,phone_number) VALUES ('1', 'SHP00000', 'Trần Văn Khang', '1', '1', '0','0984 123 456');
INSERT INTO `order_service`.`shippers` (`id`, `code`, `name`, `warehouse_id`, `is_active`, `is_deleted`,phone_number) VALUES ('2', 'SHP00001', 'Nguyễn Phi Hoàng', '1', '1', '0','0903 456 789');
INSERT INTO `order_service`.`shippers` (`id`, `code`, `name`, `warehouse_id`, `is_active`, `is_deleted`,phone_number) VALUES ('3', 'SHP00002', 'Đỗ Văn Hợp', '1', '1', '0','0912 987 654');
INSERT INTO `order_service`.`shippers` (`id`, `code`, `name`, `warehouse_id`, `is_active`, `is_deleted`,phone_number) VALUES ('4', 'SHP00003', 'Nguyễn Hoàng Phong', '6', '1', '0','0935 321 987');
INSERT INTO `order_service`.`shippers` (`id`, `code`, `name`, `warehouse_id`, `is_active`, `is_deleted`,phone_number) VALUES ('5', 'SHP00004', 'Trần Văn Dương', '6', '1', '0','0968 654 321');
INSERT INTO `order_service`.`shippers` (`id`, `code`, `name`, `warehouse_id`, `is_active`, `is_deleted`,phone_number) VALUES ('6', 'SHP00005', 'Lê Văn Khiểm', '6', '1', '0','0888 123 456');
UPDATE `order_service`.`shippers` SET `note` = 'Thường hoạt động và vận chuyển các đơn ở khu vực ABC' WHERE (`id` = '1');
UPDATE `order_service`.`shippers` SET `note` = 'Thường hoạt động và vận chuyển các đơn ở khu vực DEF' WHERE (`id` = '2');
UPDATE `order_service`.`shippers` SET `note` = 'Thường hoạt động và vận chuyển các đơn ở khu vực GHI' WHERE (`id` = '3');
UPDATE `order_service`.`shippers` SET `note` = 'Thường bận vào chiều thứ 4 và sáng thứ 7.Thường hoạt động và vận chuyển các đơn ở khu vực KIM' WHERE (`id` = '4');
UPDATE `order_service`.`shippers` SET `note` = 'Thường bận và sáng chủ nhật và chiều thứ 2. Thường hoạt động và vận chuyển các đơn ở khu vực ANDS' WHERE (`id` = '5');
UPDATE `order_service`.`shippers` SET `note` = 'Thường bận và sáng chủ nhật và chiều thứ 2. Thường hoạt động và vận chuyển các đơn ở khu vực ÁDAS' WHERE (`id` = '6');

-- SELECT 
--     w.id,w.name,a.city,a.district,a.ward,a.address_details,
--     (
--         6371 * ACOS(
--             COS(RADIANS()) * COS(RADIANS(a.latitude)) *
--             COS(RADIANS(a.longitude) - RADIANS(:input_longitude)) +
--             SIN(RADIANS(:input_latitude)) * SIN(RADIANS(a.latitude))
--         )
--     ) AS distance
-- FROM warehouses w
-- JOIN address a ON w.address_id = a.id
-- WHERE w.is_active = 1
-- ORDER BY distance_km ASC;
