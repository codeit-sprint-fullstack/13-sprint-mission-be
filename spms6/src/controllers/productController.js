//comments 테이블이 articleId,productId 둘 다 갖거나 없을 경우 생각
//다만 지금은 라우트구조상 분리되어있기때문에 zod에 추가는 안할거임

import { asyncHandler } from "../middlewares/asyncHandler.js";
import { NotFoundError } from "../middlewares/CustomError.js";
import { prisma } from "../prisma.js";
import {
  commentBodySchema,
  getAndCreateCommentParamsSchema,
  getCommentsQuerySchema,
  updateAndDeleteCommentParamsSchema,
} from "../validations/commentValidation.js";
import {
  createProductBodySchema,
  getProductsQuerySchema,
  productParamsSchema,
  updateProductBodySchema,
} from "../validations/productValidation.js";

export const getCommentsInProduct = asyncHandler(async (req, res) => {
  const { id } = getAndCreateCommentParamsSchema.parse(req.params);
  const { cursor, limit = 10, sort } = getCommentsQuerySchema.parse(req.query);
  let orderBy;
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }
  const comments = await prisma.comment.findMany({
    where: {
      productId: id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy,
  });
  const hasNext = comments.length > limit;
  const data = comments.slice(0, limit);
  const nextCursor = hasNext ? data[data.length - 1].id : null;
  res.status(200).json({ comments: data, nextCursor });
});

export const createCommentInProduct = asyncHandler(async (req, res) => {
  const { id } = getAndCreateCommentParamsSchema.parse(req.params);
  const { content } = commentBodySchema.parse(req.body);
  const data = await prisma.comment.create({
    data: {
      content,
      productId: id,
    },
  });
  res.status(201).json({ comment: data, message: "댓글 등록 성공" });
});

export const updateCommentInProduct = asyncHandler(async (req, res) => {
  const { id, commentId } = updateAndDeleteCommentParamsSchema.parse(
    req.params,
  );
  const { content } = commentBodySchema.parse(req.body);
  const data = await prisma.comment.update({
    where: { productId: id, id: commentId },
    data: { content },
  });
  res.status(200).json({ comment: data, message: "댓글 수정 성공" });
});

export const deleteCommentInProduct = asyncHandler(async (req, res) => {
  const { id, commentId } = updateAndDeleteCommentParamsSchema.parse(
    req.params,
  );
  await prisma.comment.delete({
    where: { productId: id, id: commentId },
  });
  res.status(204).send();
});

export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    page = 1,
    limit = 10,
    sort,
  } = getProductsQuerySchema.parse(req.query);

  let orderBy;
  switch (sort) {
    case "recent":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }
  const where = keyword
    ? {
        OR: [
          { name: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      omit: {
        description: true,
        updatedAt: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  res.status(200).json({ products, count: totalCount });
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = productParamsSchema.parse(req.params);
  const product = await prisma.product.findUnique({
    where: { id },
    omit: {
      updatedAt: true,
    },
    include: {
      tags: true,
    },
  });
  if (!product) {
    throw new NotFoundError();
  }
  res.status(200).json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, tags } = createProductBodySchema.parse(
    req.body,
  );
  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tags: tags
        ? {
            create: tags.map((tag) => ({ name: tag })),
          }
        : undefined, //하이보루
    },
  });
  res.status(201).json({ product: newProduct, message: "제품 등록 성공" });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = productParamsSchema.parse(req.params);
  const { name, description, price, tags } = updateProductBodySchema.parse(
    req.body,
  );
  const data = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      tags: tags
        ? {
            deleteMany: {},
            create: tags.map((tag) => ({ name: tag })),
          }
        : undefined,
    },
    include: { tags: true },
  });
  res.status(200).json({ product: data, message: "제품 정보 수정 성공" });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = productParamsSchema.parse(req.params);
  await prisma.product.delete({
    where: { id },
  });
  res.status(204).send();
});
