import { prismaClient } from '../../infra/prismaClient.js';

import { Article } from '../../domain/Article.js';
import type { Prisma } from '@prisma/client';
import type { Requester, SortedPageRequest } from '../../types/application.js';

export class GetArticleListHandler {
    static async handle(requester: Requester, { page, pageSize, orderBy, keyword }: SortedPageRequest) {
        const orderByOption: Prisma.ArticleOrderByWithRelationInput = (() => {
            switch (orderBy) {
                case 'favorite':
                    return {
                        likes: {
                            _count: 'desc', // 좋아요 많은 순으로 정렬
                        },
                    };
                case 'recent':
                default:
                    return { createdAt: 'desc' };
            }
        })();

        const where: Prisma.ArticleWhereInput | undefined = keyword
            ? {
                OR: [
                    { title: { contains: keyword, mode: 'insensitive' } },
                    { content: { contains: keyword, mode: 'insensitive' } },
                ],
            }
            : undefined;

        const [totalCount, articleEntities] = await prismaClient.$transaction([
            prismaClient.article.count({ where }),
            prismaClient.article.findMany({
                skip: pageSize * (page - 1),
                take: pageSize,
                orderBy: orderByOption,
                where,
                include: {
                    writer: {
                        select: { id: true, nickname: true, image: true },
                    },
                    likes: {
                        select: { userId: true },
                    },
                },
            }),
        ]);

        const articles = articleEntities.map(
            (articleEntity) => new Article(articleEntity)
        );

        return {
            totalCount,
            list: articles.map((article, index) => {
                const writer = articleEntities.at(index)?.writer;
                if (!writer) throw new Error('게시글 작성자 정보를 찾을 수 없습니다.');

                return {
                    id: article.getId(),
                    writer: {
                        id: writer.id,
                        nickname: writer.nickname,
                        image: writer.image,
                    },
                    title: article.getTitle(),
                    content: article.getContent(),
                    image: article.getImage(),
                    createdAt: article.getCreatedAt(),
                    favoriteCount: article.getFavoriteCount(),
                    isLiked: article.getIsFavorite(requester.userId),
                };
            }),
        };
    }
}
