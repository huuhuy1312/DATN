DROP SCHEMA IF EXISTS `user_service`;
CREATE SCHEMA `user_service`;
USE `user_service`;
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL
);
CREATE TABLE otps(
	id INT PRIMARY KEY AUTO_INCREMENT,
    `otp_code` nvarchar(120) not null,
    `action` nvarchar(120) not null,
    `info_related` nvarchar(120) not null,
    `is_actived` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(120) NOT NULL,
    `password` VARCHAR(120) NOT NULL,
    role_id int,
    foreign key(role_id) references roles(id),
    UNIQUE KEY username (username)
);

CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name varchar(100),
    email varchar(50),
    phone_number varchar(12),
    gender varchar(15),
    date_of_birth datetime,
    account_id bigint,
	foreign key(account_id) references accounts(id)
);


CREATE TABLE seller (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    shop_name VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone_number VARCHAR(12) NOT NULL,
    CIN VARCHAR(20),
    full_name VARCHAR(255),
    id_image_ci_card VARCHAR(255),
    id_image_hold_ci_card VARCHAR(255),
    account_id BIGINT,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id)
);
alter table user_service.seller
add column is_active tinyint;
CREATE TABLE rates(
	id bigint primary key auto_increment,
	rate_star int not null,
    rate_review longtext,
    product_id bigint not null,
    customer_id bigint not null,
    foreign key(customer_id) references customers(id)
);
-- CREATE TABLE address (
--     id BIGINT PRIMARY KEY AUTO_INCREMENT,
--     city VARCHAR(255),
--     district VARCHAR(255),
--     ward VARCHAR(255),
--     address_details VARCHAR(255),
-- 	name_user varchar(50),
--     phone_number_user varchar(12),
--     seller_id bigint,
--     customer_id bigint,
--     foreign key (seller_id) references seller(id),
--     foreign key (customer_id) references customers(id)
-- );

-- CREATE TABLE shipment (
--     id BIGINT PRIMARY KEY AUTO_INCREMENT,
--     price_per_km BIGINT,
--     name VARCHAR(255),
--     max_kg INT,
--     UNIQUE KEY (id)
-- );

-- CREATE TABLE `orders` (
--     id BIGINT PRIMARY KEY AUTO_INCREMENT,
--     total_price BIGINT,
--     status VARCHAR(255),
--     date_create DATETIME,
--     customer_id BIGINT,
--     shipment_id BIGINT,
--     FOREIGN KEY (customer_id) REFERENCES customers(id),
--     FOREIGN KEY (shipment_id) REFERENCES shipment(id)
-- );

INSERT INTO roles (name) VALUES ('ROLE_USER');
INSERT INTO roles (name) VALUES ('ROLE_SELLER');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');


-- SELECT *
-- FROM `e-commerce`.item_in_cart AS iic
-- inner JOIN `e-commerce`.types_of_product AS top ON iic.top_id = top.id
-- inner join `e-commerce`.product as p on p.id = top.product_id
-- inner join `e-commerce`.image_classifications1 as ic on ic.product_id =p.id and ic.classification1=top.label1
-- WHERE iic.top_id = 7;

insert into accounts(username,`password`,role_id)
values("user1","$2a$12$ZIeUypgYW6JsS7MCDZfdBeNK68/teoTHl9XmDnvlmvuzk30P1kfte",1),
("user2","$2a$12$ZIeUypgYW6JsS7MCDZfdBeNK68/teoTHl9XmDnvlmvuzk30P1kfte",1),
("user3","$2a$12$ZIeUypgYW6JsS7MCDZfdBeNK68/teoTHl9XmDnvlmvuzk30P1kfte",1);

INSERT INTO customers(full_name, email, phone_number, gender, date_of_birth, account_id)
VALUES ("Nguyễn Hữu Huy", "flslayder1312@gmail.com", "0868703608", "Nam", "2002-12-13", 1),
("Nguyễn Văn A", "abc1@gmail.com", "0868703308", "Nam", "2002-12-13", 1),
("Nguyễn Văn B", "abc2@gmail.com", "0868703408", "Nam", "2002-12-13", 1);

insert into seller(id,shop_name,email,phone_number,CIN,full_name,id_image_ci_card,id_image_hold_ci_card,account_id) values
(1,"Shop sỉ lẻ hot trend","flslayder1312@gmail.com","0868703508","01234567890","Nguyễn Hữu Huy","abc.png","def.png",1),
(2,"Shop sỉ lẻ hot trend 2","flslayder1312@gmail.com","0868702508","01236567890","Nguyễn Văn A","abc.png","def.png",2);