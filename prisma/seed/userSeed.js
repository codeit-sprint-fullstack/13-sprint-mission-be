import bcrypt from "bcrypt";

const userData = [
  { nickName: "판다코더", email: "panda1@example.com" },
  { nickName: "코드리뷰어", email: "panda2@example.com" },
  { nickName: "버그헌터", email: "panda3@example.com" },
  { nickName: "새싹개발자", email: "panda4@example.com" },
  { nickName: "밤샘개발자", email: "panda5@example.com" },
];

export async function seedUsers(prisma) {
  const encryptedpassword = await bcrypt.hash("password123!", 10);

  const users = [];
  for (const data of userData) {
    const user = await prisma.user.create({
      data: {
        ...data,
        encryptedpassword,
      },
    });
    users.push(user);
  }

  return users;
}
