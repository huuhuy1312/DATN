DROP SCHEMA IF EXISTS `product_service`;
CREATE SCHEMA `product_service`;
USE `product_service`;

CREATE TABLE suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_parent_id bigint,
    `name` VARCHAR(255)
);
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    seller_id BIGINT,
    title1 varchar(255),
    title2 varchar(255),
    category_id bigint,
    supplier_id BIGINT,
    origin varchar(255),
    is_deleted tinyint(1) default 0,
    created_at datetime,
    CONSTRAINT fk_category_product FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_supplier_product FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);	
CREATE TABLE types_of_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    label1 VARCHAR(255),
    label2 VARCHAR(255),
    quantity INT,
    price BIGINT,
    cost BIGINT,
    weight bigint,
    original_price BIGINT,
    is_deleted tinyint(1) default 0,
    product_id BIGINT
);
 

ALTER TABLE types_of_product
ADD CONSTRAINT fk_types_of_product_product_id
FOREIGN KEY (product_id) 
REFERENCES products(id)
ON DELETE CASCADE;
create table image_classifications(
	id BIGINT auto_increment primary key,
    classification1 varchar(255),
    product_id bigint
);
ALTER TABLE image_classifications
ADD CONSTRAINT fk_image_classifications1_product_id
FOREIGN KEY (product_id) 
REFERENCES products(id)
ON DELETE CASCADE;


create table product_service.rates(
	id BIGINT auto_increment primary key,
    item_id bigint,
    customer_id bigint,
    content LongText,
    rate_star int,
    type_of_product_id bigint,
    created_date datetime,
    reply_seller longtext,
    customer_name varchar(100),
	CONSTRAINT fk_rate_product FOREIGN KEY (type_of_product_id) REFERENCES types_of_product(id)
);

insert into categories (id,category_parent_id,name)
values(1,null,"Thời Trang Nữ"),
(2,1,"Áo"),
(3,1,"Quần"),
(4,1,"Quần đùi"),
(5,1,"Váy"),
(6,1,"Quần jeans"),
(7,1,"Đầm"),
(8,1,"Váy cưới"),
(9,1,"Đồ liền thân"),
(10,1,"Áo khoác");

insert into categories (id,category_parent_id,name)
values(11,null,"Thời Trang Nam"),
(12,11,"Áo"),
(13,11,"Quần"),
(14,11,"Quần đùi"),
(15,11,"Áo len"),
(16,11,"Quần jeans"),	
(17,11,"Com lê"),
(18,11,"Hoodie & Áo nỉ"),
(19,11,"Quần dài"),
(20,11,"Áo khoác"),
(21,20,"Áo khoác dài");
insert into product_service.suppliers
values(1,"Nhà cung cấp 1");
use product_service;
SELECT tp.id,tp.label1, tp.label2, p.name, p.id AS product_id, p.seller_id, tp.price, 
       GROUP_CONCAT(DISTINCT tp1.label1) AS listClassifications1, 
       GROUP_CONCAT(DISTINCT tp1.label2) AS listClassifications2, 
       tp.quantity AS maxQuantity, tp.original_price, tp.weight ,ic.id as icId
FROM types_of_product tp 
JOIN products p ON tp.product_id = p.id 
JOIN image_classifications ic ON ic.product_id = tp.product_id AND ic.classification1 = tp.label1
LEFT JOIN types_of_product tp1 ON tp1.product_id = p.id 
WHERE tp.id IN (1)
GROUP BY tp.id, tp.label1, tp.label2, p.name, p.id, p.seller_id, tp.price, tp.quantity, tp.original_price, tp.weight,ic.id;

