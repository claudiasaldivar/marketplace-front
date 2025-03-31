import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { quantity } = req.body;

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id }
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const item = await prisma.cartItem.findFirst({
        where: {
          id: parseInt(id),
          cartId: cart.id
        }
      });

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: parseInt(quantity) }
      });

      return res.status(200).json(updatedItem);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id }
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const item = await prisma.cartItem.findFirst({
        where: {
          id: parseInt(id),
          cartId: cart.id
        }
      });

      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }

      await prisma.cartItem.delete({
        where: { id: item.id }
      });

      return res.status(200).json({ message: 'Item removed' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}