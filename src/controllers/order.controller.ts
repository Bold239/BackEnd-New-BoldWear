import { Request, Response } from 'express'
import { Order } from '../models/order.model.js'
import { OrderItem } from '../models/order-item.model.js'
import { Product } from '../models/product.model.js'

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as { id: number }).id

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    res.status(200).json(orders)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    res.status(500).json({ message: 'Erro ao buscar pedidos.' })
  }
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.user as { id: number }).id
      const orderId = Number(req.params.id)
  
      if (isNaN(orderId)) {
        res.status(400).json({ message: 'ID inválido.' })
        return
      }
  
      const order = await Order.findOne({
        where: { id: orderId, userId },
        include: [
          {
            model: OrderItem,
            include: [Product],
          },
        ],
      })
  
      if (!order) {
        res.status(404).json({ message: 'Pedido não encontrado.' })
        return
      }
  
      res.status(200).json(order)
    } catch (error) {
      console.error('Erro ao buscar pedido por ID:', error)
      res.status(500).json({ message: 'Erro ao buscar pedido.' })
    }
}
