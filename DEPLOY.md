# 판다마켓 백엔드 배포 가이드 (스프린트 미션 11)

AWS 콘솔 작업을 순서대로 따라갈 수 있게 정리한 문서입니다.
**리전은 전부 `아시아 태평양(서울) ap-northeast-2`** 로 맞춰야 합니다. 리전이 섞이면 EC2에서 RDS가 안 보입니다.

> **비용 주의**
> 실습이 끝나면 **EC2는 중지, RDS는 스냅샷 후 삭제**하세요.
> RDS는 "중지"해도 **7일 뒤 자동으로 다시 켜집니다.**
> 서버를 끄기 **전에** 아래 [증빙 캡쳐 체크리스트](#10-증빙-캡쳐-체크리스트)를 먼저 찍어두세요.

---

## 0. 사전 준비

### 0-1. 예산 알림부터 걸기 (제일 먼저)

콘솔 → **Billing and Cost Management** → **Budgets** → 예산 생성

- 유형: 비용 예산 / 금액: **$1**
- 알림: 실제 비용이 **80%** 도달 시 이메일

> 프리티어 한도를 넘겼을 때 **며칠 뒤가 아니라 바로** 알 수 있는 유일한 안전장치입니다.

### 0-2. 프리티어 범위 확인

계정 생성 시점에 따라 프리티어 형태가 다릅니다(12개월 무료 티어 / 크레딧 기반).
콘솔 → **Billing** → **Free tier** 에서 본인 계정 기준 잔여량을 먼저 확인하세요.

이번 과제에서 쓰는 것:

| 서비스 | 사양 | 비고 |
|---|---|---|
| EC2 | t2.micro 또는 t3.micro (프리티어 표시 있는 것) | 750시간/월 |
| RDS | db.t3.micro, 20GB, **Single-AZ** | 750시간/월 |
| S3 | 5GB 표준 스토리지 | 요청 수 제한 있음 |

---

## 1. S3 버킷 + IAM 만들기

### 1-1. 버킷 생성

S3 → 버킷 만들기

- 이름: `panda-market-images-하성휘` (전 세계에서 유일해야 함)
- 리전: **아시아 태평양(서울)**
- **"모든 퍼블릭 액세스 차단" 체크 해제** → 경고 확인란 체크
  - 상품 이미지는 누구나 볼 수 있어야 하므로 공개 조회가 필요합니다.
- 객체 소유권: **ACL 비활성화(권장)** 그대로 둡니다.
  - 이 상태라 코드에서 `acl: "public-read"`를 넘기면 **오히려 업로드가 실패**합니다.
    공개 여부는 아래 버킷 정책으로 정합니다.

### 1-2. 버킷 정책 (공개 조회 허용)

버킷 → 권한 → 버킷 정책 → 편집 (`deploy/aws/s3-bucket-policy.json` 의 BUCKET_NAME만 교체)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForProductImages",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::panda-market-images-하성휘/*"
    }
  ]
}
```

> `s3:GetObject`만 허용합니다. 쓰기(PutObject)는 열지 않습니다 —
> 업로드는 인증된 서버나 Presigned URL을 통해서만 가능해야 합니다.

### 1-3. CORS 설정 (Presigned URL 심화 항목용)

버킷 → 권한 → CORS (`deploy/aws/s3-cors.json` 참고)

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["http://localhost:3001", "https://내프로젝트.vercel.app"],
    "ExposeHeaders": ["ETag"]
  }
]
```

> 브라우저가 S3로 **직접** PUT 하는 방식이라, S3 쪽에도 CORS 허용이 필요합니다.
> multer-s3 방식만 쓴다면 이 설정은 없어도 됩니다.

### 1-4. IAM 정책 + 역할

