const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post("/api/articles", async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/articles", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const keyword = req.query.keyword || "";

    const articles = await prisma.article.findMany({
      where: keyword
        ? {
            OR: [
              { title: { contains: keyword } },
              { content: { contains: keyword } },
            ],
          }
        : {},
      select: { id: true, title: true, content: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/articles/:id", async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, title: true, content: true, createdAt: true },
    });
    if (!article)
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/articles/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id: parseInt(req.params.id) },
      data: { title, content },
    });
    res.json(article);
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/articles/:id", async (req, res) => {
  try {
    await prisma.article.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/articles/:articleId/comments", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: parseInt(req.params.articleId),
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/articles/:articleId/comments", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

    const comments = await prisma.comment.findMany({
      where: { articleId: parseInt(req.params.articleId) },
      take: limit,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { id: "desc" },
      select: { id: true, content: true, createdAt: true },
    });

    res.json({
      data: comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/comments/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { content },
    });
    res.json(comment);
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    res.status(400).json({ error: error.message });
  }
});

app.delete("/api/comments/:id", async (req, res) => {
  try {
    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025")
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다. (Prisma 연동 완료)`);
});
