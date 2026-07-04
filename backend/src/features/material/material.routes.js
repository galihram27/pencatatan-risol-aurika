import { Router } from 'express'
import { materialController } from './material.controller.js'

const router = Router()

router.get('/', materialController.list)
router.get('/:id', materialController.get)
router.post('/', materialController.create)
router.put('/:id', materialController.update)
router.delete('/:id', materialController.remove)

export default router
