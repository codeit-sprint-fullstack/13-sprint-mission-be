-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;
