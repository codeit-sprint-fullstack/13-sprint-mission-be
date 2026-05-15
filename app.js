// [자유게시판 댓글 API]

// 1. 댓글 목록 조회 (Cursor 페이지네이션)
app.get("/articles/:articleId/comments", async (req, res) => {
   try {
      const { articleId } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor;

      const comments = await prisma.articleComment.findMany({
         where: { articleId: articleId },
         take: limit,
         skip: cursor ? 1 : 0,
         cursor: cursor ? { id: cursor } : undefined,
         orderBy: { createdAt: "desc" },
         select: { id: true, content: true, createdAt: true },
      });
      res.status(200).json(comments);
   } catch (error) {
      res.status(500).json({ message: "서버 에러" });
   }
});

// 2. 댓글 등록
app.post("/articles/:articleId/comments", async (req, res) => {
   try {
      const { articleId } = req.params;
      const { content } = req.body;

      const newComment = await prisma.articleComment.create({
         data: { content, articleId },
      });
      res.status(201).json(newComment);
   } catch (error) {
      res.status(400).json({ message: "잘못된 요청입니다." });
   }
});

// 3. 댓글 수정 (PATCH)
app.patch("/comments/:id", async (req, res) => {
   try {
      const { id } = req.params;
      const { content } = req.body;

      const updatedComment = await prisma.articleComment.update({
         where: { id },
         data: { content },
      });
      res.status(200).json(updatedComment);
   } catch (error) {
      if (error.code === "P2025")
         return res.status(404).json({ message: "댓글이 없습니다." });
      res.status(500).json({ message: "서버 에러" });
   }
});

// 4. 댓글 삭제 (DELETE)
app.delete("/comments/:id", async (req, res) => {
   try {
      await prisma.articleComment.delete({ where: { id: req.params.id } });
      res.status(204).send();
   } catch (error) {
      res.status(404).json({ message: "존재하지 않는 댓글입니다." });
   }
});

// 서버 실행
app.listen(3000, () => {
   console.log(" Server is running on http://localhost:3000");
});
