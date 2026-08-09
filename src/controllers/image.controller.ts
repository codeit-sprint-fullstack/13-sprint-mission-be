import { Request, Response } from "express";
import { BadRequestError } from "../middlewares/errorHandler.js";

// 요구사항(상품 등록): "업로드된 이미지는 서버에 저장하고, 해당 이미지의 경로를
// response 객체에 포함해 반환합니다."
export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("이미지 파일이 없습니다.");
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, data: { url } });
};
