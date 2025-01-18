import 'dotenv/config'
import { Request, Response } from 'express'
import db from '../db'
import { eq } from 'drizzle-orm'
import { Bill } from '../db/schema'

export default {
    create: async (req: Request, res: Response) => {        
        const newBill: typeof Bill.$inferInsert = {
            note: req.body.note,
            total: req.body.total,
            table_id: req.body.table_id,            
        }

        await db.insert(Bill).values(newBill)

        res.status(200).send({
            statusCode: 200,
            message: 'Bill created'
        })
        return
    },
    read: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)

        const bill = await db.query.Bill.findFirst({
            where: (Bill, { eq }) => eq(Bill.id, id)
        })

        if (!bill) {
            res.status(404).send({
                statusCode: 404,
                message: 'Bill not found'
            })
            return
        }

        res.send(bill)
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

        res.send('Delete bill')
        return
    },
}