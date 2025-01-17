import { Router } from 'express'
import billRoutes from './billRoutes'
import tableRoutes from './clientTableRoutes'
import productRoutes from './productRoutes'
const router = Router()

router.use('/bill', billRoutes)
router.use('/client_table', tableRoutes)
router.use('/product', productRoutes)

export default router