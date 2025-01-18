import { mysqlTable, text, real, timestamp, int, boolean, varchar } from 'drizzle-orm/mysql-core'

export const Client_table = mysqlTable('client_table', {
    id: int('id').primaryKey().autoincrement(),
    occupied: boolean('occupied').notNull().default(false),
    active: boolean('active').notNull().default(true)
})

export const Bill = mysqlTable('bill', {
    id: int('id').primaryKey().autoincrement(),
    note: text('note'),
    total: real('total').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    table_id: int('table_id').notNull().references(() => Client_table.id, { onDelete: 'no action', onUpdate: 'cascade' }),
})

export const Product = mysqlTable('product', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 100 }).notNull(),
    price: real('price').notNull()
})