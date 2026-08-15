import { Prisma, Product } from "@prisma/client";
import { z } from "zod";
import { productQuerySchema } from "../schemas/product.schemas.js";

export type ProductQuery = z.infer<typeof productQuerySchema>;

export type ProductInput = Pick<
  Product,
  "name" | "description" | "price" | "images"
> & {
  tags: string[];
};

export type ProductWithTags = Prisma.ProductGetPayload<{
  include: { tags: true };
}>;
