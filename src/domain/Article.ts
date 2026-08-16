import type { Article as ArticleEntity, Like as LikeEntity } from '@prisma/client';

type ArticleParams = ArticleEntity & {
    likes?: Pick<LikeEntity, 'userId'>[];
};

export class Article {
    /** ID */
    private readonly _id: number;

    /** 작성자 ID */
    private readonly _writerId: number;

    /** 제목 */
    private readonly _title: string;

    /** 내용 */
    private readonly _content: string;

    /** 이미지 */
    private readonly _image: string | null;

    /** 작성시각 */
    private readonly _createdAt: Date;

    /** 마지막 수정시각 */
    private readonly _updatedAt: Date;

    /** 좋아요 목록 */
    private readonly _likes: Pick<LikeEntity, 'userId'>[];

    constructor(param: ArticleParams) {
        this._id = param.id;
        this._writerId = param.writerId;
        this._title = param.title;
        this._content = param.content;
        this._image = param.image;
        this._createdAt = param.createdAt;
        this._updatedAt = param.updatedAt;
        this._likes = param.likes ?? [];
    }

    getId() {
        return this._id;
    }

    getWriterId() {
        return this._writerId;
    }

    getTitle() {
        return this._title;
    }

    getContent() {
        return this._content;
    }

    getImage() {
        return this._image;
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
