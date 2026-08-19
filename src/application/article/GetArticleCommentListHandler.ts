import { prismaClient } from '../../infra/prismaClient.js';

import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

import { Comment } from '../../domain/Comment.js';
import { User } from '../../domain/User.js';
import type { ArticleCommentListRequest } from '../../types/application.js';

export class GetArticleCommentListHandler {
    static async handle({ articleId, cursor, limit }: ArticleCommentListRequest) {
        const commentEntities = await prismaClient.$transaction(async (tx) => {
            const targetArticleEntity = await tx.article.findUnique({
                where: {
                    id: articleId,
                },
            });

            if (!targetArticleEntity) {
                throw new NotFoundException('Not Found', ExceptionMessage.ARTICLE_NOT_FOUND);
            }

            return await tx.comment.findMany({
                cursor: cursor
                    ? {
                          id: cursor,
                      }
                    : undefined,
                skip: cursor ? 1 : 0,
                take: limit + 1,
                where: {
                    articleId: articleId,
                },
                orderBy: { createdAt: 'desc' },
            });
        });

        const comments = commentEntities.map((commentEntity) => new Comment(commentEntity));

        const writerEntities = await prismaClient.user.findMany({
            where: {
                id: {
                    in: Array.from(new Set(comments.map((comment) => comment.getWriterId()))),
                },
            },
        });

        const writers = writerEntities.map((writerEntity) => new User(writerEntity));

        const hasNext = comments.length === limit + 1;

        return {
            list: comments.slice(0, limit).map((comment) => {
                const writer = writers.find((writer) => writer.getId() === comment.getWriterId());
                if (!writer) {
                    throw new NotFoundException('Not Found', ExceptionMessage.USER_NOT_FOUND);
                }

                return {
                    id: comment.getId(),
                    writer: {
                        id: writer.getId(),
                        nickname: writer.getNickname(),
                        image: writer.getImage(),
                    },
                    articleId: comment.getArticleId(),
                    content: comment.getContent(),
                    createdAt: comment.getCreatedAt(),
                };
            }),
            hasNext,
            nextCursor: hasNext ? comments.at(limit - 1)?.getId() ?? null : null,
        };
    }
}
