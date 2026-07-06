import prisma from "../config/prisma.js";

async function create(product) {
  const { tags = [], images = [], ...rest } = product;
  const createdProduct = await prisma.product.create({
    data: {
      ...rest,
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
      images: {
        create: images.map((url) => ({
          url,
        })),
      },
    },
    include: {
      tags: true,
      images: true,
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return createdProduct;
}

async function findById(productId, userId) {
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
    include: {
      tags: true,
      images: true,
      user: {
        omit: {
          password: true,
        },
      },
      productLikes: {
        where: {
          userId: Number(userId ?? -1),
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!product) return null;

  const { productLikes, ...rest } = product;
  return { ...rest, liked: !!productLikes.length };
}

async function findAll(page, pageSize, orderBy, keyword, userId) {
  const orderField = orderBy === "favorite" ? "favoriteCount" : "createdAt";
  const skip = (Number(page) - 1) * Number(pageSize);
  const where = {};

  //keyword가 있으면 해당 keyword 포함하는 데이터 리턴
  if (keyword) {
    where.OR = [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }

  //데이터 조회, page와 pageSize 둘 다 있을 때만 pagination 적용
  const queryOptions = {
    where,
    orderBy: { [orderField]: "desc" },
    include: {
      tags: true,
      images: true,
      user: {
        omit: {
          password: true,
        },
      },
      productLikes: {
        where: {
          userId: Number(userId ?? -1),
        },
        select: {
          id: true,
        },
      },
    },
  };
  if (page && pageSize) {
    queryOptions.skip = (Number(page) - 1) * Number(pageSize);

    queryOptions.take = Number(pageSize);
  }
  const products = await prisma.product.findMany(queryOptions);
  const mappedProducts = products.map(({ productLikes, ...rest }) => ({
    ...rest,
    liked: !!productLikes.length,
  }));
  return mappedProducts;
}

async function countByKeyword(keyword) {
  const where = {};
  if (keyword) {
    where.OR = [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }
  const count = await prisma.product.count({ where });
  return count;
}

async function update(productId, update) {
  const { tags = [], images = [], ...rest } = update;
  const updatedProduct = await prisma.product.update({
    where: { id: Number(productId) },
    data: {
      tags: {
        connectOrCreate: tags.map((tag) => ({
          where: { name: tag },
          create: { name: tag },
        })),
      },
      images: {
        deleteMany: {},
        create: images.map((url) => ({ url })),
      },
      ...rest,
    },
    include: {
      tags: true,
      images: true,
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return updatedProduct;
}

async function deleteById(productId) {
  const deletedProduct = await prisma.product.delete({
    where: { id: Number(productId) },
    include: {
      tags: true,
      images: true,
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return deletedProduct;
}

async function findProductCommentsByProductId(productId) {
  const comments = await prisma.productComment.findMany({
    where: { productId: Number(productId) },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });
  return comments;
}

async function findLike(productId, userId) {
  const like = await prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId: Number(userId),
        productId: Number(productId),
      },
    },
  });

  return like;
}

async function like(productId, userId) {
  const likeUpdatedProduct = await prisma.$transaction(async (tx) => {
    await tx.productLike.create({
      data: {
        productId: Number(productId),
        userId: Number(userId),
      },
    });

    const updatedProduct = await tx.product.update({
      where: { id: Number(productId) },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    return updatedProduct;
  });
  return likeUpdatedProduct;
}

async function unlike(productId, userId) {
  const likeUpdatedProduct = await prisma.$transaction(async (tx) => {
    await tx.productLike.delete({
      where: {
        userId_productId: {
          productId: Number(productId),
          userId: Number(userId),
        },
      },
    });

    const updatedProduct = await tx.product.update({
      where: { id: Number(productId) },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    return updatedProduct;
  });
  return likeUpdatedProduct;
}

export default {
  create,
  findById,
  findAll,
  countByKeyword,
  update,
  deleteById,
  findProductCommentsByProductId,
  findLike,
  like,
  unlike,
};
