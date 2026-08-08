import { HttpError } from "./error";
import type { RequestHandler } from "express";

function requreString(value: unknown, field: string, label?: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${label || field}을(를) 입력해주세요.`);
  }
  return value.trim();
}

const validateProduct: RequestHandler = (req, res, next) => {
  try {
    const name = requireString(req.body.name, "name", "상품명");
    const description = requireString(
      req.body.description,
      "description",
      "상품 소개",
    );
    const price = Number(req.body.price);
    if (name.length > 10)
      throw new HttpError(400, "상품명은 10자 이내로 입력해주세요.");
    if (description.length < 10)
      throw new HttpError(400, "상품 소개는 10자 이상 입력해주세요.");
    if (!Number.isInteger(price) || price < 0)
      throw new HttpError(400, "판매 가격은 숫자로 입력해주세요.");
    if (
      Array.isArray(req.body.tags) &&
      req.body.tags.some((tag: unknown) => String(tag).length > 5)
    ) {
      throw new HttpError(400, "태그는 5글자 이내로 입력해주세요.");
    }
    req.body.name = name;
    req.body.description = description;
    req.body.price = price;
    next();
  } catch (error) {
    next(error);
  }
};

const validateArticle: RequestHandler = (req, res, next) => {
  try {
    req.body.title = requireString(req.body.title, "title", "제목");
    req.body.content = requireString(req.body.content, "content", "내용");
    next();
  } catch (error) {
    next(error);
  }
};

const validateComment: RequestHandler = (req, res, next) => {
  try {
    req.body.content = requireString(req.body.content, "content", "댓글");
    next();
  } catch (error) {
    next(error);
  }
};

export { validateArticle, validateComment, validateProduct };
