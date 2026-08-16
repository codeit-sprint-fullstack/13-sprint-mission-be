import { prismaClient } from '../../infra/prismaClient.js';

import { Product } from '../../domain/Product.js';
import type { Prisma } from '@prisma/client';
import type { Requester, SortedPageRequest } from '../../types/application.js';

export class GetProductListHandler {
    static async handle(requester: Requester, { page, pageSize, orderBy, keyword }: SortedPageRequest) {
        const whereClause: Prisma.ProductWhereInput | undefined = keyword
            ? {
                OR: [
                    {
                        name: {
                            contains: keyword,
                        },
                    },
                    {
                        description: {
                            contains: keyword,
                        },
                    },
                ],
            }
            : undefined;

        const matchedProductCount = await prismaClient.product.count({
            where: whereClause,
        });

        const orderByOption: Prisma.ProductOrderByWithRelationInput = (() => {
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

        const productEntities = await prismaClient.product.findMany({
            skip: pageSize * (page - 1),
            take: pageSize,
            where: whereClause,
            orderBy: orderByOption,
            include: {
                _count: {
                    select: { likes: true }, // 각 Product의 전체 Like 개수
                },
                likes: {
                    select: {
                        // 좋아요의 id, userId만 필요함
                        id: true,
                        userId: true,
                    },
                },
            },
        });

        const products = productEntities.map(
            (productEntity) => new Product(productEntity)
        );

        return {
            totalCount: matchedProductCount,
            list: products.map((product) => ({
                id: product.getId(),
                ownerId: product.getOwnerId(),
                name: product.getName(),
                description: product.getDescription(),
                price: product.getPrice(),
                tags: product.getTags(),
                images: product.getImages(),
                createdAt: product.getCreatedAt(),
                favoriteCount: product.getFavoriteCount(),
                isLiked: product.getIsFavorite(requester.userId),
            })),
        };
    }
}
