import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido.' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, 'secreto123') as {
      id: number
      email: string
      role: string
    }

    if (decoded.role !== 'admin') {
      res.status(403).json({ message: 'Acesso restrito a administradores.' })
      return
    }

    // você pode guardar decoded se quiser usar no admin futuramente
    next()
  } catch (err) {
    console.error('Erro no token do painel admin:', err)
    res.status(401).json({ message: 'Token inválido.' })
  }
}
