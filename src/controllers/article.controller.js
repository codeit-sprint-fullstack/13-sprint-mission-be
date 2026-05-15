import prisma from "../lib/prisma.js";

// 게시글 등록
export const postArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// 게시글 목록 조회
export const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany();

    res
      .status(200)
      .json({ success: true, totalCount: articles.length, data: articles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// 게시글 상세 페이지 조회
export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: err.message,
      });

      res.status(200).json({
        success: true,
        totalCount: article.length,
        data: article,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// 게시글 수정
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.status(200).json({ success: true, data: article });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "찾을 수 없습니다" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// 게시글 삭제
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: "삭제되었습니다" });
  } catch (err) {
    if (err.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "찾을 수 없습니다" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};
