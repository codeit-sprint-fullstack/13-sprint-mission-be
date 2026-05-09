# 상품 API 서버 명세서

---

## 1. 상품 목록 조회

```
GET /product
```

**파라미터:** 없음

**응답:** `200 OK` — 전체 상품 배열 반환

---

## 2. 상품 검색

```
GET /product?keyword={keyword}
```

**Query Parameter**

| 파라미터  | 타입   | 필수 | 설명                 |
| --------- | ------ | ---- | -------------------- |
| `keyword` | string | ✅   | 검색어 (상품명 기준) |

**응답:** `200 OK` — 검색된 상품 배열 반환

---

## 3. 상품 등록

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
  "name": "김대영",
  "price": 1000000000,
  "description": "이것은 테스트 설명 입니다. 하하하하하하",
  "tags": ["#4팀", "#화이팅", "#김대영"]
}
```

**응답:** `201 Created` — 생성된 상품 객체 반환

---

## 4. 상품 수정

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

**요청 예시**

```json
{
  "name": "레노버 노트북",
  "price": 100000,
  "description": "PATCH 테스트",
  "tags": ["#4팀", "#화이팅", "#김대영"]
}
```

**응답:** `200 OK` — 수정된 상품 객체 반환

---

## 5. 상품 삭제

```
DELETE /product/{id}
```

**Path Parameter**

| 파라미터 | 타입   | 필수 | 설명           |
| -------- | ------ | ---- | -------------- |
| `id`     | string | ✅   | 삭제할 상품 ID |

**응답:** `200 OK` — 삭제 결과 메시지 반환

```

```
