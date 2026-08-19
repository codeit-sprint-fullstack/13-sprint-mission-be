import type { Like as LikeEntity, Product as ProductEntity } from '@prisma/client';

type ProductParams = ProductEntity & {
    likes?: Pick<LikeEntity, 'userId'>[];
};

export class Product {
    /** ID */
    private readonly _id: number;

    /** 작성자 ID */
    private readonly _ownerId: number;

    /** 상품명  */
    private readonly _name: string;

    /** 상품 설명 */
    private readonly _description: string;

    /** 판매 가격 */
    private readonly _price: number;

    /** 해시 태그 목록 */
    private readonly _tags: string[];

    /** 이미지 목록 */
    private readonly _images: string[];

    /** 생성시각 */
    private readonly _createdAt: Date;

    /** 마지막 수정시각 */
    private readonly _updatedAt: Date;

    /** 좋아요 목록 */
    private readonly _likes: Pick<LikeEntity, 'userId'>[];

    constructor(param: ProductParams) {
        this._id = param.id;
        this._ownerId = param.ownerId;
        this._name = param.name;
        this._description = param.description;
        this._price = param.price;
        this._tags = Array.from(param.tags); // 깊은 복사를 통해, 외부의 배열을 통해 내부 배열을 변경할 수 없도록 합니다.
        this._images = Array.from(param.images);
        this._createdAt = param.createdAt;
        this._updatedAt = param.updatedAt;
        this._likes = param.likes ?? [];
    }

    getId() {
        return this._id;
    }

    getOwnerId() {
        return this._ownerId;
    }

    getName() {
        return this._name;
    }

    getDescription() {
        return this._description;
    }

    getPrice() {
        return this._price;
    }

    getTags() {
        return Array.from(this._tags); // 깊은 복사를 통해, 반환된 배열을 통해 내부 배열을 변경할 수 없도록 합니다.
    }

    getImages() {
        return Array.from(this._images);
    }

    getCreatedAt() {
        return this._createdAt;
    }

    getUpdatedAt() {
        return this._updatedAt;
    }

    getIsFavorite(userId: number) {
        if (!userId) return false;

        return this._likes.some((like) => like.userId === userId);
    }

    getFavoriteCount() {
        return this._likes.length;
    }
}
