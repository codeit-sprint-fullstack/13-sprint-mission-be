import { z } from "zod";

export default z
  .object({
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    PORT: z.coerce.number().default(3001),
    FRONTEND_URL: z.string().default(""),
  })
  .parse(process.env);
