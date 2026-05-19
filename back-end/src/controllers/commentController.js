import { PrismaClient } from "@prisma/client";
import { sendError } from "../utils/errorHandler.js";

const prisma = new PrismaClient();

// 댓글 등록
export const createComment = async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    const { content } = req.body;

    if (isNaN(articleId))
      return sendError(res, 400, "올바르지 않은 게시글 ID입니다.");
    if (!content || !content.trim())
      return sendError(res, 400, "댓글 내용을 입력해주세요.");

    const comment = await prisma.articleComment.create({
      data: { content, articleId },
    });
    res.status(201).json(comment);
  } catch (e) {
    sendError(res, 400, "등록 실패");
  }
};

// 댓글 목록 조회
export const getComments = async (req, res) => {
  try {
    const articleId = parseInt(req.params.articleId, 10);
    if (isNaN(articleId))
      return sendError(res, 400, "올바르지 않은 게시글 ID입니다.");

    let { cursor, limit = 5 } = req.query;
    limit = parseInt(limit, 10);
    if (isNaN(limit) || limit <= 0) limit = 5;
    if (limit > 50) limit = 5;

    const comments = await prisma.articleComment.findMany({
      where: { articleId },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
      orderBy: { id: "asc" },
    });
    res.status(200).json(comments);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};
