import { Router } from 'express'
import tableController from '../controllers/clientTableController'
import { hasFields, isActive, notRepeatRecord } from '../middlewares/clientTable'
import { hasErrors } from '../middlewares/global'

const router = Router()

router.post('/', notRepeatRecord, tableController.create)
router.get('/', tableController.readAll)
router.get('/:id', isActive, tableController.read)
router.put('/:id', hasFields, hasErrors, tableController.update)
router.delete('/:id', isActive, tableController.unactivate)

export default router