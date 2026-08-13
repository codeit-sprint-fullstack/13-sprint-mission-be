import multer from 'multer';
import superstruct from 'superstruct';

import { HttpException } from '../../exceptions/HttpException.js';

export function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);

    if (error instanceof HttpException) {
        return res.status(error.status).send({ name: error.name, message: error.message });
    }

    if (error instanceof superstruct.StructError || error instanceof multer.MulterError) {
        return res.status(400).send({
            name: 'Validation Failed',
            message: error.message,
        });
    }

    console.error(error);
    return res.status(500).send({
        name: 'Internal Server Error',
        message: '예기치 못한 오류가 발생했습니다.',
    });
}
