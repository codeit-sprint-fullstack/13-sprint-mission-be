# [하성휘] Sprint Mission 6

React와 Express를 사용해서 만든 판다마켓 과제입니다.  
처음에는 MongoDB 기준으로 만들었고, 이번에는 PostgreSQL + Prisma 방식으로 수정했습니다.

## 사용 기술

### Frontend

- React
- Vite
- React Router DOM
- CSS

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma
- express-validator
- CORS

## 실행 방법

### server

```bash
cd server
npm install
```

`.env` 파일을 만들고 아래처럼 설정합니다.

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://postgres:비밀번호@localhost:5432/panda_market?schema=public"
```

Prisma 설정 후 서버를 실행합니다.

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

### client

```bash
cd client
npm install
```

`.env` 파일을 만들고 아래처럼 설정합니다.

```env
VITE_API_URL=http://localhost:3000
```

실행합니다.

```bash
npm run dev
```

## 구현 내용 체크

### 기본 요구사항

#### 중고마켓

- [x] mongoDB에서 PostgreSQL을 사용하도록 코드를 마이그레이션 했습니다.

#### 공통

- [x] PostgreSQL를 사용했습니다.
- [x] 데이터 모델 간의 관계를 고려하여 onDelete를 설정했습니다.
- [x] 데이터베이스 시딩 코드를 작성했습니다.
- [x] 각 API에 적절한 에러 처리를 했습니다.
- [x] 각 API 응답에 적절한 상태 코드를 리턴하도록 작성했습니다.

## 자유게시판

### Article 스키마

- [x] Article 스키마를 작성했습니다.
- [x] id, title, content, createdAt, updatedAt 필드를 작성했습니다.

### 게시글 API

- [x] 게시글 등록 API를 만들었습니다.
- [x] title, content를 입력해 게시글을 등록할 수 있습니다.
- [x] 게시글 조회 API를 만들었습니다.
- [x] id, title, content, createdAt를 조회할 수 있습니다.
- [x] 게시글 수정 API를 만들었습니다.
- [x] 게시글 삭제 API를 만들었습니다.
- [x] 게시글 목록 조회 API를 만들었습니다.
- [x] offset 방식의 페이지네이션 기능을 구현했습니다.
- [x] 최신순(recent) 정렬 기능을 구현했습니다.
- [x] title, content 검색 기능을 구현했습니다.

## 댓글

- [x] 댓글 등록 API를 만들었습니다.
- [x] content를 입력하여 댓글을 등록할 수 있습니다.
- [x] 중고마켓 댓글 등록 API를 따로 만들었습니다.
- [x] 자유게시판 댓글 등록 API를 따로 만들었습니다.
- [x] 댓글 수정 API를 만들었습니다.
- [x] PATCH 메서드를 사용했습니다.
- [x] 댓글 삭제 API를 만들었습니다.
- [x] 댓글 목록 조회 API를 만들었습니다.
- [x] id, content, createdAt 를 조회할 수 있습니다.
- [ ] cursor 방식의 페이지네이션 기능은 아직 구현 중입니다.
- [x] 중고마켓 댓글 목록 조회 API를 따로 만들었습니다.
- [x] 자유게시판 댓글 목록 조회 API를 따로 만들었습니다.

## API 목록

### 상품

```txt
GET    /products
POST   /products
GET    /products/:id
PATCH  /products/:id
DELETE /products/:id
```

### 게시글

```txt
GET    /articles
POST   /articles
GET    /articles/:id
PATCH  /articles/:id
DELETE /articles/:id
```

### 댓글

```txt
GET    /products/:productId/comments
POST   /products/:productId/comments

GET    /articles/:articleId/comments
POST   /articles/:articleId/comments

PATCH  /comments/products/:id
DELETE /comments/products/:id

PATCH  /comments/articles/:id
DELETE /comments/articles/:id
```

## 어려웠던 부분

- MongoDB 방식에서 PostgreSQL 방식으로 바꾸는 부분이 어려웠습니다.
- Prisma schema에서 관계를 설정하는 부분이 헷갈렸습니다.
- 댓글의 cursor 페이지네이션은 아직 완전히 이해하지 못해서 이번에는 구현하지 못했습니다.
- Git 브랜치와 PR 제출 과정도 익숙하지 않아서 시간이 좀 걸렸습니다.
