import { prismaClient } from '../../infra/prismaClient.js';

import { Product } from '../../domain/Product.js';
import type { CreateProductRequest, Requester } from '../../types/application.js';

export class CreateProductHandler {
    static async handle(requester: Requester, { name, description, price, tags, images }: CreateProductRequest) {
        const productEntity = await prismaClient.product.create({
            data: {
                ownerId: requester.userId,
                name,
                description,
                price,
                tags,
                images,
            },
        });

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
        };
    }
}
