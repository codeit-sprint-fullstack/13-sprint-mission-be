#!/usr/bin/env bash
#
# EC2에서 코드를 최신으로 올리고 앱을 재기동한다.
# 배포할 때마다 이 스크립트 하나만 실행하면 된다.
#
#   ./scripts/deploy.sh
#
# 최초 실행이라면 scripts/setup-ec2.sh 를 먼저 돌려야 한다.

set -euo pipefail

APP_NAME=panda-be

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }

# 스크립트를 어디서 실행하든 프로젝트 루트에서 동작하도록 맞춘다.
cd "$(dirname "$0")/.."

if [[ ! -f .env.production ]]; then
  echo "오류: .env.production 이 없습니다. DEPLOY.md 6장을 참고해 먼저 작성하세요." >&2
  exit 1
fi

export NODE_ENV=production

log "1/5 최신 코드 받기"
git pull

log "2/5 의존성 설치"
# npm ci는 package-lock.json 기준으로 정확히 재현 설치한다.
# devDependencies도 필요하다 — tsc가 devDependencies에 있어서 빌드에 쓰인다.
npm ci

log "3/5 DB 마이그레이션 적용"
# migrate dev가 아니라 deploy를 쓴다.
# deploy는 이미 만들어진 마이그레이션만 적용하고, 스키마를 새로 생성하거나
# 데이터를 지우지 않는다. 배포 환경에서 안전한 쪽이다.
npx prisma migrate deploy

log "4/5 빌드"
npm run build

log "5/5 앱 재기동"
mkdir -p logs
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  # reload는 restart와 달리 기존 프로세스를 살려둔 채 교체를 시도한다.
  pm2 reload ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env production
  echo ""
  echo "최초 기동입니다. 재부팅 후에도 자동으로 뜨게 하려면:"
  echo "  pm2 startup     # 출력되는 sudo 명령어를 복사해서 실행"
  echo "  pm2 save"
fi

pm2 save > /dev/null 2>&1 || true

log "상태 확인"
pm2 status

echo ""
echo "헬스 체크:"
curl -fsS http://localhost:3000/health && echo "" || echo "  실패 — pm2 logs $APP_NAME 으로 원인을 확인하세요."
