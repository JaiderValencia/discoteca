import { Router } from 'express'
import tableController from '../controllers/clientTableController'
import { hasErrors, hasFields, isActive, notRepeatRecord } from '../middlewares/clientTable'

const router = Router()

router.post('/', notRepeatRecord, tableController.create)
router.get('/', tableController.readAll)
router.get('/:id', isActive, tableController.read)
router.put('/:id', hasFields, hasErrors, tableController.update)
router.delete('/:id', isActive, tableController.unactivate)

export default router