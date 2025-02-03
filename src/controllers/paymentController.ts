import 'dotenv/config'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db'

const {
    MP_ACCESS_TOKEN: accessToken,
} = process.env

export default {
    create: async (req: Request, res: Response) => {
        if (!accessToken) {
            throw new Error('MercadoPago access token not found')
        }

        const idempotencyKey = req.body.idem ?? uuid()

        const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000, idempotencyKey } })

        const preference = new Preference(client)

        const bill_id = Number(req.params.id)

        const bill = await db.query.Bill.findFirst({
            where: ({ id }, { eq }) => (eq(id, bill_id)),
            columns: { id: true, table_id: false, total: true, created_at: false, note: false }
        })

        if (!bill) {
            res.status(404).send({ message: 'Bill not found' })
            return
        }

        const preferenceCreated = await preference.create({
            body: {
                items: [
                    {
                        id: String(bill_id),
                        title: `Consumo #${bill.id}`,
                        quantity: 1,
                        unit_price: bill.total ?? 0
                    }
                ],
                payment_methods: {
                    excluded_payment_types: [
                        {
                            id: 'ticket'
                        }
                    ]
                },
                back_urls: {
                    success: 'http://localhost:3000/api/payment/success',
                    failure: 'http://localhost:3000/api/payment/failure',
                    pending: 'http://localhost:3000/api/payment/pending'
                },
                expires: true,
                expiration_date_from: new Date().toISOString(),
                expiration_date_to: new Date(Date.now() + 1800 * 1000).toISOString() //expires in 30 minutes
            },
            requestOptions: { idempotencyKey },
        })

        res.send(preferenceCreated)
    },
    success: (_: Request, res: Response) => {
        res.send('Payment success')    
    },
    pending: (_: Request, res: Response) => {
        res.send('Payment pending')
    },    
    failure: (_: Request, res: Response) => {
        res.send('Payment failure')
    }
}