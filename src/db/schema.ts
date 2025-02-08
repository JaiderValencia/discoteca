import { mysqlTable, text, real, timestamp, int, boolean, varchar } from 'drizzle-orm/mysql-core'

export const Client_table = mysqlTable('client_table', {
    id: int('id').primaryKey().autoincrement().notNull(),
    occupied: boolean('occupied').notNull().default(false),
    active: boolean('active').notNull().default(true)
})

export const Bill = mysqlTable('bill', {
    id: int('id').primaryKey().autoincrement().notNull(),
    note: text('note'),
    total: real('total').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    paymentStatus: varchar('paymentStatus', { length: 50 }).notNull().default('unpaid'),
    paymentID: text('paymentID'),
    table_id: int('table_id').notNull().references(() => Client_table.id, { onDelete: 'no action', onUpdate: 'cascade' }),
})

export const Product = mysqlTable('product', {
    id: int('id').primaryKey().autoincrement().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    price: real('price').notNull(),
})

export const BillhasProducts = mysqlTable('bill_has_products', {
    bill_id: int('bill_id').notNull().references(() => Bill.id, { onDelete: 'cascade', onUpdate: 'cascade' }).notNull(),
    product_id: int('product_id').notNull().references(() => Product.id, { onDelete: 'no action', onUpdate: 'cascade' }).notNull(),
    quantity: int('quantity').notNull().default(1)
})