import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import {
  NotFoundError,
  ServerError,
  ValidationError,
} from "../types/AppError.js";
import { Prisma } from "@prisma/client";
///Article controller
/// 게시글 댓글 등록
export const createArticleComment = async (
  req: Request<{ articleId: string }, {}, { content: string }>,
  res: Response,
): Promise<void> => {
  const { articleId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ValidationError("content는 필수입니다");
  }

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
};
///게시글 댓글 조회
export const getAllArticleComment = async (
  req: Request<{ articleId: string }, {}, {}, { page: string; limit: string }>,
  res: Response,
): Promise<void> => {
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
};
///게시글 댓글 수정
export const updateArticleComment = async (
  req: Request<{ commentId: string }, {}, { content: string }>,
  res: Response,
): Promise<void> => {
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("댓글을 찾을 수 없습니다");
    }
    throw error;
  }
};

///게시글 댓글 삭제
export const deleteArticleComment = async (
  req: Request<{ commentId: string }>,
  res: Response,
): Promise<void> => {
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("댓글을 찾을 수 없습니다");
    }
    throw error;
  }
};
///----------------------------------------------------------------------------///
///product controller

/// 상품 댓글 등록
export const createProductComment = async (
  req: Request<{ productId: string }, {}, { content: string }>,
  res: Response,
): Promise<void> => {
  const { productId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ValidationError("content는 필수입니다");
  }

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
};
/// 상품 댓글 조회
export const getAllProductComment = async (
  req: Request<{ productId: string }, {}, {}, { page: string; limit: string }>,
  res: Response,
): Promise<void> => {
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
    console.error(error);
    throw new ServerError("서버 내부 오류가 발생했습니다");
  }
};
/// 상품 댓글 수정
export const updateProductComment = async (
  req: Request<{ commentId: string }, {}, { content: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
      throw new ValidationError("content는 필수입니다");
    }

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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("댓글을 찾을 수 없습니다");
    }
    throw error;
  }
};

/// 상품 댓글 삭제
export const deleteProductComment = async (
  req: Request<{ commentId: string }>,
  res: Response,
) => {
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("댓글을 찾을 수 없습니다");
    }
    throw error;
  }
};
