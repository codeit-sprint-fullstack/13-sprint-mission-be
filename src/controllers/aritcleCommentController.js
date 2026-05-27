import { asyncHandler } from "../utils/asycHandler.js";
import prisma, { Prisma } from "../lib/prisma.js";
import { nanoid } from "nanoid";
import { NotFoundError } from "../utils/errors.js";

//댓글 등록
export const createArticleComment = asyncHandler(async (req, res) => {
  const { articleId } = req.params;

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) throw new NotFoundError("게시글을 찾을 수 없습니다.");

  const comment = await prisma.articleComment.create({
    data: {
      id: nanoid(),
      content: req.validatedData.content,
      articleId,
    },
  });

  res.status(201).json({ success: true, data: comment });
});

//댓글 목록 조회
export const getArticleComments = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { cursor, pageSize = 10 } = req.query;
  const limit = Number(pageSize);

  const comments = await prisma.articleComment.findMany({
    where: { articleId },
    select: { id: true, content: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });

  const hasNext = comments.length > limit;
  const list = hasNext ? comments.slice(0, limit) : comments;
  const nextCursor = hasNext ? list[list.length - 1].id : null;

  res.json({ list, nextCursor });
});

//댓글 수정
export const updateArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.articleComment.update({
    where: { id },
    data: req.validatedData,
  });

  res.json(comment);
});

//댓글 삭제
export const deleteArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.articleComment.delete({ where: { id } });

  res.status(204).send();
});
