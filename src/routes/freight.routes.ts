import { Router, Request, Response } from 'express'
import { calculateFreight } from '../controllers/freight.controller'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.post('/', isAuthenticated, (req: Request, res: Response) => {
  calculateFreight(req, res)
})

export default router
