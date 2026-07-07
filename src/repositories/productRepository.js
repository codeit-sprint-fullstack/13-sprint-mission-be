import prisma from "../config/prisma.js";

async function getAll(userId, { skip, take, orderBy, keyword } = {}) {
  const where = keyword
    ? { name: { contains: keyword, mode: "insensitive" } }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        likes: { where: { userId: userId ?? -1 } },
        user: { select: { id: true, nickName: true, image: true } },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalCount };
}

async function getById(id, userId) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      comments: true,
      likes: { where: { userId: userId ?? -1 } },
      user: { select: { id: true, nickName: true, image: true } },
    },
  });
  return product;
}

async function save(product) {
  const createProduct = await prisma.product.create({
    data: {
      name: product.name,
      description: product.description,
      favoriteCount: product.favoriteCount,
      price: product.price,
      tags: product.tags,
      images: product.images,
      ownerId: product.ownerId,
      userId: product.ownerId,
    },
  });
  return createProduct;
}

async function update(product) {
  const updateProduct = await prisma.product.update({
    where: {
      id: Number(product.id),
    },
    data: {
      name: product.name,
      description: product.description,
      favoriteCount: product.favoriteCount,
      price: product.price,
      tags: product.tags,
      images: product.images,
    },
  });
  return updateProduct;
}

async function deleteById(id) {
  const deleteProduct = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
  return deleteProduct;
}

export default {
  getAll,
  getById,
  save,
  update,
  deleteById,
};
