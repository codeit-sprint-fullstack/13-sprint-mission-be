import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/:productId/comments", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    const { content } = req.body;

    const comment = await prisma.productComment.create ({
      data: {
        content,

        product: {
          connect: {
            id: productId,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({
      message: "상품 댓글 등록 실패",
      error: error.message,
    });
  }
});

router.get("/:productId/comments", async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.productComment.findMany({
      where: {
        productId,
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
      message: "상품 댓글 목록 조회 실패",
      error: error.message,
    });
  }
});

router.patch("/comments/:id", async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    const { content } = req.body;

    const updatedComment = await prisma.productComment.update({
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
      message: "상품 댓글 수정 실패",
      error: error.message,
    });
  }
});

router.delete("/comments/:id", async (req, res) => {
  try {
    const commentId = Number(req.params.id);

    await prisma.productComment.delete({
      where: {
        id: commentId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message: "상품 댓글 삭제 실패",
      error: error.message,
    });
  }
});
export default router;