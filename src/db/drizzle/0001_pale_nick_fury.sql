CREATE TABLE `product_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `product_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `product` ADD `category_id` int;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_product_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `product_category`(`id`) ON DELETE set null ON UPDATE cascade;