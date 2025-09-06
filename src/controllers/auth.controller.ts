import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Usuário já existe.' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso.', user });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


  export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body
  
      if (!email || !password) {
        res.status(400).json({ message: 'Email e senha são obrigatórios.' })
        return
      }
  
      const user = await User.findOne({ where: { email } })
      if (!user) {
        res.status(401).json({ message: 'Credenciais inválidas.' })
        return
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Credenciais inválidas.' })
        return
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        'secreto123', // você pode mover isso pra uma variável de ambiente depois
        { expiresIn: '1h' }
      )
  
      res.status(200).json({
        message: 'Login realizado com sucesso.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      })
    } catch (err) {
      console.error('Erro no login:', err)
      res.status(500).json({ message: 'Erro interno no servidor.' })
    }
  }
  