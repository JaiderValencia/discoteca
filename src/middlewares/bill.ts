import { Request, Response, NextFunction } from 'express'
import db from '../db'
import { body, validationResult } from 'express-validator'

export const hasFields = [
    body('note').isString().withMessage('Note field must be a string').bail().custom((value: String) => {
        
        if (value != '' && value.length < 3) {
            return Promise.reject('Note field needs a long text')
        }

        return true
    }),
    body('total').isNumeric().withMessage('Total field must be a number'),
    body('table_id').notEmpty().withMessage('client table ID is required').bail().custom(async (value) => {
        const client_table = await db.query.Client_table.findFirst({
            where: ({ id, active }, { eq, and }) => (and(
                eq(id, value),
                eq(active, true)
            ))
        })

        if (!client_table) {
            return Promise.reject('The client table ID does not exist or is inactive')
        }

        return true
    })
]

export const hasErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).send(errors.mapped())
        return
    }
    next()
}

export const isExist = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params?.id)

    const billFound = await db.query.Bill.findFirst({
        where: (billTable, { eq }) => (eq(billTable.id, id))
    })

    if (!billFound) {
        res.status(404).send({
            statusCode: 404,
            message: 'Bill not found'
        })
    }

    next()
}