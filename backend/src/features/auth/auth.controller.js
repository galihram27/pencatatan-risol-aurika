import { authService } from './auth.service.js'

export const authController = {
  async login(req, res) {
    res.json(await authService.login(req.body))
  },

  // req.user diisi oleh middleware requireAuth.
  async me(req, res) {
    res.json(await authService.me(req.user.sub))
  },
}
