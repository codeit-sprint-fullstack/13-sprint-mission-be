# 스프린트 미션 11 — 판다마켓 백엔드 (AWS 배포 + 테스트)

> 배포 절차는 [DEPLOY.md](./DEPLOY.md) 에 단계별로 정리되어 있습니다.

## 배포 주소

| 구분 | 주소 |
|---|---|
| 백엔드 API | `http://54.180.25.232` |
| 헬스 체크 | `http://54.180.25.232/health` |
| 프론트엔드 | `https://13-sprint-mission-fe-gilt.vercel.app` |

> 과제 채점 후 비용 관리를 위해 EC2·RDS를 중지·삭제하므로, 위 주소는 일정 기간 이후 접속되지 않습니다.
> 동작 화면은 아래 [배포 증빙](#배포-증빙)의 캡쳐로 확인하실 수 있습니다.

## AWS 리소스

모두 **아시아 태평양(서울) `ap-northeast-2`** 리전에 생성했습니다.

| 서비스 | 식별자 | 사양 / 설정 |
|---|---|---|
| EC2 | `panda-market-server` | `t3.micro`, Ubuntu 24.04 LTS |
| EC2 보안 그룹 | `panda-ec2-sg` | SSH 22(내 IP만) / HTTP 80 / HTTPS 443 |
| EC2 IAM 역할 | `PandaMarketEC2Role` | S3 접근 (액세스 키 미사용) |
| RDS | `panda-market-db` | PostgreSQL, `db.t4g.micro`, 20GB, Single-AZ |
| RDS 보안 그룹 | `panda-rds-sg` | 5432 ← `panda-ec2-sg` 참조, 퍼블릭 액세스 비활성화 |
| S3 | `panda-market-images-seonghwi` | 공개 조회 허용, CORS 설정 |
| IAM 정책 | `PandaMarketS3Access` | 버킷 1개에 `PutObject`/`GetObject`/`DeleteObject`만 |

> DB 엔드포인트·자격 증명 등 민감 정보는 저장소에 포함하지 않았습니다.
> 필요한 환경 변수 목록은 [.env.example](./.env.example) 을 참고하세요.

## 기술 스택

- **런타임/언어**: Node.js 22, TypeScript (CommonJS)
- **프레임워크**: Express 5
- **DB / ORM**: PostgreSQL (AWS RDS) / Prisma
- **파일 저장소**: AWS S3 (`multer-s3`, Presigned URL)
- **인증**: JWT + bcrypt
- **검증**: zod
- **테스트**: Jest + ts-jest + supertest + jest-mock-extended
- **인프라**: AWS EC2 · RDS · S3 · IAM, Nginx(리버스 프록시), pm2

---

## 인프라 구성

```
[브라우저]
   │
   ├─ HTTPS ─→ [Vercel] Next.js 프론트엔드
   │              └─ fetch → ↓
   ├─ HTTPS ─→ [S3] 상품 이미지 (공개 조회)
   │                 ▲
   │   ┌─────────────┼──── VPC (ap-northeast-2) ────────────┐
   │   │  [퍼블릭 서브넷]                                     │
   └───┼→ EC2 t3.micro : Nginx(80/443) → pm2 → Node(:3000)  │
       │     └ IAM Role(S3 접근) — 액세스 키 없음             │
       │                    │ :5432                          │
       │  [프라이빗 서브넷]  ▼                                │
       │    RDS PostgreSQL (퍼블릭 액세스 비활성화)            │
       │    SG 인바운드: EC2의 보안 그룹만 허용                │
       └───────────────────────────────────────────────────┘
                            ▲
      로컬 PC ── SSH 터널(localhost:5433) ──┘
```

### 설계 근거

| 결정 | 이유 |
|---|---|
| 프론트는 Vercel, 백엔드만 EC2 | t3.micro는 메모리 1GB. Next 빌드와 Node 서버를 한 인스턴스에 올리면 OOM. 정적 자산은 CDN이 유리 |
| **3000번 포트를 열지 않음** | 앱은 `127.0.0.1:3000`만 청취. 외부 노출은 Nginx가 전담해 공격 표면을 80/443으로 축소하고, TLS 종료도 Nginx가 담당 |
| SSH는 내 IP만 허용 | `0.0.0.0/0`으로 열면 즉시 브루트포스 대상이 됨 |
| RDS 퍼블릭 액세스 비활성화 | DB는 인터넷에서 닿을 수 없어야 함. 로컬 접근은 SSH 터널로 대체 |
| RDS 인바운드 소스 = **EC2 보안 그룹 ID** | IP로 지정하면 EC2 재시작 시 IP가 바뀌어 규칙을 매번 수정해야 함. 보안 그룹 참조는 IP 변경과 무관 |
| S3 접근에 **IAM Role** 사용 | 서버에 영구 액세스 키를 두지 않음. SDK가 임시 자격 증명을 받아 자동 갱신 |
| S3 객체 ACL 미사용 | 최신 버킷은 ACL이 비활성(Bucket owner enforced)이라 `acl` 전달 시 오히려 실패. 공개 여부는 버킷 정책으로 관리 |
| Presigned URL 병행 구현 | 파일이 EC2를 경유하지 않아 메모리·대역폭 절약 |
| pm2 `fork` 모드, 인스턴스 1개 | 1GB 메모리에서 cluster로 여러 프로세스를 띄우면 서로 메모리를 다투다 OOM |

---

## 요구사항 체크리스트

### 공통

- [x] AWS 루트 계정 준비
- [x] 프리 티어 제공 범위 확인 (크레딧 기반 무료 플랜)
- [x] 리전: 아시아 태평양(서울) `ap-northeast-2` — 전 리소스 동일 리전
- [x] 인스턴스 중지·종료 절차 숙지 → [DEPLOY.md 11장](./DEPLOY.md) 참고

### 백엔드 — 프로젝트 구조 및 환경 설정

- [x] 배포에 적합한 프로젝트 구조 — `app.ts`(앱)와 `server.ts`(기동) 분리
- [x] `development` / `production` 환경 분리 — `src/config/env.ts`에서 `NODE_ENV`에 따라 `.env.{환경}` 로드
- [x] 환경 변수 검증 — zod 스키마로 기동 시점에 누락을 잡고 즉시 실패
- [x] 업로드 저장소를 환경별로 전환 (`UPLOAD_DRIVER=local | s3`)

### AWS S3 파일 업로드

- [x] S3 버킷 생성 (`panda-market-images-seonghwi`, 서울 리전)
- [x] 버킷 정책으로 공개 조회 허용 (`s3:GetObject`만) — [deploy/aws/s3-bucket-policy.json](./deploy/aws/s3-bucket-policy.json)
- [x] CORS 설정 (Presigned URL 직접 업로드용) — [deploy/aws/s3-cors.json](./deploy/aws/s3-cors.json)
- [x] IAM 최소 권한 정책 `PandaMarketS3Access` — [deploy/aws/iam-policy.json](./deploy/aws/iam-policy.json)
- [x] EC2용 IAM 역할 `PandaMarketEC2Role` (액세스 키 미사용)
- [x] `multer-s3`로 업로드 미들웨어 전환 — `src/middlewares/upload.ts`
- [x] 업로드 응답을 S3 객체 URL로 변경 — `src/controllers/uploadController.ts`
- [x] **S3 업로드 정상 동작 확인** — `npm run check:s3` 5단계 전부 통과

```
✔ 업로드 (PutObject)
✔ 조회 (GetObject)
✔ 공개 URL 조회 — 200 image/png     ← 버킷 정책 검증
✔ Presigned URL 업로드 — 만료 300초  ← 심화 요구사항 검증
✔ 삭제 (DeleteObject)
```

### AWS RDS

- [x] RDS PostgreSQL 인스턴스 생성 (프리 티어 `db.t4g.micro`, 20GB, Single-AZ)
- [x] **퍼블릭 액세스 비활성화** — 인터넷에서 직접 접근 불가
- [x] 보안 그룹 `panda-rds-sg`: 5432 인바운드를 **EC2 보안 그룹(`panda-ec2-sg`) 참조**로 허용
- [x] 초기 데이터베이스 `panda` 생성
- [x] `prisma migrate deploy`로 스키마 반영
- [x] CRUD 동작 확인 — 배포된 사이트에서 회원가입·상품 등록·목록 조회로 검증
- [ ] SSH 터널링(로컬 5433)으로 RDS 접속 확인

### AWS EC2

- [x] EC2 인스턴스 생성 — `t3.micro`, Ubuntu Server 24.04 LTS
- [x] 보안 그룹 `panda-ec2-sg`: **SSH 22(내 IP만)** / HTTP 80 / HTTPS 443
- [x] 앱 포트(3000)는 외부에 열지 않음 — Nginx만 노출
- [x] IAM 역할 `PandaMarketEC2Role` 연결 (S3 접근용, 키 저장 불필요)
- [x] pm2로 백그라운드 실행 + `pm2 startup`으로 자동 기동
- [x] Nginx 리버스 프록시 구성 — `deploy/nginx.conf`

### 백엔드 테스트

- [x] `jest.config.js` 작성
- [x] 상품 CRUD 유닛 테스트
- [x] **접근 권한 검증 시나리오** — 비로그인 401, 남의 리소스 수정/삭제 403
- [x] 회원가입·로그인 유닛 테스트
- [x] 비동기 코드 테스트 (`async/await`)
- [x] Mock·Spy로 외부 서비스 테스트 — Prisma, bcrypt, AWS S3
- [x] `describe`/`test`로 그룹화

### 프론트엔드 배포

- [x] Vercel 배포 — `https://13-sprint-mission-fe-gilt.vercel.app`
- [x] 배포된 백엔드 주소에 맞게 API 주소 변경 (Next.js rewrites 프록시로 Mixed Content 해결)

### 심화

- [x] 커버리지 분석 및 누락 테스트 보강 (**95.5%**)
- [x] Presigned URL 업로드 구현 — `POST /upload/presigned`
- [ ] Route 53 도메인 연결
- [ ] SSL 인증서 적용(HTTPS)

---

## 테스트

```bash
npm test              # 전체 실행
npm run test:coverage # 커버리지 리포트
```

### 결과

```
Test Suites: 7 passed, 7 total
Tests:       121 passed, 121 total
전체 커버리지: 95.5% (Stmts)
```

| 대상 | 커버리지 | 비고 |
|---|---|---|
| `productsController.ts` | 100% | CRUD + 권한 검증 + 좋아요 |
| `authController.ts` | 100% | 회원가입 · 로그인 |
| `articlesController.ts` | 100% | |
| `commentsController.ts` | 100% | 커서 페이지네이션 포함 |
| `errorHandler.ts` | 100% | Zod / Prisma / 파싱 실패 / 기본 500 |
| `auth.ts` (미들웨어) | 100% | 토큰 없음 · 위조 · 삭제된 사용자 |
| `utils/s3.ts` | 100% | Presigned URL (AWS 모킹) |
| 검증 스키마 전체 | 100% | |

### 테스트 전략

- **DB에 붙지 않습니다.** `jest-mock-extended`의 `mockDeep`으로 PrismaClient 전체를 테스트 더블로 교체 → 테스트가 DB 상태·실행 순서에 의존하지 않습니다.
- **AWS에 붙지 않습니다.** `@aws-sdk/s3-request-presigner`를 모킹해 네트워크·자격 증명·과금 없이 서명 로직만 검증합니다.
- **권한 검증은 상태 코드와 부수 효과를 함께 확인합니다.** 403이 떴는지뿐 아니라 `prisma.product.update`가 **호출되지 않았는지**까지 단언합니다.
- **Spy 활용**: `bcrypt.hash`가 평문이 아닌 해시를 저장하는지, `getSignedUrl`에 만료 시간이 실렸는지를 호출 인자로 검증합니다.

---

## 로컬 실행

```bash
cp .env.example .env    # 값 채우기
npm install
npx prisma migrate dev
npm run dev             # http://localhost:3000
```

| 스크립트 | 설명 |
|---|---|
| `npm run dev` | nodemon + ts-node (파일 변경 시 자동 재시작) |
| `npm run build` | Prisma 생성 + TypeScript 컴파일 → `dist/` |
| `npm start` | 빌드 결과 실행 (배포용) |
| `npm test` | Jest 전체 실행 |
| `npm run test:coverage` | 커버리지 리포트 |
| `npm run typecheck` | `tsc --noEmit` (src + tests + scripts) |
| `npm run check:s3` | S3 연결 점검 (업로드·조회·공개URL·Presigned·삭제 5단계) |
| `npm run prisma:deploy` | 배포 환경 마이그레이션 적용 |

## 배포 스크립트

| 파일 | 용도 |
|---|---|
| `scripts/setup-ec2.sh` | EC2 최초 1회 — 스왑 2GB, Node 22, build-essential, pm2, Nginx (멱등) |
| `scripts/deploy.sh` | 배포 — pull → `npm ci` → `migrate deploy` → build → `pm2 reload` → 헬스체크 |
| `scripts/check-s3.ts` | S3 설정 검증 (`npm run check:s3`) |
| `deploy/nginx.conf` | Nginx 리버스 프록시 설정 |
| `deploy/aws/*.json` | 버킷 정책 · CORS · IAM 정책 템플릿 (`BUCKET_NAME`만 교체) |

---

## API

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| `GET` | `/health` | | 서버 상태 확인 |
| `POST` | `/auth/signup` | | 회원가입 |
| `POST` | `/auth/signin` | | 로그인 |
| `GET` | `/users/me` | ✔ | 내 정보 |
| `POST` | `/upload` | ✔ | 이미지 업로드 (multer-s3) |
| `POST` | `/upload/presigned` | ✔ | Presigned URL 발급 |
| `GET` | `/products` | | 상품 목록 (검색·정렬·페이지네이션) |
| `POST` | `/products` | ✔ | 상품 등록 |
| `GET` | `/products/:id` | △ | 상품 상세 (로그인 시 `isLiked` 포함) |
| `PATCH` | `/products/:id` | ✔ | 상품 수정 (소유자만) |
| `DELETE` | `/products/:id` | ✔ | 상품 삭제 (소유자만) |
| `POST`/`DELETE` | `/products/:id/favorite` | ✔ | 좋아요 / 취소 |
| `GET`/`POST` | `/products/:productId/comments` | △/✔ | 상품 문의 |
| `GET`/`POST` | `/articles` | /✔ | 게시글 목록 / 등록 |
| `GET`/`PATCH`/`DELETE` | `/articles/:id` | △/✔/✔ | 게시글 상세 / 수정 / 삭제 |
| `POST`/`DELETE` | `/articles/:id/like` | ✔ | 좋아요 / 취소 |
| `GET`/`POST` | `/articles/:articleId/comments` | /✔ | 게시글 댓글 |
| `PATCH`/`DELETE` | `/comments/:id` | ✔ | 댓글 수정 / 삭제 (작성자만) |

△ = 선택적 인증 (토큰이 있으면 추가 정보 제공)

---

## 배포 증빙

> 서버를 종료하기 전에 캡쳐한 자료입니다.

| # | 항목 | 상태 | 캡쳐 |
|---|---|---|---|
| 1 | EC2 인스턴스 실행 중 (t3.micro, IAM 역할 연결) | 완료 | _(이미지)_ |
| 2 | EC2 보안 그룹 인바운드 (22/80/443, 3000 없음) | 완료 | _(이미지)_ |
| 3 | RDS 인스턴스 상세 (퍼블릭 액세스: 아니요) | 완료 | _(이미지)_ |
| 4 | RDS 보안 그룹 (소스 = EC2 보안 그룹 참조) | 완료 | _(이미지)_ |
| 5 | `npm run check:s3` 5단계 통과 | 완료 | _(이미지)_ |
| 6 | S3 버킷 업로드 객체 목록 | 완료 | _(이미지)_ |
| 7 | S3 이미지 URL 브라우저 조회 | 완료 | _(이미지)_ |
| 8 | `npm run test:coverage` 커버리지 리포트 | 완료 | _(이미지)_ |
| 9 | `pm2 status` (online) | 완료 | _(이미지)_ |
| 10 | `sudo nginx -t` 성공 | 완료 | _(이미지)_ |
| 11 | `http://54.180.25.232/health` 응답 | 완료 | _(이미지)_ |
| 12 | SSH 터널링(5433)으로 RDS 테이블 조회 | 미완 | _(이미지)_ |
| 13 | 배포 사이트 전체 동작 (로그인 → 상품 등록 → 조회) | 완료 | _(이미지)_ |

---

## 알려진 한계

- **모니터링 부재** — 장애를 능동적으로 알 방법이 없습니다. pm2 로그를 직접 확인해야 합니다. CloudWatch 알람이 다음 보완 1순위입니다.
- **무중단 배포 아님** — 인스턴스가 1대라 `pm2 reload` 시 짧은 공백이 생깁니다. ALB + 2대 구성이 필요합니다.
- **CI/CD 없음** — 배포가 수동 SSH 접속에 의존합니다.
- **확장 가능성** — 인증이 JWT 기반이라 서버가 무상태이므로, 인스턴스를 늘려도 세션 공유 문제 없이 수평 확장할 수 있습니다.


---

<details>
<summary>원본 저장소 README (코드잇 제공)</summary>

# 🐼 판다마켓 프로젝트

> _이 저장소는 판다마켓 프로젝트의 백엔드 코드를 관리하는 곳입니다. 프로젝트를 클론하여 개발 환경을 설정하고, 각 브랜치에서 해당 스프린트 미션을 수행해 주세요!_ 🛠️

## 소개

안녕하세요! 판다마켓 프로젝트에 오신 것을 환영합니다! 🥳  
판다마켓은 따뜻한 중고거래를 위한 커뮤니티 플랫폼이에요. 여러분은 이곳에서 상품을 등록하고, 다른 사용자들과 소통하며, 자유롭게 이야기를 나눌 수 있어요. 매주 스프린트 미션을 통해 기능을 하나씩 만들어 가며 성장해 나가는 여정을 함께해요. 🚀

![PandaMarket](https://github.com/user-attachments/assets/3784b99f-73c9-4349-a9a9-92b2a7563574)  
_위 이미지는 판다마켓의 대표 이미지입니다. 프로젝트가 진행됨에 따라 더 많은 이미지를 추가할 예정이에요!_ 📸

## 스프린트 미션이란? 🤔

스프린트 미션은 **하나의 개인 프로젝트를 길게 진행하면서, 그 과정에서 주기적으로 피드백을 받을 수 있는 시스템**이에요. 각 스프린트마다 배운 이론을 적용해 보고, **멘토님께 코드 리뷰를 받아가며 실력을 쑥쑥 키워갈 수 있는 중요한 개인 과제**랍니다. 💪

## 주요 기능 ✨

1. **상품 등록**: 내가 가진 물건을 올리고, 사진과 설명을 추가해 직접 판매할 수 있어요!
2. **문의 댓글**: 상품에 대한 궁금한 점이나 의견을 자유롭게 남길 수 있답니다. 📝
3. **자유게시판**: 다양한 주제로 친구들과 이야기를 나누고, 정보를 공유할 수 있는 공간이에요! 🗣️

## 프로젝트 브랜치 구조 🏗️

프로젝트는 단계별로 나뉘어 있고, 각 스프린트 미션에 맞는 브랜치가 있어요. 각 브랜치를 통해 체계적으로 개발하며 학습할 수 있어요. 🎯

### 브랜치 설명

1. **node (part1): 스프린트 미션 4의 BE 요구사항**

   - 백엔드 서버 설정과 간단한 API 구현을 위한 Express.js 프로젝트의 초기 세팅이 포함돼요.
   - **스프린트 미션 4**의 백엔드 내용이 포함돼 있어요.

2. **express (part2~4): 스프린트 미션 6 ~ 12의 BE 요구사항**
   - Express.js를 이용해 더 복잡한 백엔드 기능을 구현하는 미션입니다. 데이터베이스 연동, 인증 및 권한 관리 등 고급 API 설계가 포함됩니다.
   - **스프린트 미션 6부터 12까지**의 백엔드 내용이 들어 있어요.

> _스프린트 미션 내 프론트엔드 요구사항은 [프론트엔드 레포지토리](https://github.com/codeit-sprint-fullstack/11-sprint-mission-fe)의 브랜치에서 관리해주세요_

---

본 프로젝트는 [코드잇](https://www.codeit.kr)의 소유이며, 교육 목적으로만 사용됩니다. © 2026 Codeit. All rights reserved.

</details>
