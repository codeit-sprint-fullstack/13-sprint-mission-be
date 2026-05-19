export const products = [
  // tags 2개 + comments 2개 (10개)
  {
    name: "무선 이어폰",
    description: "고음질 무선 이어폰으로 편리하게 음악을 즐기세요.",
    price: 89000,
    tags: { create: [{ name: "전자기기" }, { name: "음향" }] },
    comments: {
      create: [
        { content: "음질이 정말 좋아요!" },
        { content: "배터리가 오래가네요." },
      ],
    },
  },
  {
    name: "스마트 체중계",
    description: "앱 연동으로 체중 변화를 기록하는 스마트 체중계입니다.",
    price: 45000,
    tags: { create: [{ name: "건강" }, { name: "스마트홈" }] },
    comments: {
      create: [
        { content: "앱 연동이 편리해요." },
        { content: "디자인이 깔끔합니다." },
      ],
    },
  },
  {
    name: "캠핑용 접이식 의자",
    description: "가볍고 튼튼한 캠핑용 접이식 의자입니다.",
    price: 32000,
    tags: { create: [{ name: "캠핑" }, { name: "아웃도어" }] },
    comments: {
      create: [
        { content: "가볍고 휴대하기 좋아요." },
        { content: "생각보다 튼튼해요." },
      ],
    },
  },
  {
    name: "핸드메이드 컵",
    description: "장인이 직접 만든 핸드메이드 도자기 컵입니다.",
    price: 28000,
    tags: { create: [{ name: "주방" }, { name: "핸드메이드" }] },
    comments: {
      create: [
        { content: "선물용으로 딱 좋아요." },
        { content: "질감이 너무 좋습니다." },
      ],
    },
  },
  {
    name: "요가 매트",
    description: "미끄럼 방지 기능이 있는 고품질 요가 매트입니다.",
    price: 38000,
    tags: { create: [{ name: "운동" }, { name: "건강" }] },
    comments: {
      create: [
        { content: "쿠션감이 좋아요." },
        { content: "미끄럼 방지가 잘 돼요." },
      ],
    },
  },
  {
    name: "가죽 카드지갑",
    description: "슬림한 디자인의 천연 가죽 카드지갑입니다.",
    price: 25000,
    tags: { create: [{ name: "패션" }, { name: "가죽" }] },
    comments: {
      create: [
        { content: "품질이 좋아요." },
        { content: "슬림해서 좋습니다." },
      ],
    },
  },
  {
    name: "USB-C 충전기",
    description: "65W 고속 충전을 지원하는 USB-C 충전기입니다.",
    price: 29000,
    tags: { create: [{ name: "전자기기" }, { name: "충전" }] },
    comments: {
      create: [
        { content: "충전 속도가 빠릅니다." },
        { content: "발열이 적어요." },
      ],
    },
  },
  {
    name: "천연 비누 세트",
    description: "피부에 순한 천연 재료로 만든 비누 세트입니다.",
    price: 18000,
    tags: { create: [{ name: "뷰티" }, { name: "천연" }] },
    comments: {
      create: [
        { content: "향이 은은해요." },
        { content: "피부가 촉촉해졌어요." },
      ],
    },
  },
  {
    name: "원목 도마",
    description: "고급 원목으로 제작된 주방용 도마입니다.",
    price: 42000,
    tags: { create: [{ name: "주방" }, { name: "원목" }] },
    comments: {
      create: [
        { content: "두께감이 좋아요." },
        { content: "원목 향이 좋습니다." },
      ],
    },
  },
  {
    name: "노트북 거치대",
    description: "높낮이 조절이 가능한 알루미늄 노트북 거치대입니다.",
    price: 35000,
    tags: { create: [{ name: "전자기기" }, { name: "사무용품" }] },
    comments: {
      create: [
        { content: "목 통증이 줄었어요." },
        { content: "견고하고 안정적입니다." },
      ],
    },
  },

  // tags 1개 + comments 2개 (10개)
  {
    name: "보온 텀블러",
    description: "12시간 보온 보냉이 가능한 스테인리스 텀블러입니다.",
    price: 22000,
    tags: { create: [{ name: "주방" }] },
    comments: {
      create: [
        { content: "보온이 잘 돼요." },
        { content: "사이즈가 딱 좋아요." },
      ],
    },
  },
  {
    name: "면 에코백",
    description: "환경을 생각한 튼튼한 면 소재 에코백입니다.",
    price: 12000,
    tags: { create: [{ name: "패션" }] },
    comments: {
      create: [
        { content: "소재가 좋아요." },
        { content: "크기가 넉넉합니다." },
      ],
    },
  },
  {
    name: "독서대",
    description: "각도 조절이 가능한 접이식 독서대입니다.",
    price: 15000,
    tags: { create: [{ name: "사무용품" }] },
    comments: {
      create: [
        { content: "각도 조절이 편리해요." },
        { content: "가격 대비 좋아요." },
      ],
    },
  },
  {
    name: "아로마 디퓨저",
    description: "초음파 방식의 가습 기능이 있는 아로마 디퓨저입니다.",
    price: 33000,
    tags: { create: [{ name: "인테리어" }] },
    comments: {
      create: [
        { content: "향이 은은하게 퍼져요." },
        { content: "가습 기능도 좋아요." },
      ],
    },
  },
  {
    name: "손뜨개 수세미",
    description: "천연 소재로 손수 만든 손뜨개 수세미입니다.",
    price: 5000,
    tags: { create: [{ name: "주방" }] },
    comments: {
      create: [
        { content: "설거지가 편해졌어요." },
        { content: "친환경 제품이라 좋아요." },
      ],
    },
  },
  {
    name: "미니 선풍기",
    description: "USB 충전식 휴대용 미니 선풍기입니다.",
    price: 16000,
    tags: { create: [{ name: "전자기기" }] },
    comments: {
      create: [
        { content: "바람이 생각보다 강해요." },
        { content: "소음이 적어요." },
      ],
    },
  },
  {
    name: "메모리폼 베개",
    description: "경추를 지지하는 메모리폼 소재의 베개입니다.",
    price: 48000,
    tags: { create: [{ name: "침구" }] },
    comments: {
      create: [
        { content: "목 통증이 줄었어요." },
        { content: "수면의 질이 높아졌어요." },
      ],
    },
  },
  {
    name: "유리 밀폐용기 세트",
    description: "전자레인지 사용 가능한 유리 밀폐용기 세트입니다.",
    price: 27000,
    tags: { create: [{ name: "주방" }] },
    comments: {
      create: [
        { content: "밀폐력이 좋아요." },
        { content: "전자레인지에 그냥 써도 돼서 편해요." },
      ],
    },
  },
  {
    name: "등산용 스틱",
    description: "가볍고 내구성 좋은 알루미늄 등산용 스틱입니다.",
    price: 36000,
    tags: { create: [{ name: "아웃도어" }] },
    comments: {
      create: [
        { content: "가벼워서 좋아요." },
        { content: "그립감이 편안해요." },
      ],
    },
  },
  {
    name: "다이어리",
    description: "하루를 기록하는 365일 날짜형 다이어리입니다.",
    price: 14000,
    tags: { create: [{ name: "문구" }] },
    comments: {
      create: [
        { content: "종이 질이 좋아요." },
        { content: "레이아웃이 사용하기 편해요." },
      ],
    },
  },

  // tags 1개 + comments 1개 (20개)
  {
    name: "대나무 칫솔",
    description: "친환경 대나무 소재로 만든 칫솔입니다.",
    price: 3500,
    tags: { create: [{ name: "위생" }] },
    comments: { create: [{ content: "친환경이라 좋아요." }] },
  },
  {
    name: "실리콘 주방장갑",
    description: "내열성이 뛰어난 실리콘 소재 주방장갑입니다.",
    price: 8000,
    tags: { create: [{ name: "주방" }] },
    comments: { create: [{ content: "열 차단이 잘 돼요." }] },
  },
  {
    name: "모니터 받침대",
    description: "수납 공간이 있는 원목 모니터 받침대입니다.",
    price: 39000,
    tags: { create: [{ name: "사무용품" }] },
    comments: { create: [{ content: "수납 공간이 유용해요." }] },
  },
  {
    name: "반려식물 화분 세트",
    description: "인테리어에 어울리는 소형 화분과 식물 세트입니다.",
    price: 20000,
    tags: { create: [{ name: "인테리어" }] },
    comments: { create: [{ content: "집 분위기가 살아났어요." }] },
  },
  {
    name: "낚시용 모자",
    description: "자외선 차단 기능이 있는 낚시용 버킷햇입니다.",
    price: 17000,
    tags: { create: [{ name: "아웃도어" }] },
    comments: { create: [{ content: "챙이 넓어서 좋아요." }] },
  },
  {
    name: "손난로",
    description: "USB 충전식 휴대용 손난로입니다.",
    price: 19000,
    tags: { create: [{ name: "겨울용품" }] },
    comments: { create: [{ content: "발열이 빠릅니다." }] },
  },
  {
    name: "캔들",
    description: "천연 소이왁스로 만든 향초 캔들입니다.",
    price: 13000,
    tags: { create: [{ name: "인테리어" }] },
    comments: { create: [{ content: "향이 너무 좋아요." }] },
  },
  {
    name: "접이식 우산",
    description: "자동 개폐 기능이 있는 3단 접이식 우산입니다.",
    price: 21000,
    tags: { create: [{ name: "생활용품" }] },
    comments: { create: [{ content: "자동 개폐가 편리해요." }] },
  },
  {
    name: "실내화",
    description: "발이 편안한 메모리폼 실내화입니다.",
    price: 16000,
    tags: { create: [{ name: "생활용품" }] },
    comments: { create: [{ content: "발이 편안해요." }] },
  },
  {
    name: "전동 칫솔",
    description: "3가지 모드를 지원하는 전동 칫솔입니다.",
    price: 52000,
    tags: { create: [{ name: "위생" }] },
    comments: { create: [{ content: "치아가 깨끗해진 느낌이에요." }] },
  },
  {
    name: "드립 커피 필터",
    description: "산소 표백 처리된 드립 커피 필터입니다.",
    price: 4500,
    tags: { create: [{ name: "주방" }] },
    comments: { create: [{ content: "커피 맛이 깔끔해요." }] },
  },
  {
    name: "목욕 수건 세트",
    description: "흡수력이 뛰어난 고급 면 소재 목욕 수건 세트입니다.",
    price: 24000,
    tags: { create: [{ name: "욕실" }] },
    comments: { create: [{ content: "흡수력이 좋아요." }] },
  },
  {
    name: "롤러 마사지기",
    description: "목과 어깨 근육을 풀어주는 롤러 마사지기입니다.",
    price: 31000,
    tags: { create: [{ name: "건강" }] },
    comments: { create: [{ content: "근육이 풀리는 느낌이에요." }] },
  },
  {
    name: "여행용 파우치",
    description: "방수 소재의 여행용 세면도구 파우치입니다.",
    price: 14000,
    tags: { create: [{ name: "여행" }] },
    comments: { create: [{ content: "수납이 잘 돼요." }] },
  },
  {
    name: "무릎 담요",
    description: "사무실에서 사용하기 좋은 소형 무릎 담요입니다.",
    price: 18000,
    tags: { create: [{ name: "침구" }] },
    comments: { create: [{ content: "따뜻하고 가벼워요." }] },
  },
  {
    name: "스포츠 양말 세트",
    description: "쿠션감이 좋은 스포츠용 양말 5켤레 세트입니다.",
    price: 15000,
    tags: { create: [{ name: "운동" }] },
    comments: { create: [{ content: "쿠션감이 좋아요." }] },
  },
  {
    name: "펜 홀더",
    description: "책상 위를 정리해주는 원목 펜 홀더입니다.",
    price: 9000,
    tags: { create: [{ name: "사무용품" }] },
    comments: { create: [{ content: "책상이 깔끔해졌어요." }] },
  },
  {
    name: "고양이 장난감 세트",
    description: "고양이가 좋아하는 다양한 장난감 세트입니다.",
    price: 12000,
    tags: { create: [{ name: "반려동물" }] },
    comments: { create: [{ content: "고양이가 너무 좋아해요." }] },
  },
  {
    name: "강아지 간식",
    description: "국내산 재료로 만든 건강한 강아지 간식입니다.",
    price: 8500,
    tags: { create: [{ name: "반려동물" }] },
    comments: { create: [{ content: "강아지가 잘 먹어요." }] },
  },
  {
    name: "낚시 채비 세트",
    description: "입문자를 위한 민물낚시 채비 세트입니다.",
    price: 23000,
    tags: { create: [{ name: "아웃도어" }] },
    comments: { create: [{ content: "구성이 충실해요." }] },
  },

  // tags 없음 + comments 없음 (20개)
  {
    name: "주방용 타이머",
    description: "자석 부착이 가능한 주방용 타이머입니다.",
    price: 7000,
  },
  {
    name: "접착식 메모지",
    description: "다양한 색상의 접착식 메모지 세트입니다.",
    price: 3000,
  },
  {
    name: "빨래 건조대",
    description: "접이식 스테인리스 빨래 건조대입니다.",
    price: 26000,
  },
  {
    name: "자전거 자물쇠",
    description: "번호 조합식 자전거 자물쇠입니다.",
    price: 11000,
  },
  {
    name: "샤워 필터",
    description: "염소를 제거해주는 샤워 필터입니다.",
    price: 19000,
  },
  {
    name: "미끄럼 방지 매트",
    description: "욕실용 미끄럼 방지 매트입니다.",
    price: 13000,
  },
  {
    name: "반찬통 세트",
    description: "냉장고 정리에 좋은 반찬통 세트입니다.",
    price: 17000,
  },
  {
    name: "자동차 방향제",
    description: "은은한 향의 차량용 방향제입니다.",
    price: 6000,
  },
  {
    name: "형광펜 세트",
    description: "부드럽게 써지는 형광펜 6색 세트입니다.",
    price: 5500,
  },
  {
    name: "전기 모기채",
    description: "충전식 전기 모기채입니다.",
    price: 14000,
  },
  {
    name: "손목 보호대",
    description: "운동 시 손목을 보호해주는 보호대입니다.",
    price: 9500,
  },
  {
    name: "냉장고 탈취제",
    description: "냉장고 냄새를 제거하는 탈취제입니다.",
    price: 4000,
  },
  {
    name: "유리 빨대 세트",
    description: "친환경 유리 빨대와 세척 솔 세트입니다.",
    price: 8000,
  },
  {
    name: "책 받침대",
    description: "독서 시 목 부담을 줄여주는 책 받침대입니다.",
    price: 12000,
  },
  {
    name: "고무장갑",
    description: "내구성이 좋은 주방용 고무장갑입니다.",
    price: 3500,
  },
  {
    name: "걷기 운동화",
    description: "발이 편안한 워킹 전용 운동화입니다.",
    price: 58000,
  },
  {
    name: "낮잠 베개",
    description: "사무실 낮잠용 U자형 베개입니다.",
    price: 16000,
  },
  {
    name: "미니 화이트보드",
    description: "냉장고에 붙이는 미니 화이트보드입니다.",
    price: 7500,
  },
  {
    name: "케이블 정리함",
    description: "책상 위 케이블을 정리하는 정리함입니다.",
    price: 11000,
  },
  {
    name: "텀블러 세척 브러시",
    description: "텀블러 내부를 깨끗이 닦는 세척 브러시입니다.",
    price: 4500,
  },
];

