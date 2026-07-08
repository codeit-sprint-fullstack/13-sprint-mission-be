import prisma from '../lib/prisma.js';
import { getAuthenticatedUserId, setOptionalAuthenticatedUser } from '../utils/auth.js';

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    likeCount: product.likeCount,
    isLiked: product.isLiked,
    comments: product.comments,
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
    imageUrl: product.imageUrl,
    likeCount: product.likeCount,
    createdAt: product.createdAt,
  };
}

function validateProductPayload(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.name !== undefined) {
    if (typeof body.name !== 'string') {
      throwValidationError('상품명을 입력해 주세요.');
    }

    const name = body.name.trim();
    if (!name || name.length > 100) {
      throwValidationError('상품명은 1자 이상 100자 이하로 입력해 주세요.');
    }
    data.name = name;
  }

  if (!partial || body.description !== undefined) {
    if (typeof body.description !== 'string' || !body.description.trim()) {
      throwValidationError('상품 설명을 입력해 주세요.');
    }
    data.description = body.description.trim();
  }

  if (!partial || body.price !== undefined) {
    if (body.price === '' || body.price === null || body.price === undefined) {
      throwValidationError('상품 가격을 입력해 주세요.');
    }

    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      throwValidationError('상품 가격은 0 이상의 숫자로 입력해 주세요.');
    }
    data.price = price;
  }

  if (body.imageUrl !== undefined) {
    if (body.imageUrl !== null && typeof body.imageUrl !== 'string') {
      throwValidationError('상품 이미지 경로를 확인해 주세요.');
    }
    data.imageUrl = body.imageUrl?.trim() || null;
  }

  if (body.tags !== undefined) {
    data.tags = Array.isArray(body.tags) ? body.tags : [];
  } else if (!partial) {
    data.tags = [];
  }

  return data;
}

function throwValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  throw error;
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
    const orderBy = req.query.orderBy === 'favorite' || req.query.orderBy === 'like'
      ? { likeCount: 'desc' }
      : { createdAt: 'desc' };

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
        orderBy,
        skip: offset,
        take: limit,
        select: { id: true, name: true, price: true, imageUrl: true, likeCount: true, createdAt: true },
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
    const data = validateProductPayload(req.body);
    const product = await prisma.product.create({
      data: {
        ...data,
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
    setOptionalAuthenticatedUser(req);
    const userId = req.user?.id;
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        likeCount: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        likes: userId ? { where: { userId }, select: { id: true } } : false,
        comments: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, content: true, createdAt: true, updatedAt: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    }

    res.json(serializeProduct({
      ...product,
      isLiked: Boolean(product.likes?.length),
      likes: undefined,
    }));
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

    const data = validateProductPayload(req.body, { partial: true });

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

export async function getBestProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { likeCount: 'desc' },
      take: 4,
      select: { id: true, name: true, price: true, imageUrl: true, likeCount: true, createdAt: true },
    });

    res.json({ list: products.map(serializeProductListItem), totalCount: products.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function likeProduct(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const productId = Number(req.params.productId);
    const product = await prisma.$transaction(async (tx) => {
      const exists = await tx.product.findUnique({ where: { id: productId }, select: { id: true } });
      if (!exists) {
        const error = new Error('상품을 찾을 수 없습니다.');
        error.statusCode = 404;
        throw error;
      }

      const like = await tx.productLike.findUnique({
        where: { userId_productId: { userId, productId } },
      });
      if (like) {
        return tx.product.findUnique({ where: { id: productId } });
      }

      await tx.productLike.create({ data: { userId, productId } });
      return tx.product.update({
        where: { id: productId },
        data: { likeCount: { increment: 1 } },
      });
    });

    res.json({ ...serializeProduct(product), isLiked: true });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
}

export async function unlikeProduct(req, res) {
  const userId = getAuthenticatedUserId(req, res);
  if (!userId) return;

  try {
    const productId = Number(req.params.productId);
    const product = await prisma.$transaction(async (tx) => {
      const like = await tx.productLike.findUnique({
        where: { userId_productId: { userId, productId } },
      });
      if (!like) {
        return tx.product.findUnique({ where: { id: productId } });
      }

      await tx.productLike.delete({ where: { id: like.id } });
      return tx.product.update({
        where: { id: productId },
        data: { likeCount: { decrement: 1 } },
      });
    });

    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
    res.json({ ...serializeProduct(product), isLiked: false });
  } catch (error) {
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
