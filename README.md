# API 명세서

---

## 상품 (Product)

### 1. 상품 목록 조회

```
GET /product
```

**Query Parameter**

| 파라미터   | 타입   | 필수 | 기본값   | 설명                           |
| ---------- | ------ | ---- | -------- | ------------------------------ |
| `keyword`  | string | ➖   | `""`     | 검색어 (상품명, 설명 기준)     |
| `page`     | number | ➖   | `1`      | 페이지 번호                    |
| `pageSize` | number | ➖   | `10`     | 페이지 당 항목 수              |
| `orderBy`  | string | ➖   | `recent` | 정렬 방식 (`recent`, `oldest`) |

**응답:** `200 OK` — 상품 배열 및 전체 개수 반환

---

### 2. 상품 상세 조회

```
GET /product/{id}
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명           |
| -------- | ------ | ---- | -------------- |
| `id`     | string | ✅   | 조회할 상품 ID |

**응답:** `200 OK` — 상품 객체 반환

---

### 3. 상품 등록

```
POST /product
Content-Type: application/json
```

**Request Body**

| 필드          | 타입     | 필수 | 설명                        |
| ------------- | -------- | ---- | --------------------------- |
| `name`        | string   | ✅   | 상품명                      |
| `price`       | number   | ✅   | 가격 (원)                   |
| `description` | string   | ✅   | 상품 설명                   |
| `tags`        | string[] | ➖   | 태그 목록 (예: `["#tag1"]`) |

**요청 예시**

```json
{
  "name": "축구공",
  "price": 30000,
  "description": "이것만 사면 나도 축구왕?",
  "tags": ["#4팀", "#화이팅"]
}
```

**응답:** `201 Created` — 생성된 상품 객체 반환

---

### 4. 상품 수정

```
PATCH /product/{id}
Content-Type: application/json
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명           |
| -------- | ------ | ---- | -------------- |
| `id`     | string | ✅   | 수정할 상품 ID |

**Request Body**

| 필드          | 타입     | 필수 | 설명      |
| ------------- | -------- | ---- | --------- |
| `name`        | string   | ➖   | 상품명    |
| `price`       | number   | ➖   | 가격 (원) |
| `description` | string   | ➖   | 상품 설명 |
| `tags`        | string[] | ➖   | 태그 목록 |

**응답:** `200 OK` — 수정된 상품 객체 반환

---

### 5. 상품 삭제

```
DELETE /product/{id}
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명           |
| -------- | ------ | ---- | -------------- |
| `id`     | string | ✅   | 삭제할 상품 ID |

**응답:** `204 No Content`

---

## 자유게시판 (Article)

### 1. 게시글 목록 조회

```
GET /articles
```

**Query Parameter**

| 파라미터   | 타입   | 필수 | 기본값   | 설명                           |
| ---------- | ------ | ---- | -------- | ------------------------------ |
| `keyword`  | string | ➖   | `""`     | 검색어 (제목, 내용 기준)       |
| `page`     | number | ➖   | `1`      | 페이지 번호                    |
| `pageSize` | number | ➖   | `10`     | 페이지 당 항목 수              |
| `orderBy`  | string | ➖   | `recent` | 정렬 방식 (`recent`, `oldest`) |

**응답:** `200 OK` — `id`, `title`, `content`, `createdAt` 배열 및 전체 개수 반환

---

### 2. 게시글 상세 조회

```
GET /articles/{id}
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명             |
| -------- | ------ | ---- | ---------------- |
| `id`     | string | ✅   | 조회할 게시글 ID |

**응답:** `200 OK` — `id`, `title`, `content`, `createdAt` 반환

---

### 3. 게시글 등록

```
POST /articles
Content-Type: application/json
```

**Request Body**

| 필드      | 타입   | 필수 | 설명        |
| --------- | ------ | ---- | ----------- |
| `title`   | string | ✅   | 게시글 제목 |
| `content` | string | ✅   | 게시글 내용 |

**요청 예시**

```json
{
  "title": "안녕하세요",
  "content": "이것은 내용입니다."
}
```

**응답:** `201 Created` — 생성된 게시글 객체 반환

---

### 4. 게시글 수정

```
PATCH /articles/{id}
Content-Type: application/json
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명             |
| -------- | ------ | ---- | ---------------- |
| `id`     | string | ✅   | 수정할 게시글 ID |

**Request Body**

| 필드      | 타입   | 필수 | 설명        |
| --------- | ------ | ---- | ----------- |
| `title`   | string | ➖   | 게시글 제목 |
| `content` | string | ➖   | 게시글 내용 |

**응답:** `200 OK` — 수정된 게시글 객체 반환

---

### 5. 게시글 삭제

```
DELETE /articles/{id}
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명             |
| -------- | ------ | ---- | ---------------- |
| `id`     | string | ✅   | 삭제할 게시글 ID |

**응답:** `204 No Content`

---

## 자유게시판 댓글 (Article Comment)

### 1. 댓글 목록 조회

```
GET /articles/{articleId}/comments
```

**Path Parameter**

| 파라미터    | 타입   | 필수 | 설명      |
| ----------- | ------ | ---- | --------- |
| `articleId` | string | ✅   | 게시글 ID |

**Query Parameter**

| 파라미터   | 타입   | 필수 | 기본값 | 설명                          |
| ---------- | ------ | ---- | ------ | ----------------------------- |
| `cursor`   | string | ➖   | -      | 커서 ID (cursor 페이지네이션) |
| `pageSize` | number | ➖   | `10`   | 페이지 당 항목 수             |

**응답:** `200 OK` — `id`, `content`, `createdAt` 배열 및 `nextCursor` 반환

---

### 2. 댓글 등록

```
POST /articles/{articleId}/comments
Content-Type: application/json
```

**Path Parameter**

| 파라미터    | 타입   | 필수 | 설명      |
| ----------- | ------ | ---- | --------- |
| `articleId` | string | ✅   | 게시글 ID |

**Request Body**

| 필드      | 타입   | 필수 | 설명      |
| --------- | ------ | ---- | --------- |
| `content` | string | ✅   | 댓글 내용 |

**요청 예시**

```json
{
  "content": "이것은 댓글입니다."
}
```

**응답:** `201 Created` — 생성된 댓글 객체 반환

---

### 3. 댓글 수정

```
PATCH /articles/comments/{id}
Content-Type: application/json
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명           |
| -------- | ------ | ---- | -------------- |
| `id`     | string | ✅   | 수정할 댓글 ID |

**Request Body**

| 필드      | 타입   | 필수 | 설명      |
| --------- | ------ | ---- | --------- |
| `content` | string | ➖   | 댓글 내용 |

**응답:** `200 OK` — 수정된 댓글 객체 반환

---

### 4. 댓글 삭제

```
DELETE /articles/comments/{id}
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명           |
| -------- | ------ | ---- | -------------- |
| `id`     | string | ✅   | 삭제할 댓글 ID |

**응답:** `204 No Content`
