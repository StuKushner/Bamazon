DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(45) NOT NULL,
	price DECIMAL(10, 2) NOT NULL,
	stock_quantity INT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone X", "Electronics", 999.99, 10), 
("MacBook Pro", "Electronics", 1399.99, 9), 
("Tory Burch Handbag", "Women's", 200.00, 8), 
("Toy Honda", "Toys", 20000.00, 1), 
("Crystal Swan", "Crystal", 1500.00, 3), 
("Electric Guitar", "Musical Instruments", 200.00, 4), 
("D3 5000 IU", "Health and Beauty", 25.00, 18), 
("Adidas Gym Bag", "Sports", 19.99, 20), 
("Pack of #2 Pencils", "School Supplies", 4.99, 57), 
("Suitcase", "Travel", 100.00, 15);

