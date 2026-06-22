import prisma from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../utils/errors.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../schemas/comment.schema.js";

//create
export const createComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await prisma.article.findUnique({
    where: { id: parseInt(articleId) },
  });

  if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다.");

  const data = createCommentSchema.parse(req.body);
  const comment = await prisma.comment.create({
    data: { ...data, articleId: parseInt(articleId) },
  });

  res.status(201).json({ success: true, data: comment });
});

//update
export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const data = updateCommentSchema.parse(req.body);
  const comment = await prisma.comment.update({
    where: { id: parseInt(commentId) },
    data,
  });

  res.json({ success: true, data: comment });
});

//delete
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  await prisma.comment.delete({
    where: { id: parseInt(commentId) },
  });

  res.json({ success: true, message: "댓글이 삭제되었습니다." });
});

//Read

export const getComments = asyncHandler(async (req, res) => {
  const { cursor, take = "5" } = req.query;
  const { articleId } = req.params;
  const takeNum = parseInt(take) + 1;
  const queryOptions = {
    where: { articleId: parseInt(articleId) },
    orderBy: { id: "asc" },
    take: takeNum,
  };

  if (cursor) {
    queryOptions.cursor = { id: parseInt(cursor) };
    queryOptions.skip = 1;
  }

  const comment = await prisma.comment.findMany(queryOptions);
  let hasNextPage = false;

  if (comment.length === takeNum) {
    comment.pop();
    hasNextPage = true;
  }

  const nextCursor = comment.length > 0 ? comment[comment.length - 1].id : null;

  res.json({
    success: true,
    data: comment,
    hasNextPage,
    nextCursor,
  });
});
