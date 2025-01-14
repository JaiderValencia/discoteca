import { Router } from 'express'
import billRoutes from './billRoutes'
import tableRoutes from './clientTableRoutes'
const router = Router()

router.use('/bill', billRoutes)
router.use('/client_table', tableRoutes)

export default router