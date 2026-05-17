import prisma from "../lib/prisma.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

// - [ ]  댓글 등록 API를 만들어 주세요.
//     - [ ]  [ ] `content`를 입력하여 댓글을 등록합니다.
//     - [ ]  중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.

// 댓글 등록 to article
export const createComment = async (req, res) => {
  const { articleId } = req.params;

  const parsedArticleId = parseInt(articleId);

  if (isNaN(parsedArticleId)) {
    throw new ValidationError("articleId는 숫자여야 합니다");
  }

  // validate middleware 통과한 데이터
  const { content } = req.validatedData;

  // 게시글 존재 확인
  const article = await prisma.article.findUnique({
    where: {
      id: parsedArticleId,
    },
  });

  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다");
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      articleId: parsedArticleId,
    },
  });

  res.status(201).json({
    success: true,
    data: comment,
  });
};

// - [ ]  댓글 수정 API를 만들어 주세요.
//     - [ ]  PATCH 메서드를 사용해 주세요.
export const updateComment = async (req, res) => {
  const { articleId, commentId } = req.params;

  const parsedArticleId = parseInt(articleId);
  const parsedCommentId = parseInt(commentId);

  if (isNaN(parsedArticleId) || isNaN(parsedCommentId)) {
    throw new ValidationError("id는 숫자여야 합니다");
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: parsedCommentId,
    },
  });

  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다");
  }

  if (comment.articleId !== parsedArticleId) {
    throw new ValidationError("해당 게시글의 댓글이 아닙니다");
  }

  const updatedComment = await prisma.comment.update({
    where: {
      id: parsedCommentId,
    },
    data: req.validatedData,
  });

  res.json({
    success: true,
    data: updatedComment,
  });
};

// - [ ]  댓글 삭제 API를 만들어 주세요.
export const deleteComment = async (req, res) => {
  const { articleId, commentId } = req.params;

  const parsedArticleId = parseInt(articleId);
  const parsedCommentId = parseInt(commentId);

  if (isNaN(parsedArticleId) || isNaN(parsedCommentId)) {
    throw new ValidationError("id는 숫자여야 합니다");
  }

  const comment = await prisma.comment.findUnique({
    where: {
      id: parsedCommentId,
    },
  });

  if (!comment) {
    throw new NotFoundError("댓글을 찾을 수 없습니다");
  }

  if (comment.articleId !== parsedArticleId) {
    throw new ValidationError("해당 게시글의 댓글이 아닙니다");
  }

  await prisma.comment.delete({
    where: {
      id: parsedCommentId,
    },
  });

  res.status(204).send();
};

// // feat: cascading 구현
// export const deleteArticleWithComments = async (req, res, next) => {
//   const { articleId } = req.params;
//   const parsedArticleId = parseInt(articleId);

//   if (isNaN(parsedArticleId)) {
//     throw new ValidationError("articleId는 숫자여야 합니다");
//   }

//   const article = await prisma.article.findUnique({
//     where: { id: parsedArticleId },
//     include: { comments: { select: { id: true } } },
//   });

//   if (!article) {
//     throw new NotFoundError("게시글을 찾을 수 없습니다");
//   }

//   const commentCount = article.comments.length;

//   // 게시글 삭제 (댓글도 자동 삭제됨)
//   await prisma.article.delete({
//     where: { id: parsedArticleId },
//   });

//   res.json({
//     success: true,
//     message: `게시글이 삭제되었습니다 (${commentCount}개의 댓글도 자동 삭제됨)`,
//     deletedArticleId: parsedArticleId,
//     deletedCommentCount: commentCount,
//   });
// };

// - [ ]  댓글 목록 조회 API를 만들어 주세요.
//     - [ ] `id`, `content`, `createdAt` 를 조회합니다.
//     - [ ]  cursor 방식의 페이지네이션 기능을 포함해 주세요.
//     - [ ]  중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.
export const getComments = async (req, res) => {
  const { articleId } = req.params;

  const { cursor, limit = "10" } = req.query;

  const parsedArticleId = parseInt(articleId);

  const pageLimit = parseInt(limit);

  if (isNaN(parsedArticleId)) {
    throw new ValidationError("articleId는 숫자여야 합니다");
  }

  const article = await prisma.article.findUnique({
    where: {
      id: parsedArticleId,
    },
  });

  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다");
  }

  const comments = await prisma.comment.findMany({
    where: {
      articleId: parsedArticleId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: pageLimit + 1,

    ...(cursor && {
      skip: 1,
      cursor: {
        id: parseInt(cursor),
      },
    }),
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  let nextCursor = null;

  if (comments.length > pageLimit) {
    const nextItem = comments.pop();

    nextCursor = nextItem?.id;
  }

  res.json({
    success: true,

    data: comments,

    pagination: {
      nextCursor,
      hasMore: !!nextCursor,
    },
  });
};
