import { asyncHandler } from "../utils/asycHandler.js";
import {
  createArticleService,
  getArticleService,
  getArticleByIdService,
  updateArticleService,
  deleteArticleService,
} from "../service/articleService.js";

// 게시물 등록
export const createArticle = asyncHandler(async (req, res) => {
  const article = await createArticleService({ data: req.validatedData });
  res.status(201).json({ success: true, data: article });
});

// 게시물 목록 조회
export const getArticle = asyncHandler(async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = req.query;

  const { list, totalCount } = await getArticleService({
    page,
    pageSize,
    orderBy,
    keyword,
  });
  res.status(200).json({ list, totalCount });
});

// 게시글 상세 조회
export const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await getArticleByIdService({ id });
  res.json(article);
});

// 게시글 수정
export const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await updateArticleService({ id, data: req.validatedData });
  res.json(article);
});

// 게시글 삭제
export const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteArticleService({ id });
  res.status(204).send();
});
