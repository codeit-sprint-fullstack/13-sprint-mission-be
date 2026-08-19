/*
  Warnings:

  - You are about to drop the column `userId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_userId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_userId_fkey";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
1
-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
