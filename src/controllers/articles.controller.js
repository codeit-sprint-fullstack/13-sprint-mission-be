import prisma from "../lib/prisma.js";

export const getAllArticles = async (req, res) => {
  try {
    const { keyword, sort = "latest", page = "1", limit = "10" } = req.query;

    const where = {};

    if (keyword) {
      // where["title"] = { contains: keyword } where.title= ... 둘은 같음
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }

    const orderBy = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      title: { title: "asc" },
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "해당 id 게시글 없음" });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const postArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    const article = await prisma.article.create({
      data: { title, content },
    });

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json({ success: true, data: article });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "해당 id게시글없음" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: Number(id) },
    });
    res.json({
      success: true,
      message: "성공적으로 삭제 됨",
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "해당 id 게시글 없음" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
