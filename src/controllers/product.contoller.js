import prisma from "../../prisma/seed.js";

export const postProducts = async (req, res) => {
  try {
    const { images, tags, price, description, name } = req.body;

    const product = await prisma.product.create({
      data: {
        images,
        tags,
        price,
        description,
        name,
        ownerId: req.user.id,
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    res.status(201).json({
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images,
      tags: product.tags,
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, orderBy, keyword } = req.query;

    const pageNumber = Number(page);
    const size = Number(pageSize);

    const skip = (pageNumber - 1) * size;

    const where = {
      ...(keyword && {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      }),
    };

    let orderByCondition = {
      createdAt: "desc",
    };

    if (orderBy === "favorite") {
      orderByCondition = {
        favoriteCount: "desc",
      };
    }

    if (orderBy === "recent") {
      orderByCondition = {
        createdAt: "desc",
      };
    }

    const [totalCount, products] = await Promise.all([
      prisma.product.count({
        where,
      }),

      prisma.product.findMany({
        where,
        skip,
        take: size,
        orderBy: orderByCondition,
        include: {
          owner: {
            select: {
              nickname: true,
            },
          },
        },
      }),
    ]);

    const list = products.map((product) => ({
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images,
      tags: product.tags,
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
    }));

    res.json({
      totalCount,
      list,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const getProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    res.json({
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images,
      tags: product.tags,
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const patchProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const { images, tags, price, description, name } = req.body;

    // 1. 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    // 2. 본인 상품인지 확인
    if (product.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "수정 권한이 없습니다.",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        images,
        tags,
        price,
        description,
        name,
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
      },
    });

    res.json({
      createdAt: updatedProduct.createdAt,
      favoriteCount: updatedProduct.favoriteCount,
      ownerNickname: updatedProduct.owner.nickname,
      ownerId: updatedProduct.ownerId,
      images: updatedProduct.images,
      tags: updatedProduct.tags,
      price: updatedProduct.price,
      description: updatedProduct.description,
      name: updatedProduct.name,
      id: updatedProduct.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const deleteProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    // 2. 본인 상품인지 확인
    if (product.ownerId !== req.user.id) {
      return res.status(403).json({
        message: "삭제 권한이 없습니다.",
      });
    }

    await prisma.product.delete({
      where: {
        id: Number(productId),
      },
    });

    res.status(200).json({
      message: "삭제 완료",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const postProductFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. 상품 존재 확인
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "상품을 찾을 수 없습니다.",
      });
    }

    // 2. 좋아요 생성
    await prisma.favorite.create({
      data: {
        userId: req.user.id,
        productId: Number(productId),
      },
    });

    // 3. 상품 favoriteCount 증가
    await prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        favoriteCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json({
      message: "상품에 좋아요를 등록했습니다.",
    });
  } catch (error) {
    console.error(error);

    // 이미 찜한 상품
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "이미 좋아요가 등록된 상품입니다.",
      });
    }

    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const deleteProductFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: Number(productId),
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({
        message: "좋아요 등록 내역이 없습니다.",
      });
    }

    // 1. 좋아요 삭제
    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    // 2. favoriteCount 감소
    await prisma.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        favoriteCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ message: "좋아요 삭제 완료" });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
};
