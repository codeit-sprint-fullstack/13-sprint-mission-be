import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import {
  AppError,
  NotFoundError,
  ServerError,
  ValidationError,
} from "../types/AppError.js";
import { Prisma } from "@prisma/client";
///게시글 등록 컨트롤러
export const createArticle = async (
  req: Request<{}, {}, { title: string; content: string }>,
  res: Response,
): Promise<void> => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ValidationError("title,content는 필수입니다");
  }
  const article = await prisma.article.create({
    data: { title, content },
  });

  res.status(201).json({
    success: true,
    data: article,
  });
};
///게시글 전체 조회 컨트롤러
export const getAllArticle = async (
  req: Request<
    {},
    {},
    {},
    { keyword: string; sort: string; page: string; limit: string }
  >,
  res: Response,
): Promise<void> => {
  try {
    const { keyword, sort = "latest", page = "1", limit = "10" } = req.query;
    const where: Prisma.ArticleWhereInput = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ];
    }

    const orderByMap: Record<string, Prisma.ArticleOrderByWithRelationInput> = {
      latest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
    };
    const orderBy = orderByMap[sort] || { createdAt: "desc" };

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
    if (error instanceof AppError) throw error;
    console.error(error);
    throw new ServerError("서버 내부 오류가 발생했습니다");
  }
};
///게시글 상세 조회 컨트롤러
export const getArticle = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      throw new NotFoundError("게시글을 찾을 수 없습니다");
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
    if (error instanceof AppError) throw error;
    console.error(error);
    throw new ServerError("서버 내부 오류가 발생했습니다");
  }
};

///게시글 수정 컨트롤러
export const updateArticle = async (
  req: Request<{ id: string }, {}, { title: string; content: string }>,
  res: Response,
): Promise<void> => {
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("게시글을 찾을 수 없습니다");
    }
    if (error instanceof AppError) throw error;
    console.error(error);
    throw new ServerError("서버 내부 오류가 발생했습니다");
  }
};
///게시글 삭제 컨트롤러
export const deleteArticle = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    res.json({ success: true, message: "게시글이 삭제되었습니다" });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("게시글을 찾을 수 없습니다");
    }
    if (error instanceof AppError) throw error;
    console.error(error);
    throw new ServerError("서버 내부 오류가 발생했습니다");
  }
};
