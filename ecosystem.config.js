// pm2 실행 설정. EC2에서 `pm2 start ecosystem.config.js --env production` 으로 띄운다.
module.exports = {
  apps: [
    {
      name: "panda-be",
      // ts-node가 아니라 빌드된 JS를 실행한다. 배포 서버에서 TS를 그때그때 컴파일하면
      // 메모리와 기동 시간이 모두 손해다.
      script: "dist/server.js",

      // 프리티어 t3.micro는 vCPU 2 / 메모리 1GB다. cluster로 여러 개 띄우면
      // 프로세스끼리 메모리를 다투다 OOM이 나기 쉬워서 단일 프로세스로 운영한다.
      instances: 1,
      exec_mode: "fork",

      // 메모리 누수로 서서히 부풀어 오르면 OOM으로 죽기 전에 알아서 재시작시킨다.
      max_memory_restart: "400M",

      // 코드 변경 감시는 개발용 기능이라 배포에서는 끈다.
      watch: false,

      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },

      error_file: "logs/error.log",
      out_file: "logs/out.log",
      // 로그 한 줄마다 시각을 남겨야 장애 시점을 추적할 수 있다.
      time: true,
    },
  ],
};
