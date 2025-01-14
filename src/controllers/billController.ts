import 'dotenv/config'
import { Request, Response } from 'express'
import db from '../db'
import { eq } from 'drizzle-orm'
import { Bill } from '../db/schema'
import moment from 'moment-timezone'

export default {
    create: async (req: Request, res: Response) => {
        const { TIME_ZONE } = process.env

        if (!TIME_ZONE) {
            throw new Error('TIME_ZONE is not defined')
        }

        const newBill: typeof Bill.$inferInsert = {
            client_name: req.body.client_name,
            client_id: req.body.client_id,
            note: req.body.note,
            total: req.body.total,
            table_id: req.body.table_id,
            created_at: moment.tz(TIME_ZONE).toDate(),
        }

        await db.insert(Bill).values(newBill)

        res.send('Created bill')
        return
    },
    read: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)

        const bill = await db.query.Bill.findFirst({
            where: (Bill, { eq }) => eq(Bill.id, id)
        })

        if (!bill) {
            res.status(404).send('Bill not found')
            return
        }

        res.send(bill)
        return
    },
    readAll: async (_: Request, res: Response) => {
        const bills = await db.select().from(Bill)

        res.send(bills)
        return
    },
    update: (_: Request, res: Response) => {
        res.send('Update bill')
        return
    },
    delete: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)

        await db.delete(Bill).where(eq(Bill.id, id))

        res.send('Delete bill')
        return
    },
}