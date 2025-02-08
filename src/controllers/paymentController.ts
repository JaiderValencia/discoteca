import 'dotenv/config'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import db from '../db'
import { Bill } from '../db/schema'
import { isValidURL, MP_API } from '../utils/payment'
import { eq } from 'drizzle-orm'

const {
    MP_ACCESS_TOKEN: accessToken,
} = process.env

export default {
    MP_Create: async (req: Request, res: Response) => {
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

        const { success_url, failure_url, pending_url } = req.body

        const preferenceCreated = await preference.create({
            body: {
                items: [
                    {
                        id: String(bill_id),
                        title: `Consumo mesa #${bill.id}`,
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
                    success: isValidURL(success_url),
                    failure: isValidURL(failure_url),
                    pending: isValidURL(pending_url)
                },
                notification_url: 'https://gvz2qg4x-3000.use2.devtunnels.ms/api/payment/webhook',
                expires: true,
                expiration_date_from: new Date().toISOString(),
                expiration_date_to: new Date(Date.now() + 1800 * 1000).toISOString() //expires in 30 minutes
            },
            requestOptions: { idempotencyKey },
        })

        res.status(200).json(preferenceCreated)
    },
    MP_Webhook: async (req: Request, res: Response) => {
        const id = req.body.data?.id

        const payment = await MP_API.getPayment(id)

        if (payment?.statusCode == 200) {
            try {
                await db.update(Bill).set({ paymentStatus: payment.dataPayment.status, paymentID: id }).where(eq(Bill.id, payment.dataPayment.additional_info.items[0].id))
            } catch (error) {
                console.log(error)
            }
        }

        res.status(200).send('ok')
    }
}