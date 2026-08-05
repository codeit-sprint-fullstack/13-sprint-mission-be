import type { Request, Response } from 'express';

export function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: '이미지 파일을 선택해 주세요.' });
  }

  res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
}
