import prisma from "../config/prisma.js";

// 요구사항(인증): "회원가입 시 email 중복 확인"
export function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

// 요구사항(인증): "password는 해싱해 저장합니다." -> 해싱은 컨트롤러에서 처리하고
// 여기는 이미 해싱된 encryptedPassword를 그대로 저장만 함
export function create({ email, nickname, encryptedPassword, image }) {
  return prisma.user.create({
    data: { email, nickname, encryptedPassword, image },
  });
}
