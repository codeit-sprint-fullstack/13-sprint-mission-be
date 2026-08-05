import type { Request } from 'express';

/** 인증 미들웨어가 요청에 채워 넣는 사용자 정보 */
export interface AuthenticatedUser {
  id: number;
}

/**
 * 인증 헬퍼가 받는 최소 요청 타입.
 * Request 제네릭(파라미터·바디·쿼리) 조합이 라우트마다 달라도 그대로 받을 수 있도록
 * 실제로 쓰는 headers만 뽑아 user 확장과 교차(intersection)시킨다.
 */
export type AuthenticatedRequest = Pick<Request, 'headers'> & { user?: AuthenticatedUser };

/** 모든 에러 응답의 공통 형태 */
export interface ErrorResponse {
  message: string;
}

/** page/offset 기반 목록 응답 */
export interface OffsetListResponse<TItem> {
  list: TItem[];
  totalCount: number;
  offset: number;
  limit: number;
  hasNext?: boolean;
}

/** cursor 기반 목록 응답 */
export interface CursorListResponse<TItem> {
  list: TItem[];
  nextCursor: number | null;
}

/** 경로 파라미터가 없는 라우트용 */
export type NoParams = Record<string, string>;

/** 경로 파라미터는 항상 문자열로 들어온다 */
export type IdParams = { id: string };
export type ArticleIdParams = { articleId: string };
export type ArticleCommentParams = { articleId: string; commentId: string };
export type ProductIdParams = { productId: string };
export type ProductCommentParams = { productId: string; commentId: string };

/** 쿼리스트링 값도 항상 문자열로 들어온다 */
export type CommentListQuery = {
  limit?: string;
  cursor?: string;
};
