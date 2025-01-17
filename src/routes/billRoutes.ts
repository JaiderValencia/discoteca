import billController from '../controllers/billController'
import { Router } from 'express'
import { hasErrors, hasFields, isExist } from '../middlewares/bill'
const router = Router()

router.post('/', hasFields, hasErrors, billController.create)
router.get('/', billController.readAll)
router.get('/:id', billController.read)
router.put('/:id', isExist, hasFields, hasErrors, billController.update)
router.delete('/:id', isExist, billController.delete)

export default router