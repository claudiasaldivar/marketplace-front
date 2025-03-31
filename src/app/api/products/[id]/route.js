import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });

      if (!product || product.userId !== session.user.id) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    const { name, sku, quantity, price } = req.body;

    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existingProduct || existingProduct.userId !== session.user.id) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name: name || existingProduct.name,
          sku: sku || existingProduct.sku,
          quantity: quantity ? parseInt(quantity) : existingProduct.quantity,
          price: price ? parseFloat(price) : existingProduct.price
        }
      });

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'SKU already exists' });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
      });

      if (!product || product.userId !== session.user.id) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await prisma.product.delete({
        where: { id: parseInt(id) }
      });

      return res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}