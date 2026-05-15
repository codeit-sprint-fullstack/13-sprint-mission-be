
# 📦 Sprint Mission - Prisma + PostgreSQL API

## 📌 프로젝트 소개

중고마켓(Product)과 자유게시판(Article), 댓글 기능을 Prisma + PostgreSQL로 구현한 REST API 서버입니다.

---

## 🛠 기술 스택

- Node.js
- Express
- Prisma ORM
- PostgreSQL

---

## 📁 주요 기능

### 📦 Product

- 상품 등록 / 조회 / 수정 / 삭제
- 검색 / 정렬 / 페이지네이션

### 📝 Article

- 게시글 등록 / 조회 / 수정 / 삭제
- 검색 / 정렬 / 페이지네이션

### 💬 Comment

- Article 댓글 CRUD
- Product 댓글 CRUD
- 페이지네이션 지원

---

## 🗄 데이터 구조

- Product ↔ ProductComment (1:N)
- Article ↔ ArticleComment (1:N)
- Cascade Delete 적용
---
## 🌱 Seed 데이터

- Product 50개
- Article 50개
- 랜덤 Comment 생성 (관계 기반)

---

## 🚀 실행 방법

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## 🔥 핵심 기능

- Pagination (offset 방식)
- Search (title / content / name)
- Sort (latest / oldest)
