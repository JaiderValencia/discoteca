import { Request, Response } from 'express'
import { Client_table } from '../db/schema'
import db from '../db'
import { count, eq } from 'drizzle-orm'

export default {
    create: async (req: Request, res: Response) => {
        const id = Number(req.body?.id) || undefined

        const newTable: typeof Client_table.$inferInsert = {
            id
        }

        await db.insert(Client_table).values(newTable)

        res.status(200).send({
            statusCode: 200,
            message: 'Client table created'
        })
        return
    },
    read: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)

        const client_table = await db.query.Client_table.findFirst({
            where: (client_table, { eq }) => eq(client_table.id, id)
        })

        if (!client_table) {
            res.status(404).send({
                statusCode: 404,
                message: 'Client table not found'
            })
            return
        }

        res.send(client_table)
        return
    },
    readAll: async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const offset = limit * (page - 1)

        const totalInDB = await db.$count(Client_table)
        const actives = (await db.select({ count: count() }).from(Client_table).where(eq(Client_table.active, true)))[0].count
        const inactives = (await db.select({ count: count() }).from(Client_table).where(eq(Client_table.active, false)))[0].count

        const limitPage = Math.ceil(totalInDB / limit)

        if (page > limitPage) {
            res.status(404).send({
                statusCode: 404,
                message: 'Page not found'
            })
            return
        }

        const client_tables = await db.select().from(Client_table).limit(limit).offset(offset)

        const next = (page >= 1 && client_tables.length == limit && page < limitPage) ? `${req.protocol}://${req.get('host')}/api/table/?page=${(page + 1)}&limit=${limit}` : null
        const prev = (page > 1) ? `${req.protocol}://${req.get('host')}/api/table/?page=${(page - 1)}&limit=${limit}` : null

        res.status(200).json({
            next,
            prev,
            page,
            limit,
            limitPage,
            totalInDB,
            actives,
            inactives,
            data: client_tables
        })
        return
    },
    update: async (req: Request, res: Response) => {
        const { id, active, occupied } = req.body

        await db.update(Client_table).set({ id, active, occupied })

        res.status(200).send({
            statusCode: 200,
            message: 'Client table updated',
        })
        return
    },
    unactivate: async (req: Request, res: Response) => {
        const id = Number(req.params.id)

        await db.update(Client_table).set({ active: false }).where(eq(Client_table.id, id))

        res.status(200).send({
            statusCode: 200,
            message: 'Client table unactivated'
        })
        return
    },
}