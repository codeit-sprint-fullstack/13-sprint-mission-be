#!/usr/bin/env bash
#
# EC2(Ubuntu 24.04)에서 최초 1회만 실행하는 서버 준비 스크립트.
#
#   chmod +x scripts/setup-ec2.sh
#   ./scripts/setup-ec2.sh
#
# 여러 번 실행해도 안전하도록(멱등하게) 작성했다.

set -euo pipefail

NODE_MAJOR=22
SWAP_SIZE=2G

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }

# ─────────────────────────────────────────────────────────────
log "1/5 패키지 목록 최신화"
sudo apt-get update -y

# ─────────────────────────────────────────────────────────────
# t3.micro는 메모리가 1GB뿐이라 npm ci와 tsc 빌드 도중 OOM으로 죽는다.
# 스왑을 미리 잡아두지 않으면 배포 단계에서 반드시 막힌다.
log "2/5 스왑 ${SWAP_SIZE} 설정"
if sudo swapon --show | grep -q '/swapfile'; then
  echo "  이미 활성화되어 있어 건너뜁니다."
else
  sudo fallocate -l "$SWAP_SIZE" /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  # 재부팅 후에도 유지되도록 등록 (중복 등록 방지)
  if ! grep -q '^/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab > /dev/null
  fi
  echo "  완료."
fi
free -h

# ─────────────────────────────────────────────────────────────
log "3/5 Node.js ${NODE_MAJOR}.x 설치"
if command -v node > /dev/null && [[ "$(node -v)" == v${NODE_MAJOR}.* ]]; then
  echo "  이미 설치됨: $(node -v)"
else
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# bcrypt가 네이티브 모듈이라, 미리 빌드된 바이너리가 없으면 직접 컴파일해야 한다.
sudo apt-get install -y build-essential python3

node -v && npm -v

# ─────────────────────────────────────────────────────────────
log "4/5 pm2 설치"
if command -v pm2 > /dev/null; then
  echo "  이미 설치됨: $(pm2 -v)"
else
  sudo npm install -g pm2
fi

# ─────────────────────────────────────────────────────────────
log "5/5 Nginx 설치"
if command -v nginx > /dev/null; then
  echo "  이미 설치됨: $(nginx -v 2>&1)"
else
  sudo apt-get install -y nginx
fi

# ─────────────────────────────────────────────────────────────
cat <<'DONE'

서버 준비가 끝났습니다. 다음 순서로 진행하세요.

  1) 저장소를 클론하고 해당 폴더로 이동
  2) .env.production 작성 (DEPLOY.md 6장 참고)
       - 액세스 키는 넣지 마세요. EC2에 붙인 IAM Role이 대신합니다.
  3) ./scripts/deploy.sh 실행
  4) Nginx 설정 적용:
       sudo cp deploy/nginx.conf /etc/nginx/sites-available/panda
       sudo ln -sf /etc/nginx/sites-available/panda /etc/nginx/sites-enabled/panda
       sudo rm -f /etc/nginx/sites-enabled/default
       sudo nginx -t && sudo systemctl reload nginx

DONE
