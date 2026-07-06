import prisma from "../config/prisma.js";

// 심화 요구사항: 프로젝트의 구조와 복잡성을 관리하기 위해 MVC 패턴이나 Layered Architecture와 같은 설계 방식을 적용해 보세요.
// 컨트롤러는 여기 있는 함수만 호출하고, Prisma 쿼리 자체는 이 파일 안에만 존재하게 해서 "DB 접근 로직"과 "요청 처리/인가 로직"을 분리함

// 요구사항(인증): "회원가입 시 email 중복 확인"
export function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

// 요구사항(인증): "password는 해싱해 저장합니다." -> 해싱은 컨트롤러(서비스 로직)에서 처리하고
// 여기는 이미 해싱된 encryptedPassword를 그대로 저장만 함
export function create({ email, nickname, encryptedPassword, image }) {
  return prisma.user.create({
    data: { email, nickname, encryptedPassword, image },
  });
}
