import prisma from "../../prisma/seed.js";
import bcrypt from "bcrypt";

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    const { encryptedPassword, ...userInfo } = user;

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const updateMe = async (req, res) => {
  try {
    const { image } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        image,
      },
    });

    const { encryptedPassword, ...userInfo } = updatedUser;

    return res.json(userInfo);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const updateMePassword = async (req, res) => {
  try {
    const { currentPassword, password, passwordConfirmation } = req.body;

    if (!currentPassword || !password || !passwordConfirmation) {
      return res.status(400).json({
        message: "필수 정보를 입력해주세요.",
      });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({
        message: "새 비밀번호가 일치하지 않습니다.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.encryptedPassword,
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "현재 비밀번호가 올바르지 않습니다.",
      });
    }

    // 2. 새 비밀번호 암호화
    const newEncryptedPassword = await bcrypt.hash(password, 10);

    // 3. DB 업데이트
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        encryptedPassword: newEncryptedPassword,
      },
    });

    // 4. 응답에서 비밀번호 제거
    const { encryptedPassword: _, ...userInfo } = updatedUser;

    res.json(userInfo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "서버 오류",
    });
  }
};

export const getMeProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;

    const skip = (page - 1) * pageSize;

    const where = {
      ownerId: req.user.id,
      ...(keyword && {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      }),
    };

    const [totalCount, products] = await Promise.all([
      prisma.product.count({
        where,
      }),

      prisma.product.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: {
          createdAt: "desc",
        },
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
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      tags: product.tags,
      favoriteCount: product.favoriteCount,
      ownerId: product.ownerId,
      ownerNickname: product.owner.nickname,
      createdAt: product.createdAt,
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

export const getMeFavorites = async (req, res) => {
  try {
    console.log(req.user);
    console.log(req.query);
    const { page = 1, pageSize = 10, keyword } = req.query;

    const skip = (page - 1) * pageSize;

    const where = {
      userId: req.user.id,
      ...(keyword && {
        product: {
          name: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      }),
    };

    const [totalCount, favorites] = await Promise.all([
      prisma.favorite.count({
        where,
      }),

      prisma.favorite.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: {
            include: {
              owner: {
                select: {
                  nickname: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const list = favorites.map((favorite) => ({
      id: favorite.product.id,
      name: favorite.product.name,
      description: favorite.product.description,
      price: favorite.product.price,
      images: favorite.product.images,
      tags: favorite.product.tags,
      favoriteCount: favorite.product.favoriteCount,
      ownerId: favorite.product.ownerId,
      ownerNickname: favorite.product.owner?.nickname,
      createdAt: favorite.product.createdAt,
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
