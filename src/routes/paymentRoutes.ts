import cors from 'cors'
import { Router } from 'express'
import paymentController from '../controllers/paymentController'
import { checkPayment, validateHeaderWebhook } from '../middlewares/payment'

const router = Router()
const corsOptions = { origin: 'api.mercadopago.com', methods: ['POST'] }

router.post('/create/:id', checkPayment, paymentController.MP_Create)
router.post('/webhook', cors(corsOptions), validateHeaderWebhook, paymentController.MP_Webhook)

export default router