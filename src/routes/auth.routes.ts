import { Router } from 'express'
import { login, register } from '../controllers/auth.controller.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { isAdmin } from '../middlewares/isAdmin.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
export default router
