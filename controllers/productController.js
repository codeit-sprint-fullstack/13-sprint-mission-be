import prisma from '../lib/prisma.js';
import { getAuthenticatedUserId } from '../utils/auth.js';

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function serializeProductListItem(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    createdAt: product.createdAt,
  };
}

export async function getProducts(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit || req.query.pageSize) || 10, 1), 50);
    const offset =
      req.query.offset !== undefined
        ? Math.max(Number(req.query.offset), 0)
        : (page - 1) * limit;
    const keyword = String(req.query.keyword || req.query.search || '').trim();

    const where = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: { id: true, name: true, price: true, createdAt: true },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      list: items.map(serializeProductListItem),
      totalCount: total,
      offset,
      limit,
      hasNext: offset + items.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createProduct(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        userId,
      },
    });

    res.status(201).json(serializeProduct(product));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, name: true, description: true, price: true, tags: true, createdAt: true, updatedAt: true },
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(serializeProduct(product));
  } catch {
    res.status(400).json({ message: '잘못된 상품 id입니다.' });
  }
}

export async function updateProduct(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      select: { userId: true },
    });

    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    if (product.userId !== userId) return res.status(403).json({ message: '권한이 없습니다.' });

    const data = {};
    ['name', 'description', 'tags'].forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });
    if (req.body.price !== undefined) data.price = Number(req.body.price);

    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data,
    });

    res.json(serializeProduct(updated));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.status(400).json({ message: error.message });
  }
}

export async function deleteProduct(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      select: { userId: true },
    });

    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    if (product.userId !== userId) return res.status(403).json({ message: '권한이 없습니다.' });

    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }
    res.status(500).json({ message: error.message });
  }
}
