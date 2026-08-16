import test from 'node:test';
import assert from 'node:assert/strict';
import { create } from 'superstruct';
import { Article } from '../src/domain/Article.js';
import { GetArticleListRequestStruct } from '../src/interface/structs/article/GetArticleListRequestStruct.js';
import { AuthTokenManager } from '../src/infra/AuthTokenManager.js';
import { CreateProductRequestStruct } from '../src/interface/structs/product/CreateProductRequestStruct.js';
import { UserPasswordBuilder } from '../src/infra/UserPasswordBuilder.js';

test('Article은 likes가 없는 생성/수정 응답도 안전하게 처리한다', () => {
    const article = new Article({
        id: 1,
        writerId: 2,
        title: '통합 테스트',
        content: '게시글 내용',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    assert.equal(article.getFavoriteCount(), 0);
    assert.equal(article.getIsFavorite(2), false);
});

test('게시글 목록 쿼리는 페이지 기본값과 검색 조건을 변환한다', () => {
    const query = create({ keyword: '판다' }, GetArticleListRequestStruct);

    assert.deepEqual(query, {
        page: 1,
        pageSize: 10,
        orderBy: 'recent',
        keyword: '판다',
    });
});

test('게시글 페이지 크기는 20개를 초과할 수 없다', () => {
    assert.throws(() => create({ pageSize: '21' }, GetArticleListRequestStruct));
});

test('액세스 토큰과 리프레시 토큰은 각각의 시크릿으로 검증한다', () => {
    process.env.JWT_ACCESS_TOKEN_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_TOKEN_SECRET = 'test-refresh-secret';

    const accessToken = AuthTokenManager.buildAccessToken({ userId: 7 });
    const refreshToken = AuthTokenManager.buildRefreshToken({ userId: 7 });

    assert.equal(AuthTokenManager.getRequesterFromToken(`Bearer ${accessToken}`).userId, 7);
    assert.equal(AuthTokenManager.getRequesterFromRefreshToken(refreshToken).userId, 7);
    assert.throws(() => AuthTokenManager.getRequesterFromToken(`Bearer ${refreshToken}`));
});

test('상품 입력은 미션 요구사항의 길이와 이미지 개수 제한을 검증한다', () => {
    const validProduct = {
        name: '상품',
        description: '열 글자 이상인 상품 소개입니다.',
        price: 1000,
        tags: ['중고'],
        images: ['one.jpg', 'two.jpg', 'three.jpg'],
    };

    assert.deepEqual(create(validProduct, CreateProductRequestStruct), validProduct);
    assert.throws(() => create({ ...validProduct, name: '' }, CreateProductRequestStruct));
    assert.throws(() => create({ ...validProduct, name: '!@#$' }, CreateProductRequestStruct));
    assert.throws(() => create({ ...validProduct, description: '짧은 소개' }, CreateProductRequestStruct));
    assert.throws(() => create({ ...validProduct, tags: ['여섯글자태그'] }, CreateProductRequestStruct));
    assert.throws(() => create({ ...validProduct, images: ['1', '2', '3', '4'] }, CreateProductRequestStruct));
    assert.throws(() => create({ ...validProduct, price: 0 }, CreateProductRequestStruct));
    assert.throws(() => create({ ...validProduct, price: 2_147_483_648 }, CreateProductRequestStruct));
});

test('비밀번호는 bcrypt로 해싱하고 평문과 비교한다', () => {
    const hashedPassword = UserPasswordBuilder.hashPassword('password');

    assert.notEqual(hashedPassword, 'password');
    assert.equal(UserPasswordBuilder.comparePassword('password', hashedPassword), true);
    assert.equal(UserPasswordBuilder.comparePassword('wrong-password', hashedPassword), false);
});
