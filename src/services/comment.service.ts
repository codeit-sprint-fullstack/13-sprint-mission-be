import * as CommentRepository from "../repositories/comment.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import * as articleRepository from "../repositories/article.repository.js";
import { NotFoundError, ForbiddenError } from "../middlewares/errorHandler.js";

function toCommentResponse<T extends { user: unknown }>({ user, ...comment }: T) {
  return { ...comment, writer: user };
}

interface CursorPage {
  cursor?: number;
  limit: number;
}

// 게시글 댓글 등록
// 요구사항(댓글 기능 인가): "로그인한 사용자만 게시글에 댓글을 등록할 수 있습니다."
export async function createArticleComment(articleId: number, content: string, userId: number) {
  const article = await articleRepository.findByIdSimple(articleId);
  if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다");

  const comment = await CommentRepository.createArticleComment({ content, articleId, userId });
  return toCommentResponse(comment);
}

// 게시글 댓글 목록 조회 (cursor 페이지네이션)
export async function getArticleComments(articleId: number, { cursor, limit }: CursorPage) {
  const article = await articleRepository.findByIdSimple(articleId);
  if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다");

  const comments = await CommentRepository.findArticleComments({
    articleId,
    cursor,
    take: limit + 1,
  });

  let nextCursor: number | null = null;
  if (comments.length > limit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?.id ?? null;
  }

  return { list: comments.map(toCommentResponse), nextCursor };
}

// 상품 댓글 등록
// 요구사항(댓글 기능 인가): "로그인한 사용자만 상품에 댓글을 등록할 수 있습니다."
export async function createProductComment(productId: number, content: string, userId: number) {
  const product = await productRepository.findByIdSimple(productId);
  if (!product) throw new NotFoundError("상품을 찾을 수 없습니다");

  const comment = await CommentRepository.createProductComment({ content, productId, userId });
  return toCommentResponse(comment);
}

// 상품 댓글 목록 조회 (cursor 페이지네이션)
export async function getProductComments(productId: number, { cursor, limit }: CursorPage) {
  const product = await productRepository.findByIdSimple(productId);
  if (!product) throw new NotFoundError("상품을 찾을 수 없습니다");

  const comments = await CommentRepository.findProductComments({
    productId,
    cursor,
    take: limit + 1,
  });

  let nextCursor: number | null = null;
  if (comments.length > limit) {
    const nextItem = comments.pop();
    nextCursor = nextItem?.id ?? null;
  }

  return { list: comments.map(toCommentResponse), nextCursor };
}

// 요구사항(댓글 기능 인가): "댓글을 등록한 사용자만 댓글을 수정하거나 삭제할 수 있습니다."
export async function updateComment(commentId: number, userId: number, content: string) {
  const found = await CommentRepository.findCommentAnywhere(commentId);
  if (!found) throw new NotFoundError("댓글을 찾을 수 없습니다");
  if (found.comment.userId !== userId) {
    throw new ForbiddenError("본인이 등록한 댓글만 수정할 수 있습니다.");
  }

  const updated = await CommentRepository.update(found.table, commentId, content);
  return toCommentResponse(updated);
}

export async function deleteComment(commentId: number, userId: number) {
  const found = await CommentRepository.findCommentAnywhere(commentId);
  if (!found) throw new NotFoundError("댓글을 찾을 수 없습니다");
  if (found.comment.userId !== userId) {
    throw new ForbiddenError("본인이 등록한 댓글만 삭제할 수 있습니다.");
  }

  await CommentRepository.remove(found.table, commentId);
}
