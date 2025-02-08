CREATE TABLE `bill` (
	`id` int AUTO_INCREMENT NOT NULL,
	`note` text,
	`total` real NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`paymentStatus` varchar(50) NOT NULL DEFAULT 'unpaid',
	`paymentID` text,
	`table_id` int NOT NULL,
	CONSTRAINT `bill_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bill_has_products` (
	`bill_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE `client_table` (
	`id` int AUTO_INCREMENT NOT NULL,
	`occupied` boolean NOT NULL DEFAULT false,
	`active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `client_table_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`price` real NOT NULL,
	CONSTRAINT `product_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bill` ADD CONSTRAINT `bill_table_id_client_table_id_fk` FOREIGN KEY (`table_id`) REFERENCES `client_table`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bill_has_products` ADD CONSTRAINT `bill_has_products_bill_id_bill_id_fk` FOREIGN KEY (`bill_id`) REFERENCES `bill`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `bill_has_products` ADD CONSTRAINT `bill_has_products_product_id_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE no action ON UPDATE cascade;