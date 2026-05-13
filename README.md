# 🛒 Product Market API

Express와 MongoDB(Mongoose)를 사용하여 구축한 상품 관리(CRUD) RESTful API 프로젝트입니다. 
라우터와 컨트롤러를 분리하여 유지보수가 용이한 구조로 설계되었습니다.

<br>

# 📁 프로젝트 구조

```
.
├── app.js               # 애플리케이션 진입점 및 미들웨어 설정
├── db.js                # MongoDB 연결 설정 (Mongoose)
├── controllers          # 비즈니스 로직 처리
│   └── itemController.js
├── models               # Mongoose 스키마 및 모델 정의
│   └── Product.js
├── routes               # API 경로 정의 및 라우팅
│   └── itemRoutes.js
├── seed.js              # 초기 데이터(Seed Data) 삽입 스크립트
├── test.http            # API 테스트용 파일 (REST Client)
├── package.json         # 프로젝트 설정 및 의존성 관리
└── README.md
```

<br>

# 🚀 시작하기

#### 1. 의존성 설치
```
npm install
```

#### 2. 초기 데이터 심기 (Seeding)
데이터베이스에 테스트용 초기 데이터를 삽입하려면 아래 명령어를 실행하세요.
```
npm run seed
```

#### 3. 서버 실행

- 프로덕션 모드:
  ```
  npm start
  ```
- 개발 모드 (Nodemon):
  ```
  npm run dev
  ```

<br>

# 🛣 API 엔드포인트
| 메서드 | 엔드포인트 | 설명 |
| :--- | :--- | :--- |
| **GET** | `/items` | 모든 상품 목록 조회 |
| **GET** | `/items/:id` | 특정 상품 상세 조회 |
| **POST** | `/items` | 새로운 상품 등록 |
| **PATCH** | `/items/:id` | 기존 상품 정보 수정 |
| **DELETE** | `/items/:id` | 특정 상품 삭제 |

<br>

# 🛠 기술 스택
- Runtime: Node.js
- Framework: Express
- Database: MongoDB
- ODM: Mongoose
- Tooling: Nodemon (Development)

<br>

# 📝 참고 사항
- 유효성 검사: Mongoose Schema를 통해 데이터 유효성 검사를 수행합니다.
- 에러 처리: 각 컨트롤러 내에서 try-catch 블록을 통해 예외 처리가 되어 있습니다.
- 보안: dotenv 패키지를 사용하여 환경 변수를 관리하며, 중요한 설정값은 소스 코드에 노출하지 않습니다.
- 테스트: VS Code의 REST Client 확장을 사용하여 test.http 파일에서 API 동작을 직접 확인할 수 있습니다.

---

본 프로젝트는 [코드잇](https://www.codeit.kr)의 소유이며, 교육 목적으로만 사용됩니다. © 2026 Codeit. All rights reserved.