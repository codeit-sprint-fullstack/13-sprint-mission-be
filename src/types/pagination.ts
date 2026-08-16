// 오프셋(page) 기반 목록 응답과 커서 기반 목록 응답에 공통으로 쓰는 제네릭 타입.
export interface PaginatedResult<T> {
  list: T[];
  totalCount: number;
}

export interface CursorPaginatedResult<T> {
  list: T[];
  nextCursor: number | null;
}
