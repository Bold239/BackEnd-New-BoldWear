// src/controllers/checkout.ts
import { Request, Response } from 'express';
import mercadopago from 'mercadopago';
import { Order } from '../models/order.model.js';
import { OrderItem } from '../models/order-item.model.js';
import { CartItem } from '../models/cart-item.model.js';
import { Product } from '../models/product.model.js';
import { Modeling } from '../models/modeling.model.js';
import { ModelPhoto } from '../models/model-photo.model.js';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN!,
});

async function getModelingName(id: number): Promise<string | undefined> {
  const modeling = await Modeling.findByPk(id);
  return modeling?.name;
}

export const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as { id: number }).id;
    const {
      paymentMethod,
      shippingAddress,
      freight,
      recipientName,
      recipientCPF,
      recipientCEP,
      extraInfo,
    } = req.body;

    // ✅ Validação dos campos obrigatórios
    if (!paymentMethod || typeof paymentMethod !== 'string') {
      res.status(400).json({ message: 'Método de pagamento inválido ou ausente.' });
      return;
    }

    if (!shippingAddress || typeof shippingAddress !== 'string') {
      res.status(400).json({ message: 'Endereço de entrega inválido ou ausente.' });
      return;
    }

    if (typeof freight !== 'number') {
      res.status(400).json({ message: 'Frete inválido ou ausente.' });
      return;
    }

    if (!recipientName || !recipientCPF || !recipientCEP) {
      res.status(400).json({ message: 'Dados do destinatário incompletos.' });
      return;
    }

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [Product],
    });

    if (!cartItems.length) {
      res.status(400).json({ message: 'Carrinho vazio.' });
      return;
    }

    const hasInvalidProduct = cartItems.some(item => !item.product || !item.product.price);
    if (hasInvalidProduct) {
      res.status(400).json({ message: 'Produto(s) inválido(s) no carrinho.' });
      return;
    }

    const totalProducts = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product!.price,
      0
    );

    const total = totalProducts + freight;

    const order = await Order.create({
      userId,
      paymentMethod,
      shippingAddress,
      status: 'pending',
      total,
      freight,
      recipientName,
      recipientCPF,
      recipientCEP,
      extraInfo,
    });

    for (const item of cartItems) {
      let modelName: string | undefined;

      if (item.modelingId) {
        const modelPhoto = await ModelPhoto.findOne({
          where: {
            productId: item.productId,
            modelingId: item.modelingId,
          },
          include: [Modeling],
        });

        modelName = modelPhoto?.modeling?.name;
      }

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product!.price,
        size: item.size,
        model: modelName,
        color: item.color,
        obs: item.obs,
        imagePath: item.product!.imagePath,
      });
    }

    const preference = await mercadopago.preferences.create({
      items: [
        ...cartItems.map(item => ({
          title: item.product!.name,
          quantity: item.quantity,
          unit_price: item.product!.price,
          currency_id: 'BRL',
          picture_url: `${process.env.BACKEND_URL}${item.product!.imagePath}`,
        })),
        {
          title: 'Frete',
          quantity: 1,
          unit_price: freight,
          currency_id: 'BRL',
        }
      ],
      back_urls: {
        success: "https://www.google.com",
        failure: "https://www.example.com/failure",
        pending: "https://www.example.com/pending",
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL}/webhook`,
      metadata: {
        order_id: order.id,
        user_id: userId,
      },
      payment_methods: {
        excluded_payment_types: [{ id: 'ticket' }],
      },
      shipping: {
        cost: freight,
        mode: 'not_specified',
      },
    });

    await CartItem.destroy({ where: { userId } });

    res.status(201).json({
      message: 'Pedido criado com sucesso!',
      orderId: order.id,
      paymentUrl: preference.body.init_point,
    });
  } catch (error) {
    console.error('Erro no checkout:', error);
    res.status(500).json({ message: 'Erro ao finalizar pedido.' });
  }
};
