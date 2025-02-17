import { Router } from 'express'
import productCategory from '../controllers/productCategory'
import { hasErrors, hasParamId } from '../middlewares/global'
import { isExist, hasFields } from '../middlewares/productCategory'
const router = Router()

router.post('/', hasFields, hasErrors, productCategory.create)
router.get('/', productCategory.readAll)
router.get('/:id', hasParamId, hasErrors, productCategory.readOne)
router.put('/:id', hasParamId, hasFields, hasErrors, isExist, productCategory.update)
router.delete('/:id', hasParamId, hasErrors, isExist, productCategory.delete)

export default router