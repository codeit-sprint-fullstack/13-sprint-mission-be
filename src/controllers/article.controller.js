import prisma from "../lib/prisma.js";
///게시글 등록 컨트롤러
export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
///게시글 전체 조회 컨트롤러
export const getAllArticle = async (req, res) => {
  try {
    const { keyword, sort = "latest", page = "1", limit = "10" } = req.query;
    const where = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }

    const orderBy = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
    }[sort] || { createdAt: "desc" };

    const pageNum = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (pageNum - 1) * take;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({ where, orderBy, skip, take }),
      prisma.article.count({ where }),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
///게시글 상세 조회 컨트롤러
export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "게시글을 찾을 수 없습니다" });
    }

    res.json({
      success: true,
      data: {
        id: article.id,
        title: article.title,
        content: article.content,
        createdAt: article.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

///게시글 수정 컨트롤러
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
      },
    });
    res.json({ success: true, data: article });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "게시글을 찾을 수 없습니다" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};
///게시글 삭제 컨트롤러
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: "게시글이 삭제되었습니다" });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "게시글을 찾을 수 없습니다" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};
