import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  //   await prisma.스키마1.deleteMany();
  //   await prisma.스키마2.deleteMany();
  //   const 스키마s = await prisma.스키마.createMany({data: [{필드: @@}]})
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default prisma;
