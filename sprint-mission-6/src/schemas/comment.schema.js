import { z } from "zod";

const contentField = z.string().max(1000, "content는 1000자 이하여야 합니다");

export const createArticleCommentSchema = z.object({
  content: contentField,
});

export const updateArticleCommentSchema = z.object({
  content: contentField,
});

export const createProductCommentSchema = z.object({
  content: contentField,
});

export const updateProductCommentSchema = z.object({
  content: contentField,
});
