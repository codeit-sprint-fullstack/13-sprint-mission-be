const express = require("express");
const prisma = require("../lib/prisma");
const ENDPOINTS = require("../constants/endpoints");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/authMiddleware");
const { uploadProductImage } = require("../middlewares/uploadMiddleware");

const router = express.Router();

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

const parsePositiveInt = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return fallback;
  }

  return parsedValue;
};

const parseTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter(Boolean);
  }

  return [];
};

const parseImages = (images) => {
  if (Array.isArray(images)) {
    return images.map((image) => String(image).trim()).filter(Boolean);
  }

  if (typeof images === "string" && images.trim()) {
    return [images.trim()];
  }

  return [];
};

const getBaseUrl = (req) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  const host = req.get("host");

  return `${protocol}://${host}`;
};

const getUploadedImageUrl = (req) => {
  if (!req.file) {
    return null;
  }

  return `${getBaseUrl(req)}/uploads/${req.file.filename}`;
};

const getProductInclude = (userId) => ({
  owner: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
  likes: userId
    ? {
        where: { userId },
        select: { id: true },
      }
    : undefined,
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
});

const serializeProduct = (product) => ({
  id: product.id,
  name: product.name,
  title: product.name,
  price: product.price,
  description: product.description,
  tags: product.tags,
  images: product.images,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  ownerId: product.ownerId,
  ownerNickname: product.owner?.nickname || null,
  owner: product.owner,
  favoriteCount: product._count?.likes || 0,
  commentCount: product._count?.comments || 0,
  isFavorite: Boolean(product.likes?.length),
  isLiked: Boolean(product.likes?.length),
});

const serializeComment = (comment) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  productId: comment.productId,
  writerId: comment.writerId,
  writer: comment.writer,
});

const getCommentInclude = () => ({
  writer: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
});

const getProductData = (body, uploadedImageUrl) => {
  const name = body.name || body.title;
  const price = Number(body.price);
  const description = body.description?.trim();
  const tags = parseTags(body.tags);
  const images = uploadedImageUrl ? [uploadedImageUrl] : parseImages(body.images);

  return {
    name: typeof name === "string" ? name.trim() : "",
    price,
    description,
    tags,
    images,
  };
};

const validateProductData = ({ name, price, description }) => {
  if (!name) {
    return "상품명은 필수입니다.";
  }

  if (!Number.isInteger(price) || price < 0) {
    return "가격은 0 이상의 숫자로 입력해 주세요.";
  }

  if (!description) {
    return "상품 설명은 필수입니다.";
  }

  return "";
};

const getProductWhere = (keyword) => {
  if (!keyword) {
    return {};
  }

  return {
    OR: [
      { name: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ],
  };
};

const getProductsOrderBy = (orderBy) => {
  if (orderBy === "favorite") {
    return [{ likes: { _count: "desc" } }, { createdAt: "desc" }];
  }

  return [{ createdAt: "desc" }];
};

const getProducts = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, DEFAULT_PAGE);
    const pageSize = Math.min(
      parsePositiveInt(req.query.pageSize, DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE,
    );
    const keyword = req.query.keyword?.trim() || "";
    const orderBy = req.query.orderBy || "recent";
    const skip = (page - 1) * pageSize;
    const where = getProductWhere(keyword);

    const [totalCount, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: getProductInclude(req.user?.id),
        orderBy: getProductsOrderBy(orderBy),
        skip,
        take: pageSize,
      }),
    ]);

    return res.json({
      list: products.map(serializeProduct),
      totalCount,
    });
  } catch (err) {
    return next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: getProductInclude(req.user.id),
    });

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    return res.json(serializeProduct(product));
  } catch (err) {
    return next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const productData = getProductData(req.body, getUploadedImageUrl(req));
    const validationMessage = validateProductData(productData);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        tags: productData.tags,
        images: productData.images,
        ownerId: req.user.id,
      },
      include: getProductInclude(req.user.id),
    });

    return res.status(201).json(serializeProduct(product));
  } catch (err) {
    return next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, ownerId: true },
    });

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    if (product.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "상품을 수정할 권한이 없습니다." });
    }

    const productData = getProductData(req.body, getUploadedImageUrl(req));
    const validationMessage = validateProductData(productData);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        tags: productData.tags,
        images: productData.images,
      },
      include: getProductInclude(req.user.id),
    });

    return res.json(serializeProduct(updatedProduct));
  } catch (err) {
    return next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, ownerId: true },
    });

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    if (product.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "상품을 삭제할 권한이 없습니다." });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

const getProductComments = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    const comments = await prisma.productComment.findMany({
      where: { productId },
      include: getCommentInclude(),
      orderBy: { createdAt: "desc" },
    });

    return res.json({ list: comments.map(serializeComment) });
  } catch (err) {
    return next(err);
  }
};

const createProductComment = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);
    const content = req.body.content?.trim();

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
    }

    if (!content) {
      return res.status(400).json({ message: "댓글 내용을 입력해 주세요." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    const comment = await prisma.productComment.create({
      data: {
        content,
        productId,
        writerId: req.user.id,
      },
      include: getCommentInclude(),
    });

    return res.status(201).json(serializeComment(comment));
  } catch (err) {
    return next(err);
  }
};

const addProductFavorite = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    await prisma.productLike.upsert({
      where: {
        productId_userId: {
          productId,
          userId: req.user.id,
        },
      },
      create: {
        productId,
        userId: req.user.id,
      },
      update: {},
    });

    const likedProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: getProductInclude(req.user.id),
    });

    return res.json(serializeProduct(likedProduct));
  } catch (err) {
    return next(err);
  }
};

const deleteProductFavorite = async (req, res, next) => {
  try {
    const productId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ message: "유효하지 않은 상품 ID입니다." });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return res.status(404).json({ message: "존재하지 않는 상품입니다." });
    }

    await prisma.productLike.deleteMany({
      where: {
        productId,
        userId: req.user.id,
      },
    });

    const unlikedProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: getProductInclude(req.user.id),
    });

    return res.json(serializeProduct(unlikedProduct));
  } catch (err) {
    return next(err);
  }
};

router
  .route(ENDPOINTS.ITEMS)
  .get(optionalAuthenticate, getProducts)
  .post(authenticate, uploadProductImage, createProduct);

router
  .route(ENDPOINTS.PRODUCTS)
  .get(optionalAuthenticate, getProducts)
  .post(authenticate, uploadProductImage, createProduct);

router
  .route(ENDPOINTS.ITEM_BY_ID)
  .get(authenticate, getProduct)
  .patch(authenticate, uploadProductImage, updateProduct)
  .delete(authenticate, deleteProduct);

router
  .route(ENDPOINTS.PRODUCT_BY_ID)
  .get(authenticate, getProduct)
  .patch(authenticate, uploadProductImage, updateProduct)
  .delete(authenticate, deleteProduct);

router
  .route(ENDPOINTS.ITEM_COMMENTS)
  .get(getProductComments)
  .post(authenticate, createProductComment);

router
  .route(ENDPOINTS.PRODUCT_COMMENTS)
  .get(getProductComments)
  .post(authenticate, createProductComment);

router
  .route(ENDPOINTS.ITEM_FAVORITE)
  .post(authenticate, addProductFavorite)
  .delete(authenticate, deleteProductFavorite);

router
  .route(ENDPOINTS.PRODUCT_FAVORITE)
  .post(authenticate, addProductFavorite)
  .delete(authenticate, deleteProductFavorite);

module.exports = router;
