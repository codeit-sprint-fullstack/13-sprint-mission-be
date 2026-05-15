# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Panda Market 백엔드 API 서버. Express + Prisma + PostgreSQL(Neon) 구성의 단일 파일 서버.

## 명령어

```bash
npm run dev        # nodemon으로 개발 서버 실행 (자동 재시작)
npm start          # 프로덕션 서버 실행
npm run seed       # 상품 시드 데이터 10개 삽입 (기존 데이터 전체 삭제 후 삽입)

npx prisma migrate dev --name <이름>   # 스키마 변경 후 마이그레이션
npx prisma validate                    # 스키마 유효성 검사
npx prisma studio                      # DB GUI
```

## 아키텍처

### 파일 구조

- **`app.js`** — 모든 라우트와 비즈니스 로직이 한 파일에 집중
- **`prisma/schema.prisma`** — 데이터 모델 정의
- **`prisma.config.ts`** — Prisma 설정 (DATABASE_URL을 `.env`에서 주입)
- **`generated/prisma/`** — `npx prisma generate` 결과물 (gitignore, 커밋 X)
- **`seed.js`** — 상품 초기 데이터

### DB 모델 관계

```
Product  1──* ProductComment
Article  1──* ArticleComment
```

댓글 삭제는 부모 삭제 시 `onDelete: Cascade` 자동 처리.

### 라우트 패턴

상품 API는 `/products`와 `/items` 두 경로를 동시에 처리 (배열 라우트).  
게시글 API는 `/articles` 단일 경로.

**목록 조회** 공통 파라미터: `page`, `limit`(최대 50), `offset`(직접 지정 시 page 무시), `keyword`  
**에러 처리**: Prisma `P2025` 코드 = 레코드 없음 → 404 반환

### Prisma 클라이언트

`PrismaClient`는 `./generated/prisma/index.js`에서 임포트.  
`prisma.config.ts`가 `DATABASE_URL` 환경변수를 `datasource.url`로 전달.

## 환경변수

`.env` 파일 필요:
```
DATABASE_URL="postgresql://..."
```

## ES Module

`package.json`에 `"type": "module"` 설정. 모든 import는 `.js` 확장자 포함 필수.
