const prisma = require("../utils/prisma");
const asyncHandler = require("../middlewares/asyncHandler");

const createProductComment = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }

  const comment = await prisma.productComment.create({
    data: {
      content: req.body.content,
      productId,
    },
  });

  res.status(201).json(comment);
});

const listProductComments = asyncHandler(async (req, res) => {
  const productId = Number(req.params.productId);
  const limit = req.query.limit || 10;

  // 변경: cursor 페이지네이션은 아직 어려워서 빼고,
  // 일단 최신순으로 limit 개수만 가져오도록 했습니다.
  const comments = await prisma.productComment.findMany({
    where: { productId },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  res.status(200).json({
    data: comments,
  });
});

const createArticleComment = asyncHandler(async (req, res) => {
  const articleId = Number(req.params.articleId);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  const comment = await prisma.articleComment.create({
    data: {
      content: req.body.content,
      articleId,
    },
  });

  res.status(201).json(comment);
});

const listArticleComments = asyncHandler(async (req, res) => {
  const articleId = Number(req.params.articleId);
  const limit = req.query.limit || 10;

  // 변경: 자유게시판 댓글도 일단 최신순 + limit 방식으로만 구현했습니다.
  const comments = await prisma.articleComment.findMany({
    where: { articleId },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  res.status(200).json({
    data: comments,
  });
});

const updateProductComment = asyncHandler(async (req, res) => {
  const comment = await prisma.productComment.update({
    where: { id: req.params.id },
    data: { content: req.body.content },
  });

  res.status(200).json(comment);
});

const deleteProductComment = asyncHandler(async (req, res) => {
  await prisma.productComment.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});

const updateArticleComment = asyncHandler(async (req, res) => {
  const comment = await prisma.articleComment.update({
    where: { id: req.params.id },
    data: { content: req.body.content },
  });

  res.status(200).json(comment);
});

const deleteArticleComment = asyncHandler(async (req, res) => {
  await prisma.articleComment.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
});

module.exports = {
  createProductComment,
  listProductComments,
  createArticleComment,
  listArticleComments,
  updateProductComment,
  deleteProductComment,
  updateArticleComment,
  deleteArticleComment,
};
