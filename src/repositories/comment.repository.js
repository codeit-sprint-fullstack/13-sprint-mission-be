import prisma from "../config/prisma.js";

const writerSelect = { select: { id: true, nickname: true, image: true } };

export function createArticleComment({ content, articleId, userId }) {
  return prisma.articleComment.create({
    data: { content, articleId, userId },
    include: { user: writerSelect },
  });
}

export function findArticleComments({ articleId, cursor, take }) {
  return prisma.articleComment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    include: { user: writerSelect },
  });
}

export function createProductComment({ content, productId, userId }) {
  return prisma.productComment.create({
    data: { content, productId, userId },
    include: { user: writerSelect },
  });
}

export function findProductComments({ productId, cursor, take }) {
  return prisma.productComment.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    include: { user: writerSelect },
  });
}

// PATCH/DELETE /comments/:commentId 는 상품/게시글 댓글 테이블이 분리되어 있어
// commentId 하나로는 어느 테이블 소속인지 알 수 없음 -> 두 테이블을 함께 조회해서 찾음
export async function findCommentAnywhere(id) {
  const [productComment, articleComment] = await Promise.all([
    prisma.productComment.findUnique({ where: { id } }),
    prisma.articleComment.findUnique({ where: { id } }),
  ]);
  if (productComment)
    return { table: "productComment", comment: productComment };
  if (articleComment)
    return { table: "articleComment", comment: articleComment };
  return null;
}

export function update(table, id, content) {
  return prisma[table].update({
    where: { id },
    data: { content },
    include: { user: writerSelect },
  });
}

export function remove(table, id) {
  return prisma[table].delete({ where: { id } });
}