export const articles = [
  // comments 3개 (10개)
  {
    title: "겨울철 피부 관리 꿀팁",
    content:
      "건조한 겨울철에 피부를 촉촉하게 유지하는 방법을 공유합니다. 보습 크림과 수분 마스크를 꾸준히 사용하는 것이 중요합니다.",
    comments: {
      create: [
        { content: "정말 도움이 됐어요!" },
        { content: "저도 따라해봤는데 효과 있어요." },
        { content: "보습 크림 추천해주실 수 있나요?" },
      ],
    },
  },
  {
    title: "집에서 즐기는 홈카페 레시피",
    content:
      "카페 부럽지 않은 홈카페 음료 레시피를 소개합니다. 달고나 커피부터 딸기라떼까지 다양한 레시피를 담았습니다.",
    comments: {
      create: [
        { content: "달고나 커피 진짜 맛있겠다." },
        { content: "레시피 자세하게 알려주세요." },
        { content: "직접 만들어봤는데 대박이에요." },
      ],
    },
  },
  {
    title: "미니멀라이프 시작하는 방법",
    content:
      "불필요한 물건을 줄이고 삶을 단순화하는 미니멀라이프에 대해 이야기합니다. 물건 정리부터 소비 습관까지 함께 바꿔보세요.",
    comments: {
      create: [
        { content: "저도 미니멀라이프 도전 중이에요." },
        { content: "좋은 글 감사합니다." },
        { content: "물건 버리는 기준이 궁금해요." },
      ],
    },
  },
  {
    title: "반려식물 키우기 입문 가이드",
    content:
      "식물 초보자도 쉽게 키울 수 있는 반려식물 종류와 관리 방법을 소개합니다. 물 주기, 햇빛, 분갈이까지 정리했습니다.",
    comments: {
      create: [
        { content: "몬스테라 키우고 싶어요." },
        { content: "물 주기가 제일 어렵더라고요." },
        { content: "입문자에게 딱인 글이네요." },
      ],
    },
  },
  {
    title: "자취방 인테리어 꾸미기",
    content:
      "좁은 자취방도 예쁘게 꾸밀 수 있는 인테리어 아이디어를 공유합니다. 저렴하게 분위기를 바꾸는 방법들을 담았습니다.",
    comments: {
      create: [
        { content: "조명 바꾸니 분위기 달라졌어요." },
        { content: "포스터 어디서 구매하셨나요?" },
        { content: "이런 글 계속 올려주세요!" },
      ],
    },
  },
  {
    title: "주 3회 운동 루틴 공유",
    content:
      "무리하지 않고 꾸준히 할 수 있는 주 3회 운동 루틴을 소개합니다. 홈트레이닝과 러닝을 조합했습니다.",
    comments: {
      create: [
        { content: "따라해봤는데 딱 좋은 강도네요." },
        { content: "홈트 루틴 더 자세히 알려주세요." },
        { content: "꾸준히 해보겠습니다." },
      ],
    },
  },
  {
    title: "독서 습관 만들기",
    content:
      "바쁜 일상 속에서도 책을 읽는 습관을 만드는 방법을 이야기합니다. 하루 10페이지부터 시작해보세요.",
    comments: {
      create: [
        { content: "오늘부터 시작해볼게요." },
        { content: "책 추천도 해주세요." },
        { content: "독서 기록 어떻게 하세요?" },
      ],
    },
  },
  {
    title: "건강한 도시락 만들기",
    content:
      "영양 균형을 맞춘 건강한 도시락 레시피를 공유합니다. 간단하게 만들 수 있는 메뉴 위주로 구성했습니다.",
    comments: {
      create: [
        { content: "내일 바로 만들어봐야겠어요." },
        { content: "칼로리도 알려주시면 좋겠어요." },
        { content: "레시피 저장했어요." },
      ],
    },
  },
  {
    title: "재테크 입문자를 위한 가이드",
    content:
      "처음 재테크를 시작하는 분들을 위해 기본 개념부터 투자 방법까지 쉽게 설명합니다.",
    comments: {
      create: [
        { content: "정말 이해하기 쉽게 설명해줬어요." },
        { content: "ETF 투자 더 알고 싶어요." },
        { content: "입문자한테 최고의 글이네요." },
      ],
    },
  },
  {
    title: "여름 캠핑 준비물 체크리스트",
    content:
      "여름 캠핑을 떠나기 전 꼭 챙겨야 할 준비물 체크리스트를 정리했습니다. 처음 캠핑하는 분들께 도움이 되길 바랍니다.",
    comments: {
      create: [
        { content: "덕분에 빠진 거 없이 챙겼어요." },
        { content: "텐트 추천도 해주세요." },
        { content: "체크리스트 저장해뒀어요." },
      ],
    },
  },

  // comments 2개 (10개)
  {
    title: "커피 원두 고르는 방법",
    content:
      "다양한 커피 원두의 종류와 특징을 설명하고, 입맛에 맞는 원두를 고르는 방법을 안내합니다.",
    comments: {
      create: [
        { content: "원두 선택이 늘 어려웠는데 도움됐어요." },
        { content: "에티오피아 원두 추천해요." },
      ],
    },
  },
  {
    title: "주방 수납 정리 꿀팁",
    content:
      "주방을 깔끔하게 정리하는 수납 방법을 공유합니다. 냉장고 정리부터 싱크대 수납까지 담았습니다.",
    comments: {
      create: [
        { content: "냉장고 정리 바로 따라했어요." },
        { content: "수납함 어디서 사셨어요?" },
      ],
    },
  },
  {
    title: "초보자를 위한 러닝 가이드",
    content:
      "처음 러닝을 시작하는 분들을 위한 페이스 관리와 러닝 자세를 안내합니다.",
    comments: {
      create: [
        { content: "덕분에 무릎 통증 없이 뛸 수 있어요." },
        { content: "러닝화 추천도 부탁드려요." },
      ],
    },
  },
  {
    title: "반려동물 첫 입양 준비하기",
    content:
      "강아지 혹은 고양이를 처음 입양하기 전에 준비해야 할 것들을 정리했습니다.",
    comments: {
      create: [
        { content: "입양 전에 봤더라면 좋았을 글이에요." },
        { content: "고양이 입양 후기도 써주세요." },
      ],
    },
  },
  {
    title: "무지출 챌린지 후기",
    content:
      "한 달 동안 무지출 챌린지를 하면서 느낀 점과 절약 방법을 공유합니다.",
    comments: {
      create: [
        { content: "저도 도전해봐야겠어요." },
        { content: "한 달에 얼마나 절약하셨어요?" },
      ],
    },
  },
  {
    title: "손쉽게 만드는 발효 음식",
    content:
      "집에서 쉽게 만들 수 있는 발효 음식 레시피를 소개합니다. 요거트와 김치 담그는 방법을 담았습니다.",
    comments: {
      create: [
        { content: "요거트 만들기 도전해봤어요." },
        { content: "김치 레시피 자세히 부탁드려요." },
      ],
    },
  },
  {
    title: "스트레칭 루틴 10분",
    content:
      "하루 10분으로 온몸을 풀어주는 스트레칭 루틴을 소개합니다. 기상 후 또는 취침 전에 해보세요.",
    comments: {
      create: [
        { content: "아침마다 따라하고 있어요." },
        { content: "허리 스트레칭 더 알려주세요." },
      ],
    },
  },
  {
    title: "사진 잘 찍는 스마트폰 촬영 팁",
    content: "스마트폰으로 멋진 사진을 찍는 구도와 조명 활용법을 소개합니다.",
    comments: {
      create: [
        { content: "사진이 확실히 달라졌어요." },
        { content: "야간 촬영 팁도 알려주세요." },
      ],
    },
  },
  {
    title: "감사 일기 쓰는 법",
    content:
      "매일 감사한 일을 기록하면서 긍정적인 마음을 유지하는 감사 일기 쓰는 방법을 공유합니다.",
    comments: {
      create: [
        { content: "오늘부터 써보려고요." },
        { content: "꾸준히 쓰는 비결이 뭔가요?" },
      ],
    },
  },
  {
    title: "여행 짐 가볍게 싸는 방법",
    content:
      "장기 여행도 캐리어 하나로 충분하게, 짐을 최소화하는 패킹 방법을 소개합니다.",
    comments: {
      create: [
        { content: "이 방법대로 하니까 진짜 가벼워졌어요." },
        { content: "옷 개는 방법도 알려주세요." },
      ],
    },
  },
];
