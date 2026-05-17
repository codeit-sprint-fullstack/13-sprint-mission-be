// routes/articleComments.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");

// mergeParams: true를 해야 app.js에서 넘겨준 :articleId를 여기서 쓸 수 있습니다.
const router = express.Router({ mergeParams: true });
const prisma = new PrismaClient();

// 1. [댓글 목록 조회] 커서(Cursor) 기반 페이지네이션
router.get("/", async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId);
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;

    // Prisma 쿼리 기본 설정
    const queryOptions = {
      where: { articleId },
      take: limit,
      orderBy: { createdAt: "desc" }, // 최신순
      select: { id: true, content: true, createdAt: true }, // 요구사항 필드만
    };

    // 만약 프론트엔드가 'cursor(마지막으로 본 댓글 ID)'를 보냈다면?
    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1; // 커서 본인은 제외하고 그 다음부터 가져옴
    }

    const comments = await prisma.articleComment.findMany(queryOptions);

    // 다음 페이지를 위해 마지막 댓글의 ID를 nextCursor로 알려줌
    const nextCursor =
      comments.length > 0 ? comments[comments.length - 1].id : null;

    res.status(200).json({ data: comments, nextCursor });
  } catch (error) {
    res.status(500).json({ message: "댓글 목록 조회 실패" });
  }
});

// 2. [댓글 등록]
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

// 3. [댓글 수정] PATCH 메서드 사용
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

// 4. [댓글 삭제]
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
