import { body } from 'express-validator'
import { Response, Request, NextFunction } from 'express'
import db from '../db'
import { Client_table } from '../db/schema'
import { eq } from 'drizzle-orm'

export const hasFields = [
    body('id').notEmpty().withMessage('Must have ID field').bail().isNumeric().withMessage('ID field must be a number'),
    body('active').notEmpty().withMessage('Must have active field').bail().isBoolean().withMessage('Active field must be a boolean'),
    body('occupied').notEmpty().withMessage('Must have occupied field').bail().isBoolean().withMessage('occupied field must be a boolean')
]

export const isActive = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params?.id)

    const client_table = await db.query.Client_table.findFirst({
        where: (client_table, { eq, and }) => (
            and(eq(client_table.id, id), eq(client_table.active, true))
        )
    })

    if (!client_table) {
        res.status(404).send({ statusCode: 404, message: 'client table not found' })
        return
    }

    next()
}

export const notRepeatRecord = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.body.id)

    if (!id) {
        next()
        return
    }

    const client_table = await db.query.Client_table.findFirst({
        where: (client_table, { eq }) => (
            eq(client_table.id, id)
        )
    })

    if (client_table?.active) {
        res.status(200).send({ statusCode: 200, message: 'client table is already active' })

        return

    }

    await db.update(Client_table).set({ active: true }).where(eq(Client_table.id, id))

    res.status(200).send({ statusCode: 200, message: 'client table reactivated' })

    return
}