// product.schema.js
import { z } from "zod";

// 요구사항(상품 등록): "상품 등록 시 필요한 필드(이름, 설명, 가격 등)의 유효성을 검증하는 미들웨어를 구현합니다.
// -> multipart/form-data로 전송되므로 숫자 필드는 문자열로 들어옴 (z.coerce로 변환)
// tags는 문자열 배열을 JSON.stringify해서 보낸다고 가정 (예: '["전자기기","애플"]')
export const createProductSchema = z.object({
  name: z.string().min(1, "상품명을 입력해 주세요."),
  description: z.string().min(1, "상품 설명을 입력해 주세요."),
  price: z.coerce.number().int().nonnegative("가격은 0 이상이어야 합니다."),
  tags: z.string().optional(),
});

// 상품 수정은 모든 필드가 선택 (부분 수정 허용)
export const updateProductSchema = createProductSchema.partial();
