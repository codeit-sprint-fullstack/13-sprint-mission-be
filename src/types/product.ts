import { Prisma, Product } from "@prisma/client";

export interface ProductQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  order?: string;
}

export type ProductInput = Pick<
  Product,
  "name" | "description" | "price" | "images"
> & {
  tags: string[];
};

export type ProductWithTags = Prisma.ProductGetPayload<{
  include: { tags: true };
}>;
