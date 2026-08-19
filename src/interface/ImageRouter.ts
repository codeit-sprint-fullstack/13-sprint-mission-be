import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

import { asyncErrorHandler } from './utils/asyncErrorHandler.js';
import { AuthN } from './utils/AuthN.js';
import { BadRequestException } from '../exceptions/BadRequestException.js';

export const ImageRouter = express.Router();

const imageUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(path.resolve(), 'public/images/'));
        },
        filename: function (req, file, cb) {
            const extension = file.mimetype === 'image/png' ? '.png' : '.jpg';
            cb(null, `${crypto.randomUUID()}${extension}`);
        },
    }),

    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: function (req, file, cb) {
        if (['image/png', 'image/jpeg'].includes(file.mimetype) === false) {
            return cb(new BadRequestException('Validation Failed', 'PNG와 JPEG 이미지만 업로드할 수 있습니다.'));
        }

        cb(null, true);
    },
});

// 파일 업로드 API
ImageRouter.post(
    '/upload',
    AuthN(),
    imageUpload.single('image'),
    asyncErrorHandler(async (req, res) => {
        if (!req.file) {
            throw new BadRequestException('Validation Failed', '업로드할 이미지가 필요합니다.');
        }
        const filePath = `static/images/${req.file.filename}`;
        return res.send({
            url: `${process.env.BASE_URL}/${filePath}`,
        });
    }),
);
