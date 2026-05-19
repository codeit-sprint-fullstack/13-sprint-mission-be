import prisma from "../src/lib/prisma.js";

async function main() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  console.log("기존 데이터 삭제 완료");

  await prisma.product.create({
    data: {
      name: "중고 맥북 에어 M1",
      price: 780000,
      description: "생활기스 조금 있지만 상태 좋습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "로지텍 무선 마우스",
      price: 25000,
      description: "거의 새상품이고 배터리 포함입니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "게이밍 키보드",
      price: 45000,
      description: "청축이며 LED 정상 작동합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "아이패드 프로 11",
      price: 920000,
      description: "펜슬 포함 판매합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "에어팟 프로 2세대",
      price: 180000,
      description: "케이스 사용해서 상태 깨끗합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "컴퓨터 책상",
      price: 30000,
      description: "직접 가져가셔야 합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "LG 27인치 모니터",
      price: 120000,
      description: "FHD 144hz 지원합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "닌텐도 스위치",
      price: 240000,
      description: "동물의 숲 칩 포함입니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "플레이스테이션5",
      price: 550000,
      description: "디스크 버전이며 박스 있습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "헬스 덤벨 세트",
      price: 70000,
      description: "5kg~20kg 조절 가능합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "아이폰 14",
      price: 650000,
      description: "배터리 효율 91%입니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "갤럭시 탭 S8",
      price: 430000,
      description: "필름 붙여서 사용했습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "캠핑 의자",
      price: 15000,
      description: "접이식이고 사용감 적습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "브리츠 스피커",
      price: 20000,
      description: "음질 좋고 정상 작동합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "전자레인지",
      price: 35000,
      description: "자취방 정리로 판매합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "RTX 3070 그래픽카드",
      price: 320000,
      description: "채굴 이력 없습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "삼성 노트북",
      price: 410000,
      description: "대학생 과제용으로 사용했습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "자전거",
      price: 95000,
      description: "브레이크 점검 완료했습니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "독서용 스탠드",
      price: 10000,
      description: "밝기 조절 가능합니다.",
    },
  });

  await prisma.product.create({
    data: {
      name: "커피 머신",
      price: 50000,
      description: "캡슐 포함해서 드립니다.",
    },
  });

  await prisma.article.create({
    data: {
      title: "게시글 1",
      content: "게시글 내용 블라블라",
    },
  });

  await prisma.article.create({
    data: {
      title: "중고 거래 시 주의사항",
      content: "직거래 시 안전한 장소에서 만나세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "판다마켓 이용 팁",
      content: "찜 기능을 활용하면 관심 상품을 놓치지 않아요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "좋은 상품 사진 찍는 법",
      content: "밝은 곳에서 여러 각도로 찍으면 좋아요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "가격 협상 노하우",
      content: "합리적인 가격을 제시하면 거래 성사율이 높아집니다.",
    },
  });
  await prisma.article.create({
    data: {
      title: "택배 거래 안전하게 하는 법",
      content: "안전결제 서비스를 이용하는 걸 추천해요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "사기 거래 예방법",
      content: "선입금 요구하는 판매자는 주의하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "인기 중고 아이템 TOP 5",
      content: "전자기기, 의류, 가구 순으로 인기가 많아요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "상품 설명 잘 쓰는 법",
      content: "구매 시기, 상태, 하자 여부를 꼭 명시해주세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "중고 명품 구매 시 주의점",
      content: "정품 인증서와 영수증을 꼭 확인하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "겨울 의류 중고 거래 팁",
      content: "세탁 여부와 보관 상태를 꼭 확인하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "전자기기 중고 구매 체크리스트",
      content: "전원 켜지는지, 충전 되는지 반드시 확인하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "자전거 중고 구매 시 확인사항",
      content: "브레이크와 기어 상태를 직접 테스트해보세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "책 중고 거래 꿀팁",
      content: "필기 여부와 낙서를 미리 사진으로 공유해주세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "가구 직거래 시 주의사항",
      content: "실측 사이즈를 꼭 확인하고 운반 방법도 협의하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "게임기 중고 거래 팁",
      content: "정품 여부와 계정 초기화 여부를 확인하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "중고 카메라 구매 가이드",
      content: "셔터 횟수와 렌즈 상태를 꼭 확인하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "유아용품 중고 거래 주의점",
      content: "안전 기준 적합 여부와 파손 여부를 확인하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "운동기구 중고 거래 팁",
      content: "직접 작동해보고 소음 여부도 체크하세요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "판다마켓 신규 기능 소개",
      content: "이제 채팅으로 실시간 문의가 가능해졌어요.",
    },
  });
  await prisma.article.create({
    data: {
      title: "중고 거래 후기 남기는 법",
      content: "거래 후 솔직한 후기를 남기면 다음 거래에 도움이 돼요.",
    },
  });
  const product1 = await prisma.product.create({
    data: { name: "맥북", price: 780000, description: "상태 좋음" },
  });

  await prisma.productComment.create({
    data: {
      content: "상품 댓글 남겨봅니다",
      productId: product1.id, // 방금 생성된 id 참조
    },
  });
  const article1 = await prisma.article.create({
    data: { title: "테스트 게시글", content: "테스트 내용" },
  });

  await prisma.articleComment.create({
    data: {
      content: "게시글 댓글 남겨봅니다",
      articleId: article1.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("DB 연결 종료");
  });
