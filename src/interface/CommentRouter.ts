import express from 'express';
import { create } from 'superstruct';

import { asyncErrorHandler } from './utils/asyncErrorHandler.js';
import { AuthN } from './utils/AuthN.js';

import { UpdateCommentRequestStruct } from './structs/comment/UpdateCommentRequestStruct.js';

import { UpdateCommentHandler } from '../application/comment/UpdateCommentHandler.js';
import { DeleteCommentHandler } from '../application/comment/DeleteCommentHandler.js';

export const CommentRouter = express.Router();
const commentRoute = CommentRouter.route('/:commentId');

// 댓글 수정 api
commentRoute.patch(
    AuthN(),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;

        const { commentId } = req.params;
        const { content } = create(req.body, UpdateCommentRequestStruct);

        const commentView = await UpdateCommentHandler.handle(requester, {
            commentId: Number(commentId),
            content,
        });

        return res.send(commentView);
    }),
);

// 댓글 삭제 api
commentRoute.delete(
    AuthN(),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;

        const { commentId } = req.params;

        await DeleteCommentHandler.handle(requester, {
            commentId: Number(commentId),
        });

        return res.status(204).send();
    }),
);
