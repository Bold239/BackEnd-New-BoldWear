import { Router, Request, Response } from 'express'
import { calculateFreight } from '../controllers/freight.controller'


const router = Router()

router.post('/',  (req: Request, res: Response) => {
  calculateFreight(req, res)
})

export default router
