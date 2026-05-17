const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId);
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

    const queryOptions = {
      where: { articleId },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: { id: true, content: true, createdAt: true },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const comments = await prisma.articleComment.findMany(queryOptions);

    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1].id : null;

    res.status(200).json({ data: comments, nextCursor });
  } catch (error) {
    res.status(500).json({ message: "댓글 목록 조회 실패" });
  }
});

router.post("/", async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId);
    const { content } = req.body;

    if (!content)
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });

    const newComment = await prisma.articleComment.create({
      data: { content, articleId },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "댓글 등록 실패" });
  }
});

router.patch("/:commentId", async (req, res) => {
  try {
    const { content } = req.body;
    const updatedComment = await prisma.articleComment.update({
      where: { id: parseInt(req.params.commentId) },
      data: { content },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(404).json({ message: "댓글 수정 실패" });
  }
});

router.delete("/:commentId", async (req, res) => {
  try {
    await prisma.articleComment.delete({
      where: { id: parseInt(req.params.commentId) },
    });
    res.status(204).send(); // 삭제 성공
  } catch (error) {
    res.status(404).json({ message: "댓글 삭제 실패" });
  }
});

module.exports = router;
