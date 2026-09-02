import productRepository from "../repositories/product.repository";
import productService from "./product.service";

jest.mock("../repositories/product.repository");
const mockedProductRepository = productRepository as jest.Mocked<
  typeof productRepository
>;

//Teardown
afterEach(() => {
  jest.clearAllMocks();
});

const productData = {
  id: 1,
  authorId: 10,
  name: "테스트 상품",
  description: "테스트 설명",
  price: 10000,
  images: ["url-old-1", "url-old-2"],
  tags: ["중고"],
  likeCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("createProduct", () => {
  test("전달받은 데이터로 상품을 생성해야 한다", async () => {
    //Setup
    const dto = {
      authorId: 10,
      images: ["url1"],
      name: "상품",
      description: "설명",
      price: 1000,
      tags: ["중고"],
    };
    mockedProductRepository.create.mockResolvedValue(productData);

    //Exercise
    const result = await productService.createProduct(dto);

    //Assertion
    expect(mockedProductRepository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(productData);
  });
});

describe("deleteProduct", () => {
  test("상품이 없으면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(
      productService.deleteProduct({ productId: 999, authorId: 1 }),
    ).rejects.toThrow("해당 상품을 찾을 수 없습니다.");
  });

  test("본인이 등록한 상품이 아니면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);

    //Exercise & Assertion
    await expect(
      productService.deleteProduct({
        productId: productData.id,
        authorId: 999,
      }),
    ).rejects.toThrow("본인이 등록한 상품이 아닙니다.");
  });

  test("정상적으로 삭제되어야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);

    //Exercise
    await productService.deleteProduct({
      productId: productData.id,
      authorId: productData.authorId,
    });

    //Assertion
    expect(mockedProductRepository.deleteById).toHaveBeenCalledWith(
      productData.id,
    );
  });
});

describe("updateProduct", () => {
  test("상품이 없으면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(
      productService.updateProduct({
        productId: 999,
        authorId: 10,
        images: [],
      }),
    ).rejects.toThrow("해당 상품을 찾을 수 없습니다.");
  });

  test("본인이 등록한 상품이 아니면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);

    //Exercise & Assertion
    await expect(
      productService.updateProduct({
        productId: productData.id,
        authorId: 999,
        images: [],
      }),
    ).rejects.toThrow("본인이 등록한 상품이 아닙니다.");
  });

  test("유지할 기존 이미지로 실제 상품 이미지가 아닌 값을 보내면 제외해야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);
    mockedProductRepository.update.mockResolvedValue(productData);

    //Exercise
    await productService.updateProduct({
      productId: productData.id,
      authorId: productData.authorId,
      images: ["url-new-1"],
      existingImages: ["url-old-1", "위조된-url"],
    });

    //Assertion
    expect(mockedProductRepository.update).toHaveBeenCalledWith(
      productData.id,
      expect.objectContaining({
        images: ["url-old-1", "url-new-1"],
      }),
    );
  });

  test("최종 이미지가 1개 미만이면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);

    //Exercise & Assertion
    await expect(
      productService.updateProduct({
        productId: productData.id,
        authorId: productData.authorId,
        images: [],
        existingImages: [],
      }),
    ).rejects.toThrow("이미지는 최소 1개 이상 3개 이하여야합니다.");
  });

  test("최종 이미지가 3개를 초과하면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);

    //Exercise & Assertion
    await expect(
      productService.updateProduct({
        productId: productData.id,
        authorId: productData.authorId,
        images: ["url-new-1", "url-new-2"],
        existingImages: productData.images,
      }),
    ).rejects.toThrow("이미지는 최소 1개 이상 3개 이하여야합니다.");
  });

  test("정상 입력이면 병합된 이미지로 상품을 수정해야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);
    const updated = { ...productData, name: "수정된 상품" };
    mockedProductRepository.update.mockResolvedValue(updated);

    //Exercise
    const result = await productService.updateProduct({
      productId: productData.id,
      authorId: productData.authorId,
      images: ["url-new-1"],
      name: "수정된 상품",
      description: productData.description,
      price: productData.price,
      tags: productData.tags,
      existingImages: ["url-old-1"],
    });

    //Assertion
    expect(mockedProductRepository.update).toHaveBeenCalledWith(
      productData.id,
      {
        name: "수정된 상품",
        description: productData.description,
        price: productData.price,
        tags: productData.tags,
        images: ["url-old-1", "url-new-1"],
      },
    );
    expect(result).toEqual(updated);
  });
});

