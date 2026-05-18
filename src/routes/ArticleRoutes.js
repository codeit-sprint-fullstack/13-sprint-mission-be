import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json(article);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "게시글 등록 실패",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const articles = await prisma.article.findMany();

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 목록 조회 실패",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: Number(req.params.id),
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if(!article) {
      return res.status(400).json({
        message: "게시글을 찾을 수 없습니다",
      });
    }
    
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({
      message: "게시글 조회 실패",
      error: error.message,
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const articleId = Number(req.params.id);
    const { title, content } = req.body;

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
    });

    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({
      message: "게시글 수정 실패",
      error: error.message,
    });
  }
});
export default router;


router.delete("/:id", async (req, res) => {
  try{
    const articleId = Number(req.params.id);

    await prisma.article.delete({
      where: {
        id: articleId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      message:"게시글 삭제 실패",
      error: error.message,
    });
  }
});