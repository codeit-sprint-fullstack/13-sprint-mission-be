import type { Like as LikeEntity } from '@prisma/client';

export class Like {
    /** ID */
    private readonly _id: number;

    /** 사용자 ID */
    private readonly _userId: number;

    /** 상품 ID */
    private readonly _productId: number | null;

    /** 게시글 ID */
    private readonly _articleId: number | null;

    /** 생성시각 */
    private readonly _createdAt: Date;

    constructor(param: LikeEntity) {
        this._id = param.id;
        this._userId = param.userId;
        this._productId = param.productId;
        this._articleId = param.articleId;
        this._createdAt = param.createdAt;
    }

    getId() {
        return this._id;
    }

    getUserId() {
        return this._userId;
    }

    getProductId() {
        return this._productId;
    }

    getArticleId() {
        return this._articleId;
    }

    getCreatedAt() {
        return this._createdAt;
    }
}
