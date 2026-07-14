const productData = [
  {
    name: "맥북 프로",
    description: "2022년형 맥북 프로 14인치 팝니다. 상태 좋고 박스 있어요.",
    price: 1800000,
    tags: ["전자기기", "노트북"],
    images: [],
  },
  {
    name: "에어팟 프로",
    description: "거의 새 제품입니다. 케이스 포함해서 드려요.",
    price: 150000,
    tags: ["전자기기", "이어폰"],
    images: [],
  },
  {
    name: "캠핑 4인용 텐트",
    description: "작년에 두 번 쓴 텐트입니다. 사용감 적어요.",
    price: 90000,
    tags: ["캠핑"],
    images: [],
  },
  {
    name: "출퇴근용 자전거",
    description: "1년 정도 타던 자전거입니다. 직거래 선호합니다.",
    price: 120000,
    tags: ["스포츠"],
    images: [],
  },
  {
    name: "이케아 책상",
    description: "이사 때문에 급처합니다. 직접 픽업 가능하신 분만요.",
    price: 40000,
    tags: ["가구"],
    images: [],
  },
];

export async function seedProducts(prisma, users) {
  const products = [];
  for (let i = 0; i < productData.length; i++) {
    const owner = users[i % users.length];
    const product = await prisma.product.create({
      data: {
        ...productData[i],
        ownerId: owner.id,
      },
    });
    products.push(product);
  }

  return products;
}
