import prisma from "../lib/prisma.js";
///Article controller
/// 게시글 댓글 등록
export const createArticleComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId: parseInt(articleId),
      },
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
///게시글 댓글 조회
export const getAllArticleComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { page = "1", limit = "10" } = req.query;
    const pageNum = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (pageNum - 1) * take;
    const where = {
      articleId: parseInt(articleId),
    };

    const [articleComments, total] = await Promise.all([
      prisma.articleComment.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.articleComment.count({ where }),
    ]);
    res.json({
      success: true,
      data: articleComments,
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
///게시글 댓글 수정
export const updateArticleComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.articleComment.update({
      where: {
        id: parseInt(commentId),
      },
      data: {
        content,
      },
    });

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

///게시글 댓글 삭제
export const deleteArticleComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    await prisma.articleComment.delete({
      where: {
        id: parseInt(commentId),
      },
    });

    res.json({
      success: true,
      message: "댓글이 삭제되었습니다",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
///----------------------------------------------------------------------------///
///product controller

/// 상품 댓글 등록
export const createProductComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    const comment = await prisma.productComment.create({
      data: {
        content,
        productId: parseInt(productId),
      },
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
/// 상품 댓글 조회
export const getAllProductComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = "1", limit = "10" } = req.query;
    const pageNum = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (pageNum - 1) * take;
    const where = {
      productId: parseInt(productId),
    };

    const [productComments, total] = await Promise.all([
      prisma.productComment.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.productComment.count({ where }),
    ]);
    res.json({
      success: true,
      data: productComments,
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
/// 상품 댓글 수정
export const updateProductComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.productComment.update({
      where: {
        id: parseInt(commentId),
      },
      data: {
        content,
      },
    });

    res.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/// 상품 댓글 삭제
export const deleteProductComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    await prisma.productComment.delete({
      where: {
        id: parseInt(commentId),
      },
    });

    res.json({
      success: true,
      message: "댓글이 삭제되었습니다",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
