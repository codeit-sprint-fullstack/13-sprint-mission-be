const express = require("express");
const prisma = require("../lib/prisma");
const ENDPOINTS = require("../constants/endpoints");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

const getCommentId = (req) => Number.parseInt(req.params.commentId, 10);

const serializeComment = (comment) => ({
  id: comment.id,
  content: comment.content,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
  writerId: comment.writerId,
  writer: comment.writer,
});

const findComment = async (commentId) => {
  const productComment = await prisma.productComment.findUnique({
    where: { id: commentId },
    include: {
      writer: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
  });

  if (productComment) {
    return { type: "product", comment: productComment };
  }

  const articleComment = await prisma.articleComment.findUnique({
    where: { id: commentId },
    include: {
      writer: {
        select: {
          id: true,
          nickname: true,
          image: true,
        },
      },
    },
  });

  if (articleComment) {
    return { type: "article", comment: articleComment };
  }

  return null;
};

const updateComment = async (req, res, next) => {
  try {
    const commentId = getCommentId(req);
    const content = req.body.content?.trim();

    if (Number.isNaN(commentId)) {
      return res.status(400).json({ message: "유효하지 않은 댓글 ID입니다." });
    }

    if (!content) {
      return res.status(400).json({ message: "댓글 내용을 입력해 주세요." });
    }

    const found = await findComment(commentId);

    if (!found) {
      return res.status(404).json({ message: "존재하지 않는 댓글입니다." });
    }

    if (found.comment.writerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "댓글을 수정할 권한이 없습니다." });
    }

    const model =
      found.type === "product" ? prisma.productComment : prisma.articleComment;
    const updatedComment = await model.update({
      where: { id: commentId },
      data: { content },
      include: {
        writer: {
          select: {
            id: true,
            nickname: true,
            image: true,
          },
        },
      },
    });

    return res.json(serializeComment(updatedComment));
  } catch (err) {
    return next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentId = getCommentId(req);

    if (Number.isNaN(commentId)) {
      return res.status(400).json({ message: "유효하지 않은 댓글 ID입니다." });
    }

    const found = await findComment(commentId);

    if (!found) {
      return res.status(404).json({ message: "존재하지 않는 댓글입니다." });
    }

    if (found.comment.writerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "댓글을 삭제할 권한이 없습니다." });
    }

    const model =
      found.type === "product" ? prisma.productComment : prisma.articleComment;

    await model.delete({
      where: { id: commentId },
    });

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

router
  .route(ENDPOINTS.COMMENT_BY_ID)
  .patch(authenticate, updateComment)
  .delete(authenticate, deleteComment);

module.exports = router;
