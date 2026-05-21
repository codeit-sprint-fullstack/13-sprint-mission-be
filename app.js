const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// --- 자유게시판 API ---

// 게시글 목록 조회
app.get("/articles", async (req, res) => {
   try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const keyword = req.query.keyword || "";

      const skip = (page - 1) * limit;

      const articles = await prisma.article.findMany({
         skip: skip,
         take: limit,
         orderBy: { createdAt: "desc" },
         where: keyword
            ? {
                 OR: [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                 ],
              }
            : {},
         select: { id: true, title: true, content: true, createdAt: true },
      });
      res.status(200).json(articles);
   } catch (e) {
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// 게시글 상세 조회
app.get("/articles/:id", async (req, res) => {
   try {
      const article = await prisma.article.findUnique({
         where: { id: req.params.id },
         select: { id: true, title: true, content: true, createdAt: true },
      });

      if (!article) {
         return res
            .status(404)
            .json({ message: "존재하지 않는 게시글입니다." });
      }
      res.status(200).json(article);
   } catch (e) {
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// 게시글 등록
app.post("/articles", async (req, res) => {
   try {
      const { title, content } = req.body;
      if (!title || !content) {
         return res
            .status(400)
            .json({ message: "제목과 내용을 모두 입력해주세요." });
      }

      const newArticle = await prisma.article.create({
         data: { title, content },
      });
      res.status(201).json(newArticle);
   } catch (e) {
      res.status(500).json({ message: "게시글 등록에 실패했습니다." });
   }
});

// 게시글 수정
app.patch("/articles/:id", async (req, res) => {
   try {
      const { title, content } = req.body;
      const updatedArticle = await prisma.article.update({
         where: { id: req.params.id },
         data: { title, content },
      });
      res.status(200).json(updatedArticle);
   } catch (e) {
      if (e.code === "P2025") {
         return res
            .status(404)
            .json({ message: "존재하지 않는 게시글입니다." });
      }
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// 게시글 삭제
app.delete("/articles/:id", async (req, res) => {
   try {
      await prisma.article.delete({
         where: { id: req.params.id },
      });
      res.status(204).send();
   } catch (e) {
      if (e.code === "P2025") {
         return res
            .status(404)
            .json({ message: "존재하지 않는 게시글입니다." });
      }
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// --- 자유게시판 댓글 API ---

// 댓글 목록 조회
app.get("/articles/:articleId/comments", async (req, res) => {
   try {
      const limit = Number(req.query.limit) || 10;
      const cursor = req.query.cursor;

      const comments = await prisma.articleComment.findMany({
         where: { articleId: req.params.articleId },
         take: limit,
         skip: cursor ? 1 : 0,
         cursor: cursor ? { id: cursor } : undefined,
         orderBy: { createdAt: "desc" },
         select: { id: true, content: true, createdAt: true },
      });
      res.status(200).json(comments);
   } catch (e) {
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// 댓글 등록
app.post("/articles/:articleId/comments", async (req, res) => {
   try {
      const { content } = req.body;
      if (!content) {
         return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
      }

      const newComment = await prisma.articleComment.create({
         data: { content, articleId: req.params.articleId },
      });
      res.status(201).json(newComment);
   } catch (e) {
      res.status(500).json({ message: "댓글 등록에 실패했습니다." });
   }
});

// 댓글 수정
app.patch("/article-comments/:id", async (req, res) => {
   try {
      const updatedComment = await prisma.articleComment.update({
         where: { id: req.params.id },
         data: { content: req.body.content },
      });
      res.status(200).json(updatedComment);
   } catch (e) {
      res.status(404).json({ message: "존재하지 않는 댓글입니다." });
   }
});

// 댓글 삭제
app.delete("/article-comments/:id", async (req, res) => {
   try {
      await prisma.articleComment.delete({ where: { id: req.params.id } });
      res.status(204).send();
   } catch (e) {
      res.status(404).json({ message: "존재하지 않는 댓글입니다." });
   }
});

// --- 중고마켓 댓글 API ---

// 중고마켓 댓글 목록 조회
app.get("/products/:productId/comments", async (req, res) => {
   try {
      const limit = Number(req.query.limit) || 10;
      const cursor = req.query.cursor;

      const comments = await prisma.productComment.findMany({
         where: { productId: req.params.productId },
         take: limit,
         skip: cursor ? 1 : 0,
         cursor: cursor ? { id: cursor } : undefined,
         orderBy: { createdAt: "desc" },
         select: { id: true, content: true, createdAt: true },
      });
      res.status(200).json(comments);
   } catch (e) {
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// 중고마켓 댓글 등록
app.post("/products/:productId/comments", async (req, res) => {
   try {
      const { content } = req.body;
      const newComment = await prisma.productComment.create({
         data: { content, productId: req.params.productId },
      });
      res.status(201).json(newComment);
   } catch (e) {
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
   }
});

// 중고마켓 댓글 수정
app.patch("/product-comments/:id", async (req, res) => {
   try {
      const updatedComment = await prisma.productComment.update({
         where: { id: req.params.id },
         data: { content: req.body.content },
      });
      res.status(200).json(updatedComment);
   } catch (e) {
      res.status(404).json({ message: "존재하지 않는 댓글입니다." });
   }
});

// 중고마켓 댓글 삭제
app.delete("/product-comments/:id", async (req, res) => {
   try {
      await prisma.productComment.delete({ where: { id: req.params.id } });
      res.status(204).send();
   } catch (e) {
      res.status(404).json({ message: "존재하지 않는 댓글입니다." });
   }
});

// 서버 실행
app.listen(3000, () => {
   console.log("Server is running on port 3000");
});
