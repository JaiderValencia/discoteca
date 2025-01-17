import { Router } from 'express'
import productController from '../controllers/productController'
import { hasErrors, hasFields, isExist } from '../middlewares/product'
const router = Router()

router.post('/', hasFields, hasErrors, productController.create)
router.get('/', productController.readAll)
router.get('/name', productController.readByName)
router.get('/:id', productController.readById)
router.put('/:id', isExist, hasFields, hasErrors, productController.update)
router.delete('/:id', isExist, productController.delete)

export default router