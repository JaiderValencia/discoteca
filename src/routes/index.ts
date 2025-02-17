import { Router } from 'express'
import billRoutes from './billRoutes'
import tableRoutes from './clientTableRoutes'
import productRoutes from './productRoutes'
import ProductCategoryRoutes from './productCategoryRoutes'
import paymentRoutes from './paymentRoutes'
const router = Router()

router.use('/bill', billRoutes)
router.use('/client_table', tableRoutes)
router.use('/product', productRoutes)
router.use('/product_category', ProductCategoryRoutes)
router.use('/payment', paymentRoutes)

export default router