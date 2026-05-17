# 🛒 Product Market API

Express와 PostgreSQL(Prisma ORM)을 사용하여 구축한 중고마켓 및 자유게시판 플랫폼 API입니다.
라우터와 컨트롤러를 분리하여 유지보수가 용이한 구조로 설계되었으며, 게시글과 댓글 기능을 포함합니다.

<br>

# 📁 프로젝트 구조

```
.
├── server.js                          # 애플리케이션 진입점 및 미들웨어 설정
│
├── prisma/                            # Prisma ORM 설정
│   ├── schema.prisma                 # 데이터베이스 스키마 정의
│   ├── seed.js                       # 초기 데이터 삽입 스크립트
│   ├── migrations/                   # 데이터베이스 마이그레이션 파일
│
├── src/
│   ├── controllers/                   # 비즈니스 로직 처리
│   │   ├── product.controller.js      # 중고마켓 상품 관련 로직
│   │   ├── article.controller.js      # 자유게시판 게시글 관련 로직
│   │   ├── productComment.controller.js    # 중고마켓 댓글 관련 로직
│   │   └── articleComment.controller.js    # 자유게시판 댓글 관련 로직
│   │
│   ├── routes/                        # API 경로 정의 및 라우팅
│   │   ├── item.routes.js             # 중고마켓 관련 라우트
│   │   └── article.routes.js          # 자유게시판 관련 라우트
│   │
│   ├── schemas/                       # 요청 데이터 검증 스키마
│   │   ├── product.schema.js          # 상품 검증 스키마
│   │   ├── article.schema.js          # 게시글 검증 스키마
│   │   └── comment.schema.js          # 댓글 검증 스키마
│   │
│   ├── lib/                           # 유틸리티 라이브러리
│   │   └── prisma.js                 # Prisma 클라이언트 인스턴스
│   │
│   ├── utils/                         # 공용 유틸리티 함수
│   │   ├── asyncHandler.js            # 비동기 에러 핸들링
│   │   └── errors.js                  # 커스텀 에러 클래스
│   │
│   └── http/                          # API 테스트 파일 (REST Client)
│       ├── item.http                  # 중고마켓 API 테스트
│       └── article.http               # 자유게시판 API 테스트
│
└── README.md                          # 프로젝트 문서
```

<br>

# 🚀 시작하기

#### 1. 의존성 설치
```bash
npm install
```

#### 2. 환경 변수 설정
`.env` 파일을 생성하고 PostgreSQL 데이터베이스 연결 정보를 입력하세요.
```
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
NODE_ENV=development
PORT=3000
```

#### 3. 데이터베이스 마이그레이션
Prisma 마이그레이션을 실행하여 데이터베이스 스키마를 생성합니다.
```bash
npm run prisma:dev
```

#### 4. 초기 데이터 심기 (Seeding)
데이터베이스에 테스트용 초기 데이터를 삽입하려면 아래 명령어를 실행하세요.
```bash
npm run seed:dev
```

#### 5. 서버 실행

- 프로덕션 모드:
  ```bash
  npm run start
  ```
- 개발 모드 (Nodemon):
  ```bash
  npm run dev
  ```

<br>

# 🛣 API 엔드포인트

## 중고마켓 (Products)
| 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| **GET** | `/items` | 모든 상품 목록 조회 |
| **GET** | `/items/:id` | 특정 상품 상세 조회 |
| **POST** | `/items` | 새로운 상품 등록 |
| **PATCH** | `/items/:id` | 기존 상품 정보 수정 |
| **DELETE** | `/items/:id` | 특정 상품 삭제 |

## 자유게시판 (Articles)
| 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| **GET** | `/articles` | 게시글 목록 조회 (페이지네이션, 검색, 정렬) |
| **GET** | `/articles/:id` | 특정 게시글 상세 조회 |
| **POST** | `/articles` | 새로운 게시글 등록 |
| **PATCH** | `/articles/:id` | 기존 게시글 수정 |
| **DELETE** | `/articles/:id` | 특정 게시글 삭제 |

### 자유게시판 게시글 목록 조회 쿼리 파라미터
- `offset`: 페이지네이션 시작 위치 (기본값: 0)
- `limit`: 조회할 게시글 수 (기본값: 10)
- `sort`: 정렬 방식 (`recent` - 최신순)
- `search`: 제목 또는 내용에 포함된 단어로 검색

## 중고마켓 댓글 (Product Comments)
| 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| **GET** | `/items/:itemId/comments` | 상품 댓글 목록 조회 (Cursor 페이지네이션) |
| **POST** | `/items/:itemId/comments` | 상품 댓글 등록 |
| **PATCH** | `/items/:itemId/comments/:commentId` | 상품 댓글 수정 |
| **DELETE** | `/items/:itemId/comments/:commentId` | 상품 댓글 삭제 |

### 댓글 목록 조회 쿼리 파라미터
- `cursor`: Cursor 페이지네이션을 위한 마지막 댓글 ID
- `limit`: 조회할 댓글 수 (기본값: 10)

