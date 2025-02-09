import { Router } from 'express'
import tableController from '../controllers/clientTableController'
import { hasFields, isActive, notRepeatRecord } from '../middlewares/clientTable'
import { hasErrors, hasParamId } from '../middlewares/global'

const router = Router()

router.post('/', notRepeatRecord, tableController.create)
router.get('/', tableController.readAll)
router.get('/:id', hasParamId, hasErrors, isActive, tableController.read)
router.put('/:id', hasParamId, hasFields, hasErrors, tableController.update)
router.delete('/:id', hasParamId, hasErrors, isActive, tableController.unactivate)

export default router