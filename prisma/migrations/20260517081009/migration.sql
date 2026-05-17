/*
  Warnings:

  - You are about to drop the `articls` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "articls" DROP CONSTRAINT "articls_userId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_userId_fkey";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "articleId" DROP NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- DropTable
DROP TABLE "articls";

-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "favorite_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
