import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/:articleId/comments", async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const { content } = req.body;

    const comment = await prisma.articleComment.create({
      data: {
        content,
        article: {
          connect: {
            id: articleId,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({
      message: "댓글 등록 실패",
      error: error.message,
    });
  }
});

router.get("/:articleId/comments", async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.articleComment.findMany({
      where: {
        articleId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Number(limit),
      ...(cursor && {
        cursor: {
          id: Number(cursor),
        },
        skip: 1,
      }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "댓글 목록 조회 실패",
      error: error.message,
    });
  }
});

router.patch("/comments/:id", async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    const { content } = req.body;

    const updatedComment = await prisma.articleComment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({
      message: "댓글 수정 실패",
      error: error.message,
    });
  }
});

router.delete("/comments/:id", async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    await prisma.articleComment.delete({
      where: {
        id: commentId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "댓글 삭제 실패",
      error: error.message,
    });
  }
});

export default router;
