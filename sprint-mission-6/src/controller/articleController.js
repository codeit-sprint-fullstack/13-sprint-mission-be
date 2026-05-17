import prisma from "../lib/prisma.js";
// import {
//   createArticleSchema,
//   updateArticleSchema,
//   idParamSchema,
// } from "../validation/articleValidation.js";

// 생성
export const createArticle = async (req, res) => {
  try {
    // 객체데이터 분해할당
    const { title, content } = req.body;
    // 프리즈마 create로 데이터 생성
    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("에러 내용 :", error);
  }
};

// ---------------------------------------------------------------------------------
// 전체조회(목록조회)
export const getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";
    const offset = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.article.count({
        where: {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        },
      }),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
        limit,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error,
    });
  }
};

// 개별 조회
export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, title: true, content: true, createdAt: true },
    });

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Toarticledo를 찾을 수 없습니다" });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 수정

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json({ success: true, data: article });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "article 찾을 수 없습니다" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// 삭제

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json({ success: true, message: "게시글이 삭제되었습니다" });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "게시글을 찾을 수 없습니다" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