## 자유게시판 댓글 (Article Comments)
| 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| **GET** | `/articles/:articleId/comments` | 게시글 댓글 목록 조회 (Cursor 페이지네이션) |
| **POST** | `/articles/:articleId/comments` | 게시글 댓글 등록 |
| **PATCH** | `/articles/:articleId/comments/:commentId` | 게시글 댓글 수정 |
| **DELETE** | `/articles/:articleId/comments/:commentId` | 게시글 댓글 삭제 |

### 댓글 목록 조회 쿼리 파라미터
- `cursor`: Cursor 페이지네이션을 위한 마지막 댓글 ID
- `limit`: 조회할 댓글 수 (기본값: 10)

<br>

# 🛠 기술 스택
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Custom Schema Validators
- **Error Handling**: Custom Error Classes & Async Handler
- **Tooling**: Nodemon (Development)
- **Environment**: dotenv

<br>

# 📊 데이터 모델

## Product (중고마켓 상품)
- `id`: 상품 고유 ID (Primary Key)
- `title`: 상품명
- `description`: 상품 설명
- `price`: 가격
- `status`: 판매 상태 (판매중/예약중/판매완료)
- `createdAt`: 등록 일시
- `updatedAt`: 수정 일시

## Article (자유게시판 게시글)
- `id`: 게시글 고유 ID (Primary Key)
- `title`: 게시글 제목
- `content`: 게시글 내용
- `createdAt`: 작성 일시
- `updatedAt`: 수정 일시

## ProductComment (중고마켓 댓글)
- `id`: 댓글 고유 ID (Primary Key)
- `productId`: 상품 ID (Foreign Key) - ON DELETE CASCADE
- `content`: 댓글 내용
- `createdAt`: 작성 일시
- `updatedAt`: 수정 일시

## ArticleComment (자유게시판 댓글)
- `id`: 댓글 고유 ID (Primary Key)
- `articleId`: 게시글 ID (Foreign Key) - ON DELETE CASCADE
- `content`: 댓글 내용
- `createdAt`: 작성 일시
- `updatedAt`: 수정 일시

<br>

# 🎯 주요 기능

### 중고마켓
- 상품 CRUD 기능
- 상품 목록 조회 (Offset 페이지네이션)
- 상품 검색 기능 (상품명, 내용)
- 상품 정렬 기능 (최신순)
- 상품별 댓글 관리 (등록, 수정, 삭제)
- 댓글 목록 조회 (Cursor 페이지네이션)
- 적절한 에러 처리 및 상태 코드 반환

### 자유게시판
- 게시글 CRUD 기능
- 게시글 목록 조회 (Offset 페이지네이션)
- 게시글 검색 기능 (제목, 내용)
- 게시글 정렬 기능 (최신순)
- 게시글별 댓글 관리 (등록, 수정, 삭제)
- 댓글 목록 조회 (Cursor 페이지네이션)
- 적절한 에러 처리 및 상태 코드 반환

<br>

# 📝 참고 사항

### 데이터 유효성 검사
- Prisma 스키마에서 필수 필드 검증
- `/src/schemas/` 디렉토리의 검증 스키마를 통한 입력값 검증

### 에러 처리
- `asyncHandler.js`로 모든 컨트롤러의 비동기 에러를 자동 처리
- `errors.js`에서 커스텀 에러 클래스 정의
- 적절한 HTTP 상태 코드 반환:
  - `200 OK`: 성공
  - `201 Created`: 리소스 생성 성공
  - `204 No Content`: 삭제 성공
  - `400 Bad Request`: 잘못된 요청
  - `404 Not Found`: 리소스를 찾을 수 없음
  - `500 Internal Server Error`: 서버 오류

### 보안
- dotenv 패키지를 사용하여 환경 변수 관리
- 중요한 설정값(DATABASE_URL 등)은 소스 코드에 노출하지 않음
- PostgreSQL 연결 문자열은 환경 변수로 관리

### 데이터베이스 관계
- Prisma의 `onDelete: Cascade` 설정으로 부모 데이터 삭제 시 자식 데이터도 자동 삭제
- 댓글은 해당 상품/게시글 삭제 시 함께 삭제

### 페이지네이션
- **Offset 방식** (상품/게시글 목록): 페이지 기반 조회에 적합
- **Cursor 방식** (댓글 목록): 실시간 데이터 변화에 유연한 조회

### 테스트
- VS Code의 REST Client 확장을 사용하여 `src/http/` 디렉토리의 `.http` 파일에서 API 동작을 직접 확인할 수 있습니다.
  - `item.http`: 중고마켓 및 중고마켓 댓글 API 테스트
  - `article.http`: 자유게시판 및 자유게시판 댓글 API 테스트

<br>

----
본 프로젝트는 [코드잇](https://www.codeit.kr)의 소유이며, 교육 목적으로만 사용됩니다. © 2026 Codeit. All rights reserved.
