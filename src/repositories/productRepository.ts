import type { Prisma, Product, User, ProductLike } from "@prisma/client";
import type {
  ProductRequestType,
  ProductFindAllRequestType,
  ProductReturnType,
} from "../types/product.js";
import prisma from "../config/prisma.js";
import { Optional } from "@prisma/client/runtime/library";
import { ProductCommentReturnType } from "../types/productComment.js";
import { UserReturnType } from "../types/user.js";

async function create(product: ProductRequestType): Promise<ProductReturnType> {
  const { price, tags = [], images = [], ...rest } = product;
  const createdProduct = await prisma.product.create({
    data: {
      ...rest,
      price: Number(price),
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

async function findById(
  productId: Product["id"],
  userId?: User["id"],
): Promise<ProductReturnType & { liked: boolean; user: UserReturnType }> {
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

  if (!product) {
    throw new Error("Article not found");
  }

  const { productLikes, ...rest } = product;
  return { ...rest, liked: !!productLikes.length };
}

async function findAll({
  page,
  pageSize,
  orderBy,
  keyword,
  userId,
}: ProductFindAllRequestType): Promise<
  (ProductReturnType & { liked: boolean })[]
> {
  const orderField = orderBy === "favorite" ? "favoriteCount" : "createdAt";
  const skip = (Number(page) - 1) * Number(pageSize);
  const where: Prisma.ProductWhereInput = {};

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
    ...(page && pageSize
      ? {
          skip,
          take: pageSize,
        }
      : {}),
  };

  const products = await prisma.product.findMany(queryOptions);
  const mappedProducts = products.map(({ productLikes, ...rest }) => ({
    ...rest,
    liked: !!productLikes.length,
  }));
  return mappedProducts;
}

async function countByKeyword(keyword: string | undefined): Promise<number> {
  const where: Prisma.ProductWhereInput = {};
  if (keyword) {
    where.OR = [
      { name: { contains: keyword } },
      { description: { contains: keyword } },
    ];
  }
  const count = await prisma.product.count({ where });
  return count;
}

async function update(
  productId: Product["id"],
  update: Optional<ProductRequestType>,
): Promise<ProductReturnType> {
  const { tags = [], images = [], ...rest } = update;
  const updatedProduct = await prisma.product.update({
    where: { id: Number(productId) },
    data: {
      tags: {
        set: [],
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

async function deleteById(
  productId: Product["id"],
): Promise<ProductReturnType> {
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

async function findProductCommentsByProductId(
  productId: Product["id"],
): Promise<ProductCommentReturnType[]> {
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

async function findLike(
  productId: Product["id"],
  userId: User["id"],
): Promise<ProductLike | null> {
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

async function like(
  productId: Product["id"],
  userId: User["id"],
): Promise<ProductReturnType> {
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

async function unlike(
  productId: Product["id"],
  userId: User["id"],
): Promise<ProductReturnType> {
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
