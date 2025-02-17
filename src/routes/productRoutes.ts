import { Router } from 'express'
import productController from '../controllers/productController'
import { hasFields, isExist, validateNameToCreate, validateNameToUpdate } from '../middlewares/product'
import { hasErrors, hasParamId } from '../middlewares/global'
const router = Router()

router.post('/', hasFields, validateNameToCreate, hasErrors, productController.create)
router.get('/', productController.readAll)
router.get('/:id', hasParamId, hasErrors, productController.readOne)
router.put('/:id', hasParamId, hasFields, validateNameToUpdate, hasErrors, isExist, productController.update)
router.delete('/:id', hasParamId, hasErrors, isExist, productController.delete)

export default router