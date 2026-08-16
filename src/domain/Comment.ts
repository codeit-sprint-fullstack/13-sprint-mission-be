import type { Comment as CommentEntity } from '@prisma/client';

export class Comment {
    /** ID */
    private readonly _id: number;

    /** 작성자 ID */
    private readonly _writerId: number;

    /** 게시글 ID */
    private readonly _articleId: number | null;

    /** 상품 ID */
    private readonly _productId: number | null;

    /** 내용 */
    private readonly _content: string;

    /** 작성시각 */
    private readonly _createdAt: Date;

    /** 마지막 수정시각 */
    private readonly _updatedAt: Date;

    constructor(param: CommentEntity) {
        this._id = param.id;
        this._writerId = param.writerId;
        this._articleId = param.articleId;
        this._productId = param.productId;
        this._content = param.content;
        this._createdAt = param.createdAt;
        this._updatedAt = param.updatedAt;
    }

    getId() {
        return this._id;
    }

    getWriterId() {
        return this._writerId;
    }

    getArticleId() {
        return this._articleId;
    }

    getProductId() {
        return this._productId;
    }

    getContent() {
        return this._content;
    }

    getCreatedAt() {
        return this._createdAt;
    }

    getUpdatedAt() {
        return this._updatedAt;
    }
}
