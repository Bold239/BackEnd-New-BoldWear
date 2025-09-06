import { Router, Request, Response, NextFunction } from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.get(
  '/me',
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user

      if (!user) {
        res.status(401).json({ message: 'Usuário não autenticado.' })
        return
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router
