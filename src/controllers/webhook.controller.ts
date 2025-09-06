import { Request, Response } from 'express'
import mercadopago from 'mercadopago'
import { Order } from '../models/order.model.js'

export const mercadoPagoWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📩 Webhook recebido:', req.body)

    const paymentId = req.query['data.id'] || req.body?.data?.id

    if (!paymentId) {
      res.status(400).json({ message: 'ID de pagamento ausente.' })
      return
    }

    const payment = await mercadopago.payment.findById(Number(paymentId))

    const status = payment.body.status
    const metadata = payment.body.metadata
    const orderId = metadata?.order_id

    if (!orderId) {
      res.status(400).json({ message: 'Pedido não encontrado nos metadados.' })
      return
    }

    await Order.update({ status }, { where: { id: orderId } })

    res.status(200).send('Webhook recebido com sucesso.')
  } catch (error) {
    console.error('Erro no webhook do Mercado Pago:', error)
    res.status(500).json({ message: 'Erro interno no webhook.' })
  }
}

export const testWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderId = req.query.orderId as string
      const status = req.query.status as string || 'approved'
  
      if (!orderId) {
        res.status(400).json({ message: 'Parâmetro orderId obrigatório.' })
        return
      }
  
      const order = await Order.findByPk(orderId)
  
      if (!order) {
        res.status(404).json({ message: 'Pedido não encontrado.' })
        return
      }
  
      await Order.update({ status }, { where: { id: orderId } })
  
      console.log(`📦 Webhook simulado com sucesso para o pedido #${orderId} -> status: ${status}`)
  
      res.status(200).json({ message: 'Webhook de teste executado com sucesso.' })
    } catch (error) {
      console.error('Erro no webhook de teste:', error)
      res.status(500).json({ message: 'Erro interno ao simular webhook.' })
    }
  }
