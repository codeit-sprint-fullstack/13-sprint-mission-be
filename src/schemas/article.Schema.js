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

//이것도 중복이라 훅으로 처리 가능 할 거 같긴한데 일단 하겠습니다 ㅎㅎ
export const getArticleSchema = z.object({
  page: z.coerce
    .number()
    .min(1, "페이지는 1 이상이어야 합니다.")
    .optional()
    .default(1),
  pageSize: z.coerce
    .number()
    .min(1, "페이지 사이즈는 1 이상이어야 합니다.")
    .optional()
    .default(10),
  orderBy: z
    .enum(["recent", "oldest"], {
      invalid_type_error: "정렬 방식이 올바르지 않습니다.",
    })
    .optional()
    .default("recent"),
  keyword: z.string().optional().default(""),
});
