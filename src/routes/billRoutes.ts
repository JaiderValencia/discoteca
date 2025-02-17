import billController from '../controllers/billController'
import { Router } from 'express'
import { calculateTotal, checkProductsObjectDB, hasFields, isExist, updateProductsBill } from '../middlewares/bill'
import { hasErrors, hasParamId } from '../middlewares/global'
const router = Router()

router.post('/', hasFields, hasErrors, calculateTotal, billController.create)
router.get('/', billController.readAll)
router.get('/:id', hasParamId, hasErrors, billController.read)
router.put('/:id', hasParamId, hasFields, hasErrors, isExist, checkProductsObjectDB, calculateTotal, updateProductsBill, billController.update)
router.delete('/:id', hasParamId, hasErrors, isExist, billController.delete)

export default router