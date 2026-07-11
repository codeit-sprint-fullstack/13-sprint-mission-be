import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number({ error: "id는 숫자여야 합니다." }).int().positive("id는 양수여야 합니다."),
});
