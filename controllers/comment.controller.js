import { skip } from "@prisma/client/runtime/library";
import prisma from "../lib/prisma.js";

export const GetArticleComment = async (req, res) => {
  try {
    const { cursorId, sort } = req.query;
    const { id } = req.params;
    const orderBy = { recent: { createdAt: "asc" } }[sort] || {
      createdAt: "asc",
    };
    const where = { articleId: Number(id) };
    const numCursorID = +cursorId;
    const commentData = await prisma.comment.findMany({
      where,
      orderBy,
      ...(numCursorID > 0 && {
        cursor: { id: numCursorID },
        skip: 1,
      }),
      take: 10,
    });

    if (!commentData)
      return res.status(500).json({ message: "데이터를 가져오지 못했습니다." });
    res.json(commentData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const GetProductComment = async (req, res) => {
  try {
    const { cursorId, sort } = req.query;
    const { id } = req.params;
    const orderBy = { recent: { createdAt: "asc" } }[sort] || {
      createdAt: "asc",
    };
    const where = { productId: Number(id) };
    const numCursorID = +cursorId;
    const commentData = await prisma.comment.findMany({
      where,
      orderBy,
      ...(numCursorID > 0 && {
        cursor: { id: numCursorID },
        skip: 1,
      }),
      take: 10,
    });

    if (!commentData)
      return res.status(500).json({ message: "데이터를 가져오지 못했습니다." });
    res.json(commentData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const PostProductComment = async (req, res) => {
  try {
    const { id } = req.params;
    const commentData = await prisma.comment.create({
      data: { ...req.body, productId: Number(id) },
    });
    if (!commentData) {
      return res.status(500).json(error.message);
    }
    res.status(201).json(commentData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const PostArticleComment = async (req, res) => {
  try {
    const { id } = req.params;
    const commentData = await prisma.comment.create({
      data: { ...req.body, articleId: Number(id) },
    });
    if (!commentData) {
      return res.status(500).json(error.message);
    }
    res.status(201).json(commentData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const PatchComment = async (req, res) => {
  try {
    const { id } = req.params;
    const commentData = await prisma.comment.update({
      where: { id: Number(id) },
      data: { ...req.body },
    });
    if (!commentData) {
      return res.status(500).json(error.message);
    }
    res.status(201).json(commentData);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const DeleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const articleData = await prisma.comment.delete({
      where: { id: Number(id) },
    });
    if (!articleData) {
      throw new Error("해당하는 ID가 없습니다.");
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error.message);
  }
};
