import assert from 'node:assert/strict';
import test from 'node:test';
import {
  serializeProductCommentResponse,
  serializeProductResponse,
} from '../utils/productResponses.js';

test('상품의 내부 userId를 ownerId로 노출한다', () => {
  const result = serializeProductResponse({
    id: 1,
    name: '자전거',
    userId: 7,
  });

  assert.deepEqual(result, { id: 1, name: '자전거', ownerId: 7 });
  assert.equal('userId' in result, false);
});

test('상품 댓글의 user를 writer로 노출한다', () => {
  const result = serializeProductCommentResponse({
    id: 3,
    content: '구매 가능한가요?',
    userId: 7,
    user: { id: 7, nickname: '판다' },
  });

  assert.deepEqual(result, {
    id: 3,
    content: '구매 가능한가요?',
    writer: { id: 7, nickname: '판다' },
  });
  assert.equal('userId' in result, false);
  assert.equal('user' in result, false);
});
