import type { User as UserEntity } from '@prisma/client';

export class User {
    /** ID */
    private readonly _id: number;

    /** 이메일 */
    private readonly _email: string;

    /** 비밀번호 */
    private readonly _encryptedPassword: string;

    /** 닉네임 */
    private readonly _nickname: string;

    /** 이미지 */
    private _image: string | null;

    /** 생성시각 */
    private readonly _createdAt: Date;

    /** 마지막 수정시각 */
    private readonly _updatedAt: Date;

    constructor(param: UserEntity | null) {
        if (!param) throw new Error('User 엔티티가 필요합니다.');
        this._id = param.id;
        this._email = param.email;
        this._encryptedPassword = param.encryptedPassword;
        this._nickname = param.nickname;
        this._image = param.image;
        this._createdAt = param.createdAt;
        this._updatedAt = param.updatedAt;
    }

    getId() {
        return this._id;
    }

    getEmail() {
        return this._email;
    }

    getNickname() {
        return this._nickname;
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

    setImage(image: string | null) {
        this._image = image;
    }

}
