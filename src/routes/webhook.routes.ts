import { Router } from 'express'
import { mercadoPagoWebhook, testWebhook } from '../controllers/webhook.controller.js'

const router = Router()

router.post('/', mercadoPagoWebhook)
router.get('/test', testWebhook)

export default router
