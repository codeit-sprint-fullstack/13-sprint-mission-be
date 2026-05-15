const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // POST, PATCH 시 body 데이터를 읽기 위해 필수!

// ==========================================
// [자유게시판 API]
// ==========================================

// 1. 게시글 목록 조회 (Offset 페이지네이션, 검색, 정렬, 특정 필드 선택)
app.get("/articles", async (req, res) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const keyword = req.query.keyword || "";

      const skip = (page - 1) * limit;

      const articles = await prisma.article.findMany({
         skip: skip,
         take: limit,
         orderBy: { createdAt: "desc" }, // 최신순 정렬
         where: keyword
            ? {
                 OR: [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                 ],
              }
            : {},
         select: { id: true, title: true, content: true, createdAt: true }, // 요구사항 필드만 조회
      });
      res.status(200).json(articles);
   } catch (error) {
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// 2. 게시글 상세 조회
app.get("/articles/:id", async (req, res) => {
   try {
      const article = await prisma.article.findUnique({
         where: { id: req.params.id },
         select: { id: true, title: true, content: true, createdAt: true },
      });
      if (!article)
         return res.status(404).json({ message: "게시글이 없습니다." });
      res.status(200).json(article);
   } catch (error) {
      res.status(500).json({ message: "서버 에러" });
   }
});

// 3. 게시글 등록
app.post("/articles", async (req, res) => {
   try {
      const { title, content } = req.body;
      const newArticle = await prisma.article.create({
         data: { title, content },
      });
      res.status(201).json(newArticle);
   } catch (error) {
      res.status(400).json({ message: "잘못된 요청입니다." });
   }
});

// 4. 게시글 수정 & 5. 삭제 부분
