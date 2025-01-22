import billController from '../controllers/billController'
import { Router } from 'express'
import { calculateTotal, checkProductsObjectDB, hasErrors, hasFields, isExist, updateProductsBill } from '../middlewares/bill'
const router = Router()

router.post('/', hasFields, hasErrors, calculateTotal, billController.create)
router.get('/', billController.readAll)
router.get('/:id', billController.read)
router.put('/:id', isExist, hasFields, hasErrors, checkProductsObjectDB, calculateTotal, updateProductsBill, billController.update)
router.delete('/:id', isExist, billController.delete)

export default router