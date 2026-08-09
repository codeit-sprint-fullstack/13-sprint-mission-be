import prisma from "../config/prisma.js";

const writerSelect = { select: { id: true, nickname: true, image: true } };

// PATCH/DELETE /comments/:commentId 가 상품/게시글 댓글 중 어느 쪽이든 다룰 수 있도록 함
type CommentTable = "articleComment" | "productComment";

interface CreateArticleCommentParams {
  content: string;
  articleId: number;
  userId: number;
}

export function createArticleComment({ content, articleId, userId }: CreateArticleCommentParams) {
  return prisma.articleComment.create({
    data: { content, articleId, userId },
    include: { user: writerSelect },
  });
}

interface FindArticleCommentsParams {
  articleId: number;
  cursor?: number;
  take: number;
}

export function findArticleComments({ articleId, cursor, take }: FindArticleCommentsParams) {
  return prisma.articleComment.findMany({
    where: { articleId },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    include: { user: writerSelect },
  });
}

interface CreateProductCommentParams {
  content: string;
  productId: number;
  userId: number;
}

export function createProductComment({ content, productId, userId }: CreateProductCommentParams) {
  return prisma.productComment.create({
    data: { content, productId, userId },
    include: { user: writerSelect },
  });
}

interface FindProductCommentsParams {
  productId: number;
  cursor?: number;
  take: number;
}

export function findProductComments({ productId, cursor, take }: FindProductCommentsParams) {
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
export async function findCommentAnywhere(id: number) {
  const [productComment, articleComment] = await Promise.all([
    prisma.productComment.findUnique({ where: { id } }),
    prisma.articleComment.findUnique({ where: { id } }),
  ]);
  if (productComment)
    return { table: "productComment" as const, comment: productComment };
  if (articleComment)
    return { table: "articleComment" as const, comment: articleComment };
  return null;
}

export function update(table: CommentTable, id: number, content: string) {
  if (table === "articleComment") {
    return prisma.articleComment.update({
      where: { id },
      data: { content },
      include: { user: writerSelect },
    });
  }
  return prisma.productComment.update({
    where: { id },
    data: { content },
    include: { user: writerSelect },
  });
}

export function remove(table: CommentTable, id: number) {
  if (table === "articleComment") {
    return prisma.articleComment.delete({ where: { id } });
  }
  return prisma.productComment.delete({ where: { id } });
}