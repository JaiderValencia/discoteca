import billController from '../controllers/billController'
import { Router } from 'express'
const router = Router()

router.post('/', billController.create)
router.get('/', billController.readAll)
router.get('/:id', billController.read)
router.put('/:id', billController.update)
router.delete('/:id', billController.delete)

export default router