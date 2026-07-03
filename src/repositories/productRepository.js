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

async function findById(productId) {
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
    },
  });
  return product;
}

async function findAll(page, pageSize, orderBy, keyword) {
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
  };
  if (page && pageSize) {
    queryOptions.skip = (Number(page) - 1) * Number(pageSize);

    queryOptions.take = Number(pageSize);
  }
  const products = await prisma.product.findMany(queryOptions);
  return products;
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
        set: tags.map((name) => ({ name })),
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

export default {
  create,
  findById,
  findAll,
  countByKeyword,
  update,
  deleteById,
};
