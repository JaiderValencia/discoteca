import 'dotenv/config'
import { Request, Response } from 'express'
import db from '../db'
import { eq } from 'drizzle-orm'
import { Bill, BillhasProducts, Product } from '../db/schema'
import { ProductOnBill } from '../utils/bill'

export default {
    create: async (req: Request, res: Response) => {
        const newBill: typeof Bill.$inferInsert = {
            note: req.body.note,
            total: req.body.total,
            table_id: req.body.table_id,
        }

        const billId = (await db.insert(Bill).values(newBill).$returningId())[0].id

        let products: ProductOnBill[] = req.body.products

        products = products.map(product => {
            if (!product.delete) {
                return { ...product, bill_id: billId }
            }
        }).filter(product => product !== undefined)

        await db.insert(BillhasProducts).values(products)

        res.status(200).send({
            statusCode: 200,
            message: 'Bill created',
        })        
    },
    read: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)

        const bill = await db.query.Bill.findFirst({
            where: (Bill, { eq }) => eq(Bill.id, id),
        })

        const products = await db.select({ product_id: BillhasProducts.product_id, product_name: Product.name, quantity: BillhasProducts.quantity }).from(BillhasProducts).where(eq(BillhasProducts.bill_id, id)).leftJoin(Product, eq(BillhasProducts.product_id, Product.id))

        if (!bill) {
            res.status(404).send({
                statusCode: 404,
                message: 'Bill not found'
            })
            return
        }

        res.status(200).send({ ...bill, products })
        return
    },
    readAll: async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const offset = limit * (page - 1)

        const totalInDB = await db.$count(Bill)

        const limitPage = Math.ceil(totalInDB / limit)

        if (page > limitPage) {
            res.status(404).send({
                statusCode: 404,
                message: 'Page not found'
            })
            return
        }

        const bills = await db.select().from(Bill).offset(offset).limit(limit)

        const next = (page >= 1 && bills.length == limit && page < limitPage) ? `${req.protocol}://${req.get('host')}/api/bill/?page=${(page + 1)}&limit=${limit}` : null
        const prev = (page > 1) ? `${req.protocol}://${req.get('host')}/api/bill/?page=${(page - 1)}&limit=${limit}` : null

        res.status(200).send({
            next,
            prev,
            page,
            limit,
            limitPage,
            totalInDB,
            data: bills
        })
    },
    update: async (req: Request, res: Response) => {
        const id = Number(req.params.id)

        const { note, total, table_id } = req.body

        await db.update(Bill).set({ note, total, table_id }).where(eq(Bill.id, id))

        res.status(200).send({
            statusCode: 200,
            message: 'Bill updated'
        })
        return
    },
    delete: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)

        await db.delete(Bill).where(eq(Bill.id, id))

        res.status(200).send({
            statusCode: 200,
            message: 'Bill deleted'
        })
        return
    },
}