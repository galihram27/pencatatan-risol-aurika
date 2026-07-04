import { Router } from 'express'
import { orderController } from './order.controller.js'

const router = Router()

router.get('/', orderController.list) // ?status=active|completed
router.get('/:id', orderController.get)
router.post('/', orderController.create)

// Aksi khusus alur pesanan
router.patch('/:id/verify-payment', orderController.verifyPayment)
router.patch('/:id/complete', orderController.complete)

router.delete('/:id', orderController.cancel)

export default router
