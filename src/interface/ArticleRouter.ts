import express from 'express';
import { create } from 'superstruct';
import { AuthN } from './utils/AuthN.js';

import { AuthTokenManager } from '../infra/AuthTokenManager.js';

import { asyncErrorHandler } from './utils/asyncErrorHandler.js';
import { validateBody } from './utils/validateRequest.js';
import { CreateArticleRequestStruct } from './structs/article/CreateArticleRequestStruct.js';
import { UpdateArticleRequestStruct } from './structs/article/UpdateArticleRequestStruct.js';
import { GetArticleListRequestStruct } from './structs/article/GetArticleListRequestStruct.js';
import { CreateCommentRequestStruct } from './structs/comment/CreateCommentRequestStruct.js';
import { GetCommentListRequestStruct } from './structs/comment/GetCommentListRequestStruct.js';

import { CreateArticleHandler } from '../application/article/CreateArticleHandler.js';
import { GetArticleHandler } from '../application/article/GetArticleHandler.js';
import { UpdateArticleHandler } from '../application/article/UpdateArticleHandler.js';
import { DeleteArticleHandler } from '../application/article/DeleteArticleHandler.js';
import { GetArticleListHandler } from '../application/article/GetArticleListHandler.js';
import { CreateArticleCommentHandler } from '../application/article/CreateArticleCommentHandler.js';
import { GetArticleCommentListHandler } from '../application/article/GetArticleCommentListHandler.js';
import { CreateArticleLikeHandler } from '../application/article/CreateArticleLikeHandler.js';
import { DeleteArticleLikeHandler } from '../application/article/DeleteArticleLikeHandler.js';

export const ArticleRouter = express.Router();
const articlesRoute = ArticleRouter.route('/');
const articleRoute = ArticleRouter.route('/:articleId');
const articleCommentsRoute = ArticleRouter.route('/:articleId/comments');
const articleLikeRoute = ArticleRouter.route('/:articleId/like');

// 게시글 등록 api
articlesRoute.post(
    AuthN(),
    validateBody(CreateArticleRequestStruct),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;
        const { title, content, image } = req.body;

        const articleView = await CreateArticleHandler.handle(requester, {
            title,
            content,
            image,
        });

        return res.status(201).send(articleView);
    }),
);

// 게시글 조회 api
articleRoute.get(
    asyncErrorHandler(async (req, res) => {
        const requester = AuthTokenManager.getRequesterFromTokenOrDefault(
            req.headers.authorization,
        );

        const articleId = Number(req.params.articleId);

        const articleView = await GetArticleHandler.handle(requester, {
            articleId,
        });

        return res.status(200).send(articleView);
    }),
);

// 게시글 수정 api
articleRoute.patch(
    AuthN(),
    validateBody(UpdateArticleRequestStruct),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;

        const { articleId } = req.params;
        const { title, content, image } = req.body;

        const articleView = await UpdateArticleHandler.handle(requester, {
            articleId: Number(articleId),
            title,
            content,
            image,
        });

        return res.status(200).send(articleView);
    }),
);

// 게시글 삭제 api
articleRoute.delete(
    AuthN(),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;

        const { articleId } = req.params;

        await DeleteArticleHandler.handle(requester, {
            articleId: Number(articleId),
        });

        return res.status(204).send();
    }),
);

// 게시글 목록 조회 api
articlesRoute.get(
    asyncErrorHandler(async (req, res) => {
        const requester = AuthTokenManager.getRequesterFromTokenOrDefault(
            req.headers.authorization,
        );

        const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListRequestStruct);

        const articleListView = await GetArticleListHandler.handle(requester, {
            page,
            pageSize,
            orderBy,
            keyword,
        });

        return res.send(articleListView);
    }),
);

// 게시글 댓글 등록 api
articleCommentsRoute.post(
    AuthN(),
    validateBody(CreateCommentRequestStruct),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;

        const { articleId } = req.params;
        const { content } = req.body;

        const articleCommentView = await CreateArticleCommentHandler.handle(requester, {
            articleId: Number(articleId),
            content,
        });

        return res.status(201).send(articleCommentView);
    }),
);

// 게시글 댓글 목록 조회 api
articleCommentsRoute.get(
    asyncErrorHandler(async (req, res) => {
        const { articleId } = req.params;
        const { cursor, limit } = create(req.query, GetCommentListRequestStruct);

        const articleCommentListView = await GetArticleCommentListHandler.handle({
            articleId: Number(articleId),
            cursor,
            limit,
        });

        return res.send(articleCommentListView);
    }),
);

// 게시글 좋아요 API
articleLikeRoute.post(
    AuthN(),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;

        const articleId = Number(req.params.articleId);

        const articleView = await CreateArticleLikeHandler.handle(requester, {
            articleId,
        });

        return res.status(201).send(articleView);
    }),
);

// 게시글 좋아요 취소 API
articleLikeRoute.delete(
    AuthN(),
    asyncErrorHandler(async (req, res) => {
        const requester = req.requester!;

        const articleId = Number(req.params.articleId);

        const articleView = await DeleteArticleLikeHandler.handle(requester, {
            articleId,
        });

        return res.status(201).send(articleView);
    }),
);
