import { prismaClient } from '../../infra/prismaClient.js';

import { NotFoundException } from '../../exceptions/NotFoundException.js';
import { ExceptionMessage } from '../../constant/ExceptionMessage.js';

import { Product } from '../../domain/Product.js';
import type { ProductIdRequest, Requester } from '../../types/application.js';

export class GetProductHandler {
    static async handle(requester: Requester, { productId }: ProductIdRequest) {
        const productEntity = await prismaClient.product.findUnique({
            where: {
                id: Number(productId),
            },
            include: {
                likes: {
                    select: {
                        // 좋아요의 id, userId만 필요함
                        id: true,
                        userId: true,
                    },
                },
                comments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        writer: {
                            select: { id: true, nickname: true, image: true },
                        },
                    },
                },
            },
        });

        if (!productEntity) {
            throw new NotFoundException('Not Found', ExceptionMessage.PRODUCT_NOT_FOUND);
        }

        const product = new Product(productEntity);

        return {
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
            comments: productEntity.comments.map((comment) => ({
                id: comment.id,
                writer: comment.writer,
                productId: comment.productId,
                content: comment.content,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            })),
        };
    }
}