describe("getProductList", () => {
  test("검색어가 있으면 상품 이름에 포함된 상품만 조회해야 한다", async () => {
    //Setup
    mockedProductRepository.findMany.mockResolvedValue([]);
    mockedProductRepository.count.mockResolvedValue(0);

    //Exercise
    await productService.getProductList({
      page: 1,
      pageSize: 10,
      sort: "recent",
      keyword: "아이패드",
    });

    //Assertion
    expect(mockedProductRepository.findMany).toHaveBeenCalledWith({
      where: { name: { contains: "아이패드", mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      skip: 0,
      take: 10,
    });
  });

  test("정렬이 좋아요순이면 좋아요 수 기준으로 정렬해야 한다", async () => {
    //Setup
    mockedProductRepository.findMany.mockResolvedValue([]);
    mockedProductRepository.count.mockResolvedValue(0);

    //Exercise
    await productService.getProductList({
      page: 2,
      pageSize: 5,
      sort: "favorite",
    });

    //Assertion
    expect(mockedProductRepository.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { likeCount: "desc" },
      skip: 5,
      take: 5,
    });
  });

  test("목록과 총 개수를 함께 반환해야 한다", async () => {
    //Setup
    mockedProductRepository.findMany.mockResolvedValue([productData]);
    mockedProductRepository.count.mockResolvedValue(1);

    //Exercise
    const result = await productService.getProductList({
      page: 1,
      pageSize: 10,
      sort: "recent",
    });

    //Assertion
    expect(result).toEqual({ list: [productData], totalProducts: 1 });
  });
});

describe("getProduct", () => {
  test("상품이 없으면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(
      productService.getProduct({ productId: 999 }),
    ).rejects.toThrow("존재하지 않는 상품입니다.");
  });

  test("비로그인 상태면 좋아요 여부를 조회하지 않고 좋아요를 안 한 것으로 반환해야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);

    //Exercise
    const result = await productService.getProduct({
      productId: productData.id,
    });

    //Assertion
    expect(mockedProductRepository.findLike).not.toHaveBeenCalled();
    expect(result).toEqual({ ...productData, isLiked: false });
  });

  test("좋아요를 누른 상태면 좋아요를 한 것으로 반환해야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);
    mockedProductRepository.findLike.mockResolvedValue({
      userId: 1,
      productId: productData.id,
    } as never);

    //Exercise
    const result = await productService.getProduct({
      productId: productData.id,
      authorId: 1,
    });

    //Assertion
    expect(mockedProductRepository.findLike).toHaveBeenCalledWith(
      1,
      productData.id,
    );
    expect(result).toEqual({ ...productData, isLiked: true });
  });

  test("좋아요를 누르지 않은 상태면 좋아요를 안 한 것으로 반환해야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);
    mockedProductRepository.findLike.mockResolvedValue(null);

    //Exercise
    const result = await productService.getProduct({
      productId: productData.id,
      authorId: 1,
    });

    //Assertion
    expect(result).toEqual({ ...productData, isLiked: false });
  });
});

describe("likeProduct", () => {
  test("상품이 없으면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(
      productService.likeProduct({ productId: 999, authorId: 1 }),
    ).rejects.toThrow("존재하지 않는 상품입니다.");
  });

  test("정상적으로 좋아요 처리가 되어야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);
    const likedProduct = {
      ...productData,
      likeCount: productData.likeCount + 1,
    };
    mockedProductRepository.likeTransaction.mockResolvedValue([
      likedProduct,
      { userId: 1, productId: productData.id },
    ] as never);

    //Exercise
    const result = await productService.likeProduct({
      productId: productData.id,
      authorId: 1,
    });

    //Assertion
    expect(mockedProductRepository.likeTransaction).toHaveBeenCalledWith(
      1,
      productData.id,
    );
    expect(result).toEqual({ ...likedProduct, isLiked: true });
  });
});

describe("unlikeProduct", () => {
  test("상품이 없으면 에러를 던져야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(null);

    //Exercise & Assertion
    await expect(
      productService.unlikeProduct({ productId: 999, authorId: 1 }),
    ).rejects.toThrow("존재하지 않는 상품입니다.");
  });

  test("정상적으로 좋아요 취소 처리가 되어야 한다", async () => {
    //Setup
    mockedProductRepository.findById.mockResolvedValue(productData);
    const unlikedProduct = { ...productData, likeCount: 0 };
    mockedProductRepository.unlikeTransaction.mockResolvedValue([
      unlikedProduct,
    ] as never);

    //Exercise
    const result = await productService.unlikeProduct({
      productId: productData.id,
      authorId: 1,
    });

    //Assertion
    expect(mockedProductRepository.unlikeTransaction).toHaveBeenCalledWith(
      1,
      productData.id,
    );
    expect(result).toEqual({ ...unlikedProduct, isLiked: false });
  });
});
