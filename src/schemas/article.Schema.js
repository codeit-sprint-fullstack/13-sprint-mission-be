import { z } from "zod";

const OPTIONAL_SIZE = {
  title: { min: 1, max: 10 },
  content: { min: 10, max: 500 },
};

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(
      OPTIONAL_SIZE.title.min,
      `게시글 제목은 ${OPTIONAL_SIZE.title.min}자 이상이어야 합니다.`,
    )
    .max(
      OPTIONAL_SIZE.title.max,
      `게시글 제목은 ${OPTIONAL_SIZE.title.max}자 이하여야 합니다.`,
    ),
  content: z
    .string()
    .min(
      OPTIONAL_SIZE.content.min,
      `내용은 ${OPTIONAL_SIZE.content.min}자 이상이어야 합니다.`,
    )
    .max(
      OPTIONAL_SIZE.content.max,
      `내용은 ${OPTIONAL_SIZE.content.max}자 이상이어야 합니다.`,
    ),
});
