import { Router } from 'express'
import paymentController from '../controllers/paymentController'

const router = Router()

router.post('/create/:id', paymentController.create)

router.get('/success', paymentController.success)
router.get('/pending', paymentController.pending)
router.get('/failure', paymentController.failure)

export default router