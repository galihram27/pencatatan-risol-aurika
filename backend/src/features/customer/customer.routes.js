import { Router } from 'express'
import { customerController } from './customer.controller.js'

const router = Router()

router.get('/', customerController.list)
router.get('/:id', customerController.get)
router.post('/', customerController.create)
router.put('/:id', customerController.update)
router.delete('/:id', customerController.remove)

export default router
