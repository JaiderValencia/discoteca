import { Router } from 'express'
import billRoutes from './billRoutes'
import tableRoutes from './clientTableRoutes'
import productRoutes from './productRoutes'
import paymentRoutes from './paymentRoutes'
const router = Router()

router.use('/bill', billRoutes)
router.use('/client_table', tableRoutes)
router.use('/product', productRoutes)
router.use('/payment', paymentRoutes)

export default router