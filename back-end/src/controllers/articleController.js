import { PrismaClient } from "@prisma/client";
import { sendError, escapeRegExp } from "../utils/errorHandler.js";

const prisma = new PrismaClient();

// 게시글 등록
export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return sendError(res, 400, "제목과 내용을 입력해주세요.");

    const article = await prisma.article.create({ data: { title, content } });
    res.status(201).json(article);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

// 게시글 목록 조회
export const getArticles = async (req, res) => {
  try {
    let { offset = 0, limit = 10, search, orderBy = "recent" } = req.query;

    offset = parseInt(offset, 10);
    limit = parseInt(limit, 10);
    if (isNaN(offset) || offset < 0) offset = 0;
    if (isNaN(limit) || limit <= 0) limit = 10;
    if (limit > 100) limit = 10;

    let searchCondition = {};
    if (search && typeof search === "string") {
      const escapedSearch = escapeRegExp(search.trim());
      searchCondition = {
        OR: [
          { title: { contains: escapedSearch, mode: "insensitive" } },
          { content: { contains: escapedSearch, mode: "insensitive" } },
        ],
      };
    }

    const articles = await prisma.article.findMany({
      where: searchCondition,
      orderBy: { createdAt: orderBy === "recent" ? "desc" : "asc" },
      skip: offset,
      take: limit,
    });
    res.status(200).json(articles);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

// 게시글 상세 조회
export const getArticleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, "올바르지 않은 ID 형식입니다.");

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return sendError(res, 404, "게시글이 없습니다.");
    res.status(200).json(article);
  } catch (e) {
    sendError(res, 500, e.message);
  }
};

// 게시글 수정
export const updateArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, "올바르지 않은 ID 형식입니다.");

    const { title, content } = req.body;
    if (title === undefined && content === undefined)
      return sendError(res, 400, "수정할 내용을 입력해주세요.");

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json(article);
  } catch (e) {
    sendError(res, 404, "수정 실패 또는 해당 게시글이 없습니다.");
  }
};

// 게시글 삭제
export const deleteArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return sendError(res, 400, "올바르지 않은 ID 형식입니다.");

    await prisma.article.delete({ where: { id } });
    res.status(200).json({ message: "삭제 완료" });
  } catch (e) {
    sendError(res, 404, "삭제 실패 또는 해당 게시글이 없습니다.");
  }
};
