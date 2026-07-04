import { Router } from 'express'
import { authController } from './auth.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.js'

const router = Router()

router.post('/login', authController.login)
router.get('/me', requireAuth, authController.me)

export default router
