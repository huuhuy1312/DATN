DROP SCHEMA IF EXISTS `order_service`;
CREATE SCHEMA `order_service`;
USE `order_service`;
CREATE TABLE address (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    city VARCHAR(255),
    district VARCHAR(255),
    ward VARCHAR(255),
    address_details VARCHAR(255),
	name_user varchar(50),
    phone_number_user varchar(12),
    seller_id bigint,
    customer_id bigint
);
-- Tạo bảng orders
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50),
    created_at DATETIME,
    customer_id BIGINT,
    address_ship_id BIGINT,
    total_amount BIGINT,
    payment_method NVARCHAR(100),
    foreign key (address_ship_id) references address(id)
);
CREATE TABLE vouchers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type NVARCHAR(50),
    reduce_max_amount BIGINT,
    condition_amount BIGINT,
    percent_reduce DOUBLE,
    image NVARCHAR(100),
    start_date DATETIME,
    end_date DATETIME,
    max_quantity BIGINT,
    is_active TINYINT(1)
);
CREATE TABLE shipping_methods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    price_from_0_to_1kg BIGINT,
    price_from_1_to_1_5kg BIGINT,
    price_from_1_5_to_2kg BIGINT,
    price_next_0_5kg BIGINT,
    price_per_1km BIGINT,
    description VARCHAR(255),
    name VARCHAR(50),
    voucher_offset_id BIGINT,
    day_standard INT,
    CONSTRAINT fk_shipping_methods_voucher FOREIGN KEY (voucher_offset_id)
        REFERENCES vouchers (id)
);
-- Tạo bảng order_lines
CREATE TABLE order_lines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    seller_id BIGINT,
    reason_cancel VARCHAR(255),
    shipper_pickup_time DATETIME,
    payment_time DATETIME,
    status VARCHAR(50),
    order_id BIGINT,
    shipping_method_id BIGINT,
    customer_message nvarchar(255),
    done_time DATETIME,
    confirm_time DATETIME,
    order_line_code nvarchar(8),
    CONSTRAINT fk_order_lines_orders FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_lines_shipping_methods FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id)
);
-- Tạo bảng items
CREATE TABLE items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_of_product_id BIGINT,
    quantity INT,
    customer_id bigint,
    order_line_id BIGINT,
    is_active TINYINT(1),
    CONSTRAINT fk_items_order_lines FOREIGN KEY (order_line_id) REFERENCES order_lines(id)
);

-- Tạo bảng vouchers


-- Tạo bảng vouchers_orders (nhiều-nhiều giữa vouchers và orders)
CREATE TABLE vouchers_orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    voucher_id BIGINT,
    order_id BIGINT,
    CONSTRAINT fk_vouchers_orders_orders FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_vouchers_orders_vouchers FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

-- Tạo bảng shipping_methods

insert into vouchers(id,`type`,reduce_max_amount,condition_amount,percent_reduce,image,start_date,end_date,max_quantity,is_active)
values(1,"Giảm tiền ship",45000,0,null,"free_ship_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",null,1),
(2,"Giảm tiền ship",25000,50000,null,"free_ship_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",2,1),
(3,"Giảm tiền ship",150000,100000,null,"free_ship_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",9,1),
(4,"Giảm tiền ship",300000,100000,null,"free_ship_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",null,1),
(5,"Giảm tiền ship",40000,100000,null,"free_ship_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",10,1),
(6,"Giảm tiền ship",300000,500000,null,"free_ship_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",10,1),
(7,"Giảm tiền hàng",45000,0,null,"discount_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",10,1),
(8,"Giảm tiền hàng",80000,0,null,"discount_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",10,1),
(9,"Giảm tiền hàng",10000,0,10.0,"discount_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",10,1),
(10,"Giảm tiền hàng",25000,0,50.0,"discount_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",10,1),
(11,"Giảm tiền hàng",25000,25000,12.0,"discount_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",10,1),
(12,"Giảm tiền hàng",15000,0,null,"discount_voucher.png","2024-10-01 00:00:00", "2024-10-30 23:59:59",null,1);
SELECT * FROM vouchers;
insert into order_service.items(id,type_of_product_id, customer_id, quantity)
values(1,2,2,6),
(2,6,2,3);
insert into order_service.address(id,city,district,ward,address_details,name_user,phone_number_user,seller_id,customer_id)
values(1,"Hà Nội","Thanh Xuân","Thanh Xuân Nam", "74, Ngõ 42, Phố Triều Khúc", "Nguyễn Hữu Huy","0868703608",null,2),
(2,"Hà Nội","Hà Đông","Mộ Lao","Ngõ 4 Đường Thanh Bình","Trần Hữu Nhật","0987654321",2,null),
('3', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng Hậu', '36, Phường Dịch Vọng Hậu', 'Phạm Minh Thắng', '0987168317', '1',null);
INSERT INTO `order_service`.`shipping_methods` (`id`, `price_from_0_to_1kg`, `price_from_1_to_1_5kg`, `price_from_1_5_to_2kg`, `price_next_0_5kg`, `price_per_1km`, `name`, `voucher_offset_id`, `day_standard`) VALUES ('1', '10000', '11000', '12000', '100', '100', 'Tiết Kiệm', '12', '4');
INSERT INTO `order_service`.`shipping_methods` (`id`, `price_from_0_to_1kg`, `price_from_1_to_1_5kg`, `price_from_1_5_to_2kg`, `price_next_0_5kg`, `price_per_1km`, `name`, `voucher_offset_id`, `day_standard`) VALUES ('2', '12000', '12500', '13000', '150', '150', 'Nhanh', '12', '3');
INSERT INTO `order_service`.`shipping_methods` (`id`, `price_from_0_to_1kg`, `price_from_1_to_1_5kg`, `price_from_1_5_to_2kg`, `price_next_0_5kg`, `price_per_1km`, `name`, `voucher_offset_id`, `day_standard`) VALUES ('3', '14000', '15000', '16000', '200', '200', 'Hỏa Tốc', '12', '2');
INSERT INTO order_service.order_lines(id,seller_id,reason_cancel,shipper_pickup_time,payment_time,`status`,order_id,shipping_method_í,customer_message,done_time,confirm_time,order_line_code)
values(1,2,null,null,null,"Chờ xác nhận",2,1,"Vui lòng gói sản phẩm cẩn thận",null,null,"A858ED51"),
(2,1,null,null,null,"Chờ xác nhận",2,1,"Vui lòng gói sản phẩm cẩn thận",null,null,"DB5D8A94");

INSERT INTO order_service.orders (id,code,created_at,customer_id,address_ship_id,total_amount,payment_method)
value(2,"6197FBE2","2024-10-20 13:32:03",2,null,17998,"THANH TOÁN KHI NHẬN HÀNG");