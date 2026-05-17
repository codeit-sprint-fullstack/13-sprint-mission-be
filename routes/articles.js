// routes/articles.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// 1. [목록 조회] 오프셋 페이지네이션, 최신순 정렬, 제목/내용 검색
router.get("/", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword } },
          { content: { contains: keyword } },
        ],
      },
      orderBy: { createdAt: "desc" }, // 최신순
      skip: offset,
      take: limit,
      select: { id: true, title: true, content: true, createdAt: true }, // 요구사항 필드만 리턴
    });

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "게시글 목록 조회 실패" });
  }
});

// 2. [게시글 등록]
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "제목과 내용을 입력해주세요." });
    }
    const newArticle = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(newArticle); // 생성 성공 201
  } catch (error) {
    res.status(500).json({ message: "게시글 등록 실패" });
  }
});

// 3. [게시글 상세 조회]
router.get("/:id", async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article)
      return res.status(404).json({ message: "존재하지 않는 게시글입니다." });

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: "게시글 조회 실패" });
  }
});

// 4. [게시글 수정]
router.patch("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content },
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(404).json({ message: "게시글을 찾을 수 없거나 수정 실패" });
  }
});

// 5. [게시글 삭제]
router.delete("/:id", async (req, res) => {
  try {
    await prisma.article.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send(); // 삭제 성공 시 204 No Content
  } catch (error) {
    res.status(404).json({ message: "게시글을 찾을 수 없거나 삭제 실패" });
  }
});

module.exports = router;
