import { z } from "zod";

export const commentBodySchema = z.object({
  content: z
    .string("content는 필수입니다")
    .min(1, "content는 1자 이상이어야 합니다"),
});

export const getCommentsQuerySchema = z
  .object({
    cursor: z.coerce
      .number({ error: "cursor는 숫자여야 합니다" })
      .int("cursor는 정수여야 합니다")
      .positive("cursor는 양수여야 합니다"),
    limit: z.coerce
      .number({ error: "limit는 숫자여야 합니다" })
      .int("limit는 정수여야 합니다")
      .positive("limit는 양수여야 합니다"),
    sort: z.enum(
      ["recent", "oldest"],
      "sort는 'recent' 또는 'oldest' 여야 합니다",
    ),
  })
  .partial();

export const updateAndDeleteCommentParamsSchema = z.object({
  id: z.coerce
    .number({ error: "Id는 숫자여야 합니다" })
    .int("Id는 정수여야 합니다")
    .positive("Id는 양수여야 합니다"),
  commentId: z.coerce
    .number({ error: "commentId는 숫자여야 합니다" })
    .int("commentId는 정수여야 합니다")
    .positive("commentId는 양수여야 합니다"),
});

export const getAndCreateCommentParamsSchema = z.object({
  id: z.coerce
    .number({ error: "Id는 숫자여야 합니다" })
    .int("Id는 정수여야 합니다")
    .positive("Id는 양수여야 합니다"),
});
