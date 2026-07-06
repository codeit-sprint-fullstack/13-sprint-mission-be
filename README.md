# 판다마켓 API

중고 물품을 사고팔 수 있는 중고마켓과 자유롭게 글을 쓸 수 있는 자유게시판 기능을 제공하는 백엔드 API 서버입니다.

## 기술 스택

- **Runtime**: Node.js (ESM)
- **Framework**: Express 5
- **Database**: PostgreSQL + Prisma ORM
- **인증**: JWT (accessToken / refreshToken), express-jwt
- **유효성 검사**: Zod
- **파일 업로드**: Multer
- **API 문서**: Swagger (swagger-jsdoc + swagger-ui-express)
- **테스트 데이터**: @faker-js/faker

## 파일 구조

```
13-sprint-mission-be/
├── prisma/
│   ├── schema.prisma          # DB 스키마 정의
│   ├── seed.js                # 더미 데이터 시딩 스크립트
│   └── migrations/            # 마이그레이션 히스토리
├── src/
│   ├── app.js                 # 미들웨어/라우터 등록
│   ├── config/
│   │   ├── prisma.js          # PrismaClient 싱글톤
│   │   └── swagger.js         # Swagger(OpenAPI) 설정
│   ├── routes/                # 라우트 정의 (+ Swagger @openapi 주석)
│   │   ├── auth.router.js         # 회원가입 / 로그인 / 토큰 갱신
│   │   ├── user.router.js         # 내 프로필 조회
│   │   ├── product.router.js      # 상품 CRUD, 좋아요, 댓글
│   │   ├── article.router.js      # 게시글 CRUD, 좋아요, 댓글
│   │   └── image.router.js        # 이미지 업로드
│   ├── controllers/           # 요청/응답 처리 (req → service → res)
│   ├── services/              # 비즈니스 로직 (권한 검증, 데이터 가공)
│   ├── repositories/          # Prisma 쿼리 (DB 접근 계층)
│   ├── schemas/               # Zod 유효성 검사 스키마
│   ├── middlewares/
│   │   ├── auth.js                # accessToken/refreshToken 검증
│   │   ├── validate.js            # Zod 스키마 기반 요청 검증 미들웨어
│   │   ├── errors.js              # AppError 커스텀 에러 클래스
│   │   └── errorHandler.js        # 전역 에러 핸들러
│   ├── utils/
│   │   └── parse.js           # 문자열 id → 정수 변환 유틸
│   └── http/                  # REST Client용 수동 테스트 요청 모음
├── uploads/                   # 업로드된 이미지 저장 위치 (gitignore)
├── .env.example                # 환경 변수 예시
└── package.json
```

### 계층 구조 (Layered Architecture)

```
Route → Middleware(auth, validate) → Controller → Service → Repository → Prisma → DB
```

- **Controller**: `req`/`res`만 다룹니다. 인증된 유저 id 추출(`parseId(req.user.userId)`), 응답 형태 결정.
- **Service**: 도메인 로직(소유자 검증, 좋아요 토글 여부 계산 등)을 담당하며 순수 값(정수 id 등)만 주고받습니다.
- **Repository**: Prisma 쿼리만 담당합니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 참고해 `.env` 파일을 만듭니다.

```bash
cp .env.example .env
```

| 변수 | 설명 |
| --- | --- |
| `PORT` | 서버 포트 (기본 3000) |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `SESSION_SECRET` | 세션 암호화 키 |
| `JWT_SECRET` | JWT 서명 키 |
| `CLIENT_URL` | CORS 허용 클라이언트 주소 |

### 3. 데이터베이스 마이그레이션 & 시딩

```bash
npm run migrate   # 마이그레이션 적용
npm run seed      # 더미 데이터 생성
```

### 4. 서버 실행

```bash
npm run dev    # nodemon (개발용)
npm start      # node (운영용)
```

서버가 뜨면 아래 주소로 확인할 수 있습니다.

- API 문서 (Swagger UI): `http://localhost:3000/api-docs`
- 헬스 체크: `http://localhost:3000/health`

## 주요 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | nodemon으로 개발 서버 실행 |
| `npm start` | 서버 실행 |
| `npm run migrate` | Prisma 마이그레이션 적용 |
| `npm run reset` | DB 초기화 후 마이그레이션 + 시드 재적용 |
| `npm run seed` | 더미 데이터 시딩 |
| `npm run studio` | Prisma Studio 실행 (DB GUI) |

## 주요 기능

- **인증**: 회원가입 / 로그인 / accessToken·refreshToken 발급 및 갱신
- **상품(중고마켓)**: 등록/조회/수정/삭제, 태그, 검색·정렬(최신순/좋아요순), 좋아요 추가·취소
- **게시글(자유게시판)**: 등록/조회/수정/삭제, 좋아요 추가·취소
- **댓글**: 상품/게시글 댓글 등록/조회/수정/삭제 (작성자만 수정·삭제 가능)
- **이미지 업로드**: 상품/게시글 이미지 업로드 (jpeg/png/gif, 최대 10MB)

모든 엔드포인트의 상세 요청/응답 형식은 Swagger 문서(`/api-docs`)에서 확인할 수 있습니다.

<br>

---

본 프로젝트는 [코드잇](https://www.codeit.kr)의 소유이며, 교육 목적으로만 사용됩니다. © 2026 Codeit. All rights reserved.