**① 정책 만들기** — IAM → 정책 → 생성 → JSON (`deploy/aws/iam-policy.json` 참고)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::panda-market-images-하성휘/*"
    }
  ]
}
```

이름: `PandaMarketS3Access`

> 버킷 하나에만, 필요한 3개 동작만 허용합니다(최소 권한 원칙).
> `s3:*` 나 `Resource: "*"` 로 열면 면접에서 지적받는 부분입니다.

**② EC2용 역할** — IAM → 역할 → 생성

- 신뢰할 수 있는 엔터티: **AWS 서비스** → **EC2**
- 권한: `PandaMarketS3Access`
- 이름: `PandaMarketEC2Role`

> **이게 핵심입니다.** EC2에 이 역할을 붙이면 SDK가 임시 자격 증명을 자동으로 받아오므로,
> **서버에 액세스 키를 저장할 필요가 없습니다.**

**③ 로컬 테스트용 사용자** — IAM → 사용자 → 생성

- 이름: `panda-local-dev`
- 권한: `PandaMarketS3Access`
- 생성 후 **액세스 키** 발급 → 로컬 `.env`에만 넣습니다. (절대 커밋 금지)

---

## 2. 로컬에서 S3 업로드 검증

`panda_be/.env` 에 추가:

```bash
UPLOAD_DRIVER="s3"
AWS_REGION="ap-northeast-2"
S3_BUCKET="panda-market-images-하성휘"
AWS_ACCESS_KEY_ID="위에서 발급한 키"
AWS_SECRET_ACCESS_KEY="위에서 발급한 시크릿"
```

### 자동 점검 (권장)

```bash
npm run check:s3
```

`scripts/check-s3.ts`가 버킷 접근 → 업로드 → 조회 → **공개 URL 접근(버킷 정책 확인)** →
Presigned URL 업로드 → 삭제까지 6단계를 순서대로 검사하고, 실패한 항목마다 원인과 해결 방법을 알려줍니다.
점검용 파일은 끝나고 자동으로 지워져 버킷에 아무것도 남지 않습니다.

**이 출력을 캡쳐하면 "S3 업로드 정상 작동 확인" 증빙이 됩니다.**

### 수동 확인

```bash
npm run dev
```

Postman 등으로 확인:

- `POST /auth/signin` → 토큰 확보
- `POST /upload` (form-data, key=`images`, 파일 첨부, Authorization 헤더)
  → 응답의 `urls`가 `https://버킷.s3.ap-northeast-2.amazonaws.com/products/...` 형태인지
  → 그 주소를 **브라우저에 직접 붙여넣어** 이미지가 보이는지 (버킷 정책 확인)
- `POST /upload/presigned` (심화)
  ```json
  { "files": [{ "filename": "test.png", "contentType": "image/png" }] }
  ```
  → 받은 `uploadUrl`로 그 파일을 `PUT` → 그 다음 `fileUrl`로 조회되는지

> **확인 후 `UPLOAD_DRIVER="local"` 로 되돌려두면** 이후 로컬 개발이 AWS 없이 돌아갑니다.

---

## 3. RDS 만들기

RDS → 데이터베이스 생성

| 항목 | 값 |
|---|---|
| 생성 방식 | 표준 생성 |
| 엔진 | **PostgreSQL** |
| 템플릿 | **프리 티어** |
| DB 인스턴스 식별자 | `panda-market-db` |
| 마스터 사용자 | `pandaadmin` |
| 암호 | 직접 지정 (특수문자 `@ : / ?` 는 피할 것 — 연결 문자열이 깨집니다) |
| 인스턴스 | `db.t3.micro` |
| 스토리지 | 20GB gp3, **스토리지 자동 조정 끄기** |
| 퍼블릭 액세스 | **아니요** |
| VPC 보안 그룹 | 새로 생성 → `panda-rds-sg` |
| 추가 구성 → 초기 데이터베이스 이름 | `panda` |
| 자동 백업 | 0일 (과제용, 비용 절약) |

> **"스토리지 자동 조정"과 "퍼블릭 액세스"를 반드시 확인하세요.**
> 자동 조정은 모르는 사이 과금으로, 퍼블릭 액세스는 DB가 인터넷에 노출되는 문제로 이어집니다.

생성에는 5~10분 걸립니다. 그동안 EC2를 만드세요.
완료되면 **엔드포인트**(`panda-market-db.xxxx.ap-northeast-2.rds.amazonaws.com`)를 메모합니다.

---

## 4. EC2 만들기

EC2 → 인스턴스 시작

| 항목 | 값 |
|---|---|
| 이름 | `panda-market-server` |
| AMI | **Ubuntu Server 24.04 LTS** (프리티어 표시 확인) |
| 인스턴스 유형 | `t2.micro` 또는 `t3.micro` (프리티어) |
| 키 페어 | 새로 생성 → `panda-key.pem` 다운로드 |
| 스토리지 | 8~30GB gp3 |

### 4-1. 보안 그룹 (`panda-ec2-sg`)

| 유형 | 포트 | 소스 | 이유 |
|---|---|---|---|
| SSH | 22 | **내 IP** | 0.0.0.0/0으로 열면 몇 분 내 브루트포스가 들어옵니다 |
| HTTP | 80 | 0.0.0.0/0 | 브라우저 기본 포트 |
| HTTPS | 443 | 0.0.0.0/0 | 인증서 적용 후 사용 |

> **3000번은 열지 않습니다.** 앱은 `127.0.0.1:3000`만 듣고, 외부 노출은 Nginx가 전담합니다.

### 4-2. IAM 역할 연결

인스턴스 선택 → 작업 → 보안 → **IAM 역할 수정** → `PandaMarketEC2Role`

### 4-3. RDS 보안 그룹 열어주기

RDS 콘솔 → `panda-market-db` → 연결 & 보안 → VPC 보안 그룹(`panda-rds-sg`) 클릭
→ 인바운드 규칙 편집 → 규칙 추가

| 유형 | 포트 | 소스 |
|---|---|---|
| PostgreSQL | 5432 | **`panda-ec2-sg`** (IP가 아니라 보안 그룹을 선택) |

> IP로 지정하면 EC2를 껐다 켤 때마다 규칙을 고쳐야 합니다.
> 보안 그룹 참조는 "그 그룹에 속한 인스턴스만"이라는 논리적 규칙이라 IP 변경과 무관합니다.

---

## 5. SSH 접속 & 서버 준비

```bash
# Windows PowerShell 기준. 키 파일 권한 경고가 나면 파일 속성 → 보안에서 본인만 남깁니다.
ssh -i panda-key.pem ubuntu@EC2_퍼블릭_IP
```

저장소를 먼저 클론한 뒤, 준비 스크립트를 실행하면 됩니다.

```bash
git clone https://github.com/seonghwi-ha/13-sprint-mission-be.git panda
cd panda
git checkout express-하성휘

chmod +x scripts/*.sh
./scripts/setup-ec2.sh
```

`scripts/setup-ec2.sh`가 하는 일 (여러 번 실행해도 안전합니다):

1. 패키지 목록 최신화
2. **스왑 2GB 설정** — t3.micro는 메모리가 1GB라 없으면 `npm ci`·빌드가 OOM으로 죽습니다
3. Node.js 22 + `build-essential`(bcrypt 네이티브 빌드용)
4. pm2
5. Nginx

> 스크립트가 `^M` 관련 오류로 실행되지 않으면 줄바꿈이 CRLF로 받아진 경우입니다.
> `.gitattributes`에 `*.sh text eol=lf`를 넣어뒀지만, 그래도 나면
> `sed -i 's/\r$//' scripts/*.sh` 로 고칠 수 있습니다.

---

## 6. 앱 배포

5장에서 저장소는 이미 클론했습니다. 이제 환경 변수만 채우고 배포 스크립트를 돌리면 됩니다.

`.env.production` 생성:

```bash
nano .env.production
```

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL="postgresql://pandaadmin:비번@panda-market-db.xxxx.ap-northeast-2.rds.amazonaws.com:5432/panda?schema=public"
JWT_SECRET="충분히_긴_랜덤_문자열"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="https://내프로젝트.vercel.app"
UPLOAD_DRIVER="s3"
AWS_REGION="ap-northeast-2"
S3_BUCKET="panda-market-images-하성휘"
# 액세스 키는 넣지 않습니다 — IAM Role이 대신합니다.
```

```bash
./scripts/deploy.sh
```

`scripts/deploy.sh`가 순서대로 수행합니다:

1. `git pull` — 최신 코드
2. `npm ci` — 락파일 기준 정확한 재현 설치
3. `npx prisma migrate deploy` — **`migrate dev`가 아닙니다.** `deploy`는 이미 만들어진 마이그레이션만 적용하고 데이터를 지우지 않습니다
4. `npm run build`
5. `pm2 reload` (최초라면 `pm2 start`) → `pm2 status` → 헬스 체크까지 자동 확인

최초 1회만 재부팅 자동 기동을 등록합니다 (스크립트가 안내 문구를 출력합니다):

```bash
pm2 startup     # 출력되는 sudo 명령어를 복사해서 실행
pm2 save
```

문제가 있으면:

```bash
pm2 logs panda-be --lines 50
```

**이후 재배포는 `./scripts/deploy.sh` 한 줄이면 됩니다.**

---

## 7. Nginx 리버스 프록시

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/panda
sudo ln -s /etc/nginx/sites-available/panda /etc/nginx/sites-enabled/panda
sudo rm /etc/nginx/sites-enabled/default

sudo nginx -t                  # 문법 검사
sudo systemctl reload nginx
```

브라우저에서 `http://EC2_퍼블릭_IP/health` 접속 → `{"status":"ok"}` 가 보이면 성공입니다.

---

## 8. 로컬에서 RDS 보기 (SSH 터널링)

DBeaver·psql 같은 도구로 RDS 데이터를 직접 확인할 때 씁니다.
RDS가 인터넷에 닫혀 있으므로, **접근 권한이 있는 EC2를 통로로 빌립니다.**

```bash
ssh -i panda-key.pem -L 5433:panda-market-db.xxxx.ap-northeast-2.rds.amazonaws.com:5432 ubuntu@EC2_퍼블릭_IP -N
```

- `-L 5433:...:5432` → 내 PC의 **5433**으로 보낸 트래픽을 EC2를 거쳐 RDS의 5432로 전달
- **왜 5433인가**: 로컬에 이미 PostgreSQL이 5432에서 돌고 있어 충돌하므로 한 칸 옆으로 비켜 씁니다
- `-N` → 터미널을 열지 않고 터널만 유지 (이 창은 켜둔 채로 둡니다)

이 상태에서 로컬 DB 도구는 `localhost:5433` 으로 접속하면 됩니다.
`.env` 의 `DATABASE_URL` 도 `localhost:5433` 으로 바꾸면 **로컬 코드로 RDS를 그대로 쓸 수 있습니다.**

---

## 9. 프론트엔드 배포 (Vercel)

1. [vercel.com](https://vercel.com) → GitHub 저장소 import
2. **Root Directory**: 프론트 폴더 지정
3. 환경 변수: `NEXT_PUBLIC_API_URL` = `https://api.내도메인.com` (또는 `http://EC2_IP`)
4. Deploy
5. 배포된 도메인을 EC2의 `.env.production` 의 `CORS_ORIGIN` 에 넣고 `pm2 restart panda-be`

> ### ⚠️ Mixed Content 문제
> Vercel은 **무조건 HTTPS**입니다. 백엔드가 `http://` 면 브라우저가 요청을 **차단**해서
> 로컬에선 멀쩡하던 기능이 배포 후 전부 실패합니다.
>
> **해결 = 백엔드에도 HTTPS를 붙이는 것** (아래 심화 항목). 도메인이 필요합니다 —
> IP 주소만으로는 SSL 인증서를 발급받을 수 없습니다.

### 심화: 도메인 + HTTPS

```bash
# Route 53에서 도메인 구입 또는 기존 도메인 연결
# A 레코드: api.내도메인.com → EC2 퍼블릭 IP (Elastic IP 권장)

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.내도메인.com
```

certbot이 Nginx 설정에 443 블록과 80→443 리다이렉트를 자동으로 추가합니다.

> **Elastic IP 주의**: EC2를 중지했다 켜면 퍼블릭 IP가 바뀝니다. Elastic IP를 붙이면 고정되지만,
> **인스턴스에 연결되지 않은 상태의 EIP는 시간당 과금**됩니다. 실습을 끝내고 서버를 끌 거라면 EIP는 반납하세요.

---

## 10. 증빙 캡쳐 체크리스트

**서버를 끄기 전에** 아래를 전부 캡쳐해서 README에 첨부합니다.

- [ ] EC2 인스턴스 목록 (상태: 실행 중, 인스턴스 유형, 퍼블릭 IP)
- [ ] EC2 보안 그룹 인바운드 규칙 (22/80/443, 3000 없음)
- [ ] RDS 인스턴스 상세 (엔진, 클래스, **퍼블릭 액세스: 아니요**)
- [ ] RDS 보안 그룹 인바운드 (소스가 EC2 보안 그룹)
- [ ] S3 버킷 안에 실제 업로드된 이미지 객체 목록
- [ ] S3 이미지 URL을 브라우저로 연 화면
- [ ] EC2에서 `pm2 status` 출력 (online 상태)
- [ ] EC2에서 `sudo nginx -t` 성공 출력
- [ ] `http://EC2_IP/health` 브라우저 응답
- [ ] SSH 터널링 연결 후 DB 도구로 RDS 테이블 조회한 화면
- [ ] 배포된 Vercel 프론트에서 **로그인 → 상품 등록(이미지 포함) → 목록 확인** 전체 흐름
- [ ] `npm run test:coverage` 커버리지 리포트 출력

---

## 11. 실습 종료 — 리소스 정리

```bash
pm2 stop panda-be
```

콘솔에서:

1. **EC2**: 인스턴스 → 인스턴스 상태 → **중지** (종료(Terminate)는 완전 삭제)
2. **Elastic IP**: 할당했다면 **릴리스** (연결 안 된 EIP는 과금)
3. **RDS**: 스냅샷 생성 후 **삭제**
   - "중지"는 **7일 뒤 자동 재시작**되므로 과제가 끝났으면 삭제가 안전합니다
4. **S3**: 용량이 작으면 그대로 둬도 프리티어 범위입니다 (증빙용으로 유지 권장)
5. 며칠 뒤 **Billing → 비용 탐색기**에서 예상치 못한 과금이 없는지 확인

---

## 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| `npm ci` 도중 프로세스가 죽음 | 메모리 부족. 5장의 스왑 설정을 했는지 확인 |
| 브라우저에서 접속 시 502 Bad Gateway | 앱이 안 떠 있음. `pm2 logs panda-be` 로 원인 확인 |
| 이미지 업로드 시 413 | Nginx `client_max_body_size` 누락 |
| 이미지 업로드 시 AccessDenied | IAM 역할 미연결, 또는 코드에서 `acl` 을 넘기고 있음 |
| S3 URL이 403 | 버킷 정책(`s3:GetObject`) 누락 |
| 프론트에서 CORS 에러 | `CORS_ORIGIN` 에 Vercel 도메인이 없음 (끝에 `/` 붙이지 말 것) |
| 프론트에서 Mixed Content 차단 | 백엔드가 HTTP. 9장의 HTTPS 설정 필요 |
| `prisma migrate deploy` 타임아웃 | RDS 보안 그룹에 EC2 보안 그룹이 추가되지 않음 |
| EC2 재시작 후 접속 안 됨 | 퍼블릭 IP가 바뀜. 새 IP 확인 또는 Elastic IP 사용 |
