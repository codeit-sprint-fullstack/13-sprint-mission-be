import prisma from "../lib/prisma.js";
//댓글 생성
export const createReply = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다",
      });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        articleId: parseInt(articleId),
      },
    });

    res.status(201).json({
      success: true,
      data: reply,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//수정
export const updateReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const reply = await prisma.reply.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ success: true, data: reply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//수정
export const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;

    const reply = await prisma.reply.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, data: reply });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "댓글을 찾을 수 없습니다" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

//조회
export const getAllReplies = async (req, res) => {
  try {
    const { articleId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined;

    const replies = await prisma.reply.findMany({
      where: { articleId: parseInt(articleId) }, // 특정 게시글 댓글만
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: "asc" },
    });

    const nextCursor =
      replies.length === limit ? replies[replies.length - 1].id : null;

    res.json({
      success: true,
      data: replies,
      nextCursor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
