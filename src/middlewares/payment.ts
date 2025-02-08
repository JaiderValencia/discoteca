import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import db from '../db'
import crypto from 'crypto'

const { MP_WEBHOOK_TOKEN } = process.env

export const checkPayment = async (req: Request, res: Response, next: NextFunction) => {
    const bill_id = Number(req.params.id)

    const bill = await db.query.Bill.findFirst({
        where: ({ id }, { eq }) => (eq(id, bill_id)),
        columns: { paymentID: true, paymentStatus: true, id: false, created_at: false, note: false, table_id: false, total: false }
    })

    if (!bill) {
        res.status(404).send({
            statusCode: 404,
            message: 'Bill not found'
        })
        return
    }

    if (bill.paymentStatus == 'approved') {
        res.status(400).send({
            statusCode: 400,
            message: 'Bill is already paid'
        })
        return
    }

    next()
}

export const validateHeaderWebhook = (req: Request, res: Response, next: NextFunction) => {
    if (!MP_WEBHOOK_TOKEN) throw new Error('MercadoPago webhook token not found')

    const id = req.body.data?.id

    const requestId = req.headers['x-request-id'] || null

    const xSignature = (req.headers['x-signature'] as String).split(',')
    let tsHeader = null
    let signature = null

    for (const part of xSignature) {
        if (part.includes('ts=')) {
            tsHeader = part.split('=')[1].trim()
        }

        if (part.includes('v1=')) {
            signature = part.split('=')[1].trim()
        }
    }

    const manifest = `id:${id};request-id:${requestId};ts:${tsHeader};`

    const cyphedSignature = crypto
        .createHmac('sha256', MP_WEBHOOK_TOKEN)
        .update(manifest)
        .digest('hex')

    if (cyphedSignature != signature) {
        res.status(401).send({ statusCode: 401, message: 'unauthorized' })
        return
    }

    next()
